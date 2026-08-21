import bcrypt from 'bcryptjs';
import { getConnection, sql } from '../config/db.js';
import { getLocalData, saveLocalData } from '../config/localStore.js';

const DEFAULT_ADMIN = {
  id: 1,
  username: 'admin',
  name: 'Administrador LuxSur',
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString()
};

/**
 * Obtener todos los usuarios (sin exponer los hashes de contraseña)
 */
export async function getAllUsers(req, res) {
  try {
    try {
      const pool = await getConnection();
      let users = [];

      // 1. Intentar consultar tabla usuarios
      try {
        const result = await pool.request().query(`
          SELECT id, usuario, nombre, rol, activo, createdAt, updatedAt
          FROM [dbo].[usuarios]
          ORDER BY id ASC
        `);
        if (result.recordset && result.recordset.length > 0) {
          users = result.recordset.map(u => ({
            id: u.id,
            username: u.usuario,
            name: u.nombre,
            role: u.rol || 'admin',
            isActive: u.activo !== false && u.activo !== 0,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt
          }));
        }
      } catch (tblErr) {
        // 2. Probar tabla alternativa usuario si existía previamente
        try {
          const uResult = await pool.request().query(`
            SELECT usuario, nombre, rol, activo FROM [dbo].[usuario]
          `);
          if (uResult.recordset && uResult.recordset.length > 0) {
            users = uResult.recordset.map((u, idx) => ({
              id: idx + 1,
              username: u.usuario,
              name: u.nombre || u.usuario,
              role: u.rol || 'admin',
              isActive: u.activo !== false && u.activo !== 0,
              createdAt: new Date()
            }));
          }
        } catch (altErr) {}
      }

      // Si la base de datos no tiene usuarios registrados aún, devolver al menos el usuario actual o admin
      if (users.length === 0) {
        users = [
          {
            id: 1,
            username: req.user?.username || 'admin',
            name: req.user?.name || 'Administrador LuxSur',
            role: req.user?.role || 'admin',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ];
      }

      return res.json({ success: true, users });
    } catch (dbErr) {
      console.warn('⚠️ Almacenamiento primario no disponible. Usando respaldo local:', dbErr.message);
      const data = getLocalData();
      let users = (data.users || []).map(u => ({
        id: u.id,
        username: u.usuario || u.username,
        name: u.nombre || u.name,
        role: u.rol || u.role || 'admin',
        isActive: u.activo !== false && u.isActive !== false,
        createdAt: u.createdAt || new Date()
      }));

      if (users.length === 0) {
        users = [DEFAULT_ADMIN];
      }

      return res.json({ success: true, users });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Crear un nuevo usuario encriptando la contraseña con bcrypt
 */
export async function createUser(req, res) {
  const { username, password, name, role, isActive } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Nombre de usuario, contraseña y nombre completo son obligatorios.'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres.'
    });
  }

  const cleanUsername = username.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanRole = role || 'admin';
  const activeStatus = isActive !== false ? 1 : 0;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let createdUser = null;

    try {
      const pool = await getConnection();

      // Asegurar que la tabla usuarios exista
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[usuarios]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
        BEGIN
            CREATE TABLE [dbo].[usuarios] (
                [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                [usuario] NVARCHAR(50) NOT NULL UNIQUE,
                [password] NVARCHAR(255) NOT NULL,
                [nombre] NVARCHAR(150) NOT NULL,
                [rol] NVARCHAR(50) NOT NULL DEFAULT 'admin',
                [activo] BIT NOT NULL DEFAULT 1,
                [createdAt] DATETIME DEFAULT GETDATE(),
                [updatedAt] DATETIME DEFAULT GETDATE()
            );
        END
      `);

      // Verificar si ya existe el nombre de usuario
      const checkResult = await pool.request()
        .input('usuario', sql.NVarChar(50), cleanUsername)
        .query(`SELECT 1 FROM [dbo].[usuarios] WHERE usuario = @usuario`);

      if (checkResult.recordset.length > 0) {
        return res.status(409).json({
          success: false,
          message: `El usuario "${cleanUsername}" ya existe en el sistema.`
        });
      }

      // Insertar nuevo usuario en SQL Server
      const insertResult = await pool.request()
        .input('usuario', sql.NVarChar(50), cleanUsername)
        .input('password', sql.NVarChar(255), hashedPassword)
        .input('nombre', sql.NVarChar(150), cleanName)
        .input('rol', sql.NVarChar(50), cleanRole)
        .input('activo', sql.Bit, activeStatus)
        .query(`
          INSERT INTO [dbo].[usuarios] (usuario, password, nombre, rol, activo)
          OUTPUT INSERTED.id, INSERTED.usuario, INSERTED.nombre, INSERTED.rol, INSERTED.activo, INSERTED.createdAt
          VALUES (@usuario, @password, @nombre, @rol, @activo)
        `);

      const row = insertResult.recordset[0];
      createdUser = {
        id: row.id,
        username: row.usuario,
        name: row.nombre,
        role: row.rol,
        isActive: Boolean(row.activo),
        createdAt: row.createdAt
      };
    } catch (dbErr) {
      console.warn('⚠️ Base de datos no disponible. Guardando en almacenamiento local:', dbErr.message);
      const data = getLocalData();
      if (!data.users) data.users = [DEFAULT_ADMIN];

      const exists = data.users.some(u => (u.usuario || u.username).toLowerCase() === cleanUsername);
      if (exists) {
        return res.status(409).json({ success: false, message: `El usuario "${cleanUsername}" ya existe.` });
      }

      const newId = Date.now();
      createdUser = {
        id: newId,
        username: cleanUsername,
        password: hashedPassword,
        name: cleanName,
        role: cleanRole,
        isActive: Boolean(activeStatus),
        createdAt: new Date().toISOString()
      };
      data.users.push(createdUser);
      saveLocalData(data);
    }

    return res.status(201).json({
      success: true,
      message: `Usuario "${cleanUsername}" creado exitosamente.`,
      user: createdUser
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Actualizar información de un usuario (y opcionalmente su contraseña encriptada)
 */
export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, role, isActive, newPassword } = req.body;

  try {
    let hashedPassword = null;
    if (newPassword && newPassword.trim().length > 0) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      }
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    try {
      const pool = await getConnection();
      const reqQuery = pool.request()
        .input('id', sql.Int, Number(id))
        .input('nombre', sql.NVarChar(150), name)
        .input('rol', sql.NVarChar(50), role || 'admin')
        .input('activo', sql.Bit, isActive !== false ? 1 : 0);

      if (hashedPassword) {
        reqQuery.input('password', sql.NVarChar(255), hashedPassword);
        await reqQuery.query(`
          UPDATE [dbo].[usuarios] SET
            nombre = @nombre,
            rol = @rol,
            activo = @activo,
            password = @password,
            updatedAt = GETDATE()
          WHERE id = @id
        `);
      } else {
        await reqQuery.query(`
          UPDATE [dbo].[usuarios] SET
            nombre = @nombre,
            rol = @rol,
            activo = @activo,
            updatedAt = GETDATE()
          WHERE id = @id
        `);
      }
    } catch (dbErr) {
      const data = getLocalData();
      if (data.users) {
        const idx = data.users.findIndex(u => String(u.id) === String(id));
        if (idx !== -1) {
          data.users[idx] = {
            ...data.users[idx],
            name: name || data.users[idx].name,
            role: role || data.users[idx].role,
            isActive: isActive !== undefined ? Boolean(isActive) : data.users[idx].isActive
          };
          if (hashedPassword) data.users[idx].password = hashedPassword;
          saveLocalData(data);
        }
      }
    }

    return res.json({
      success: true,
      message: 'Usuario actualizado exitosamente.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Activar / Desactivar estado de un usuario
 */
export async function toggleUserStatus(req, res) {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, Number(id))
        .input('activo', sql.Bit, isActive ? 1 : 0)
        .query(`UPDATE [dbo].[usuarios] SET activo = @activo, updatedAt = GETDATE() WHERE id = @id`);
    } catch (dbErr) {
      const data = getLocalData();
      if (data.users) {
        const u = data.users.find(x => String(x.id) === String(id));
        if (u) {
          u.isActive = Boolean(isActive);
          saveLocalData(data);
        }
      }
    }

    return res.json({
      success: true,
      message: `Usuario ${isActive ? 'activado' : 'desactivado'} correctamente.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Eliminar un usuario
 */
export async function deleteUser(req, res) {
  const { id } = req.params;
  const currentUserId = req.user?.username;

  try {
    try {
      const pool = await getConnection();

      // Evitar que un admin se elimine a sí mismo
      const userCheck = await pool.request()
        .input('id', sql.Int, Number(id))
        .query(`SELECT usuario FROM [dbo].[usuarios] WHERE id = @id`);

      if (userCheck.recordset.length > 0) {
        const targetUsername = userCheck.recordset[0].usuario;
        if (targetUsername.toLowerCase() === (currentUserId || '').toLowerCase()) {
          return res.status(400).json({
            success: false,
            message: 'No puedes eliminar tu propia cuenta de usuario en sesión activa.'
          });
        }
      }

      await pool.request()
        .input('id', sql.Int, Number(id))
        .query(`DELETE FROM [dbo].[usuarios] WHERE id = @id`);
    } catch (dbErr) {
      const data = getLocalData();
      if (data.users) {
        data.users = data.users.filter(u => String(u.id) !== String(id));
        saveLocalData(data);
      }
    }

    return res.json({ success: true, message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Restablecer contraseña de cualquier usuario (exclusivo para Administradores)
 */
export async function resetUserPassword(req, res) {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La nueva contraseña debe tener al menos 6 caracteres.'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, Number(id))
        .input('password', sql.NVarChar(255), hashedPassword)
        .query(`UPDATE [dbo].[usuarios] SET password = @password, updatedAt = GETDATE() WHERE id = @id`);
    } catch (dbErr) {
      const data = getLocalData();
      if (data.users) {
        const u = data.users.find(x => String(x.id) === String(id));
        if (u) {
          u.password = hashedPassword;
          saveLocalData(data);
        }
      }
    }

    return res.json({
      success: true,
      message: 'Contraseña del usuario actualizada exitosamente.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

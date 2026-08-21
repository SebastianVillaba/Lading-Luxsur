import { getConnection, sql } from '../config/db.js';
import { getLocalData, saveLocalData } from '../config/localStore.js';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function getAllCategories(req, res) {
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT 
          c.id, 
          c.name, 
          c.description, 
          c.orderIndex, 
          c.isActive,
          c.createdAt,
          (SELECT COUNT(1) FROM [dbo].[habitaciones] h WHERE h.category = c.name) AS roomsCount
        FROM [dbo].[categorias_habitaciones] c
        ORDER BY c.orderIndex ASC, c.name ASC
      `);

      const categories = result.recordset.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        orderIndex: Number(row.orderIndex) || 0,
        isActive: Boolean(row.isActive),
        roomsCount: Number(row.roomsCount) || 0
      }));

      return res.json({ success: true, categories });
    } catch (dbErr) {
      console.warn('⚠️ Base de datos no disponible para categorías. Usando respaldo local.');
      const data = getLocalData();
      const rooms = data.rooms || [];
      const categories = (data.categories || []).map(cat => ({
        ...cat,
        roomsCount: rooms.filter(r => r.category === cat.name || r.category === cat.id).length
      }));
      return res.json({ success: true, categories });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getCategoryById(req, res) {
  const { id } = req.params;
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.VarChar(100), id)
        .query(`
          SELECT 
            c.*,
            (SELECT COUNT(1) FROM [dbo].[habitaciones] h WHERE h.category = c.name) AS roomsCount
          FROM [dbo].[categorias_habitaciones] c
          WHERE c.id = @id
        `);

      if (result.recordset.length === 0) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }

      const row = result.recordset[0];
      return res.json({
        success: true,
        category: {
          id: row.id,
          name: row.name,
          description: row.description || '',
          orderIndex: Number(row.orderIndex) || 0,
          isActive: Boolean(row.isActive),
          roomsCount: Number(row.roomsCount) || 0
        }
      });
    } catch (dbErr) {
      const data = getLocalData();
      const cat = (data.categories || []).find(c => c.id === id);
      if (!cat) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }
      const rooms = data.rooms || [];
      const roomsCount = rooms.filter(r => r.category === cat.name || r.category === cat.id).length;
      return res.json({ success: true, category: { ...cat, roomsCount } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createCategory(req, res) {
  const { name, description, isActive = true } = req.body;
  let { id } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'El nombre de la categoría es obligatorio' });
  }

  if (!id || !id.trim()) {
    id = slugify(name);
  } else {
    id = slugify(id);
  }

  const categoryName = name.trim();
  const categoryDesc = description ? description.trim() : '';

  try {
    try {
      const pool = await getConnection();

      // Verificar existencia de ID o Nombre
      const checkResult = await pool.request()
        .input('id', sql.VarChar(100), id)
        .input('name', sql.NVarChar(100), categoryName)
        .query(`SELECT 1 FROM [dbo].[categorias_habitaciones] WHERE id = @id OR name = @name`);

      if (checkResult.recordset.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Ya existe una categoría con el identificador '${id}' o el nombre '${categoryName}'.`
        });
      }

      // Obtener el mayor orderIndex
      const maxOrderRes = await pool.request().query(`SELECT ISNULL(MAX(orderIndex), -1) + 1 AS nextOrder FROM [dbo].[categorias_habitaciones]`);
      const nextOrder = maxOrderRes.recordset[0].nextOrder || 0;

      await pool.request()
        .input('id', sql.VarChar(100), id)
        .input('name', sql.NVarChar(100), categoryName)
        .input('description', sql.NVarChar(500), categoryDesc)
        .input('orderIndex', sql.Int, nextOrder)
        .input('isActive', sql.Bit, isActive ? 1 : 0)
        .query(`
          INSERT INTO [dbo].[categorias_habitaciones] (id, name, description, orderIndex, isActive)
          VALUES (@id, @name, @description, @orderIndex, @isActive)
        `);
    } catch (dbErr) {
      console.warn('⚠️ SQL Server no disponible. Guardando categoría en respaldo local:', dbErr.message);
      const data = getLocalData();
      if (!data.categories) data.categories = [];

      const exists = data.categories.some(c => c.id === id || c.name.toLowerCase() === categoryName.toLowerCase());
      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Ya existe una categoría con el identificador '${id}' o el nombre '${categoryName}'.`
        });
      }

      const nextOrder = data.categories.length;
      data.categories.push({
        id,
        name: categoryName,
        description: categoryDesc,
        orderIndex: nextOrder,
        isActive: Boolean(isActive)
      });
      saveLocalData(data);
    }

    return res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      category: { id, name: categoryName, description: categoryDesc, isActive, roomsCount: 0 }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, description, isActive } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'El nombre de la categoría es obligatorio' });
  }

  const categoryName = name.trim();
  const categoryDesc = description !== undefined ? description.trim() : '';

  try {
    try {
      const pool = await getConnection();

      // Obtener categoría actual
      const currentCatRes = await pool.request()
        .input('id', sql.VarChar(100), id)
        .query(`SELECT * FROM [dbo].[categorias_habitaciones] WHERE id = @id`);

      if (currentCatRes.recordset.length === 0) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }

      const oldName = currentCatRes.recordset[0].name;

      // Verificar que el nuevo nombre no choque con otra categoría distinta
      const nameCheck = await pool.request()
        .input('id', sql.VarChar(100), id)
        .input('name', sql.NVarChar(100), categoryName)
        .query(`SELECT 1 FROM [dbo].[categorias_habitaciones] WHERE name = @name AND id != @id`);

      if (nameCheck.recordset.length > 0) {
        return res.status(400).json({ success: false, message: `Ya existe otra categoría con el nombre '${categoryName}'.` });
      }

      // Actualizar categoría
      await pool.request()
        .input('id', sql.VarChar(100), id)
        .input('name', sql.NVarChar(100), categoryName)
        .input('description', sql.NVarChar(500), categoryDesc)
        .input('isActive', sql.Bit, isActive !== undefined ? (isActive ? 1 : 0) : 1)
        .query(`
          UPDATE [dbo].[categorias_habitaciones] SET
            name = @name,
            description = @description,
            isActive = @isActive,
            updatedAt = GETDATE()
          WHERE id = @id
        `);

      // Si el nombre cambió, actualizar en cascada las habitaciones vinculadas
      if (oldName !== categoryName) {
        await pool.request()
          .input('oldName', sql.NVarChar(100), oldName)
          .input('newName', sql.NVarChar(100), categoryName)
          .query(`UPDATE [dbo].[habitaciones] SET category = @newName WHERE category = @oldName`);
      }
    } catch (dbErr) {
      console.warn('⚠️ SQL Server no disponible. Actualizando categoría en respaldo local:', dbErr.message);
      const data = getLocalData();
      if (!data.categories) data.categories = [];

      const idx = data.categories.findIndex(c => c.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }

      const oldName = data.categories[idx].name;
      const nameConflict = data.categories.some(c => c.id !== id && c.name.toLowerCase() === categoryName.toLowerCase());
      if (nameConflict) {
        return res.status(400).json({ success: false, message: `Ya existe otra categoría con el nombre '${categoryName}'.` });
      }

      data.categories[idx] = {
        ...data.categories[idx],
        name: categoryName,
        description: categoryDesc,
        isActive: isActive !== undefined ? Boolean(isActive) : data.categories[idx].isActive
      };

      // Cascada en localStore
      if (oldName !== categoryName && data.rooms) {
        data.rooms.forEach(r => {
          if (r.category === oldName) {
            r.category = categoryName;
          }
        });
      }

      saveLocalData(data);
    }

    return res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      category: { id, name: categoryName, description: categoryDesc, isActive }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    try {
      const pool = await getConnection();

      // 1. Obtener la categoría
      const catRes = await pool.request()
        .input('id', sql.VarChar(100), id)
        .query(`SELECT * FROM [dbo].[categorias_habitaciones] WHERE id = @id`);

      if (catRes.recordset.length === 0) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }

      const category = catRes.recordset[0];

      // 2. Comprobar si hay habitaciones asignadas a esta categoría
      const roomsCheck = await pool.request()
        .input('categoryName', sql.NVarChar(100), category.name)
        .query(`
          SELECT id, name FROM [dbo].[habitaciones] 
          WHERE category = @categoryName
        `);

      const associatedRoomsCount = roomsCheck.recordset.length;

      if (associatedRoomsCount > 0) {
        const roomNames = roomsCheck.recordset.map(r => `"${r.name}"`).slice(0, 3).join(', ');
        const extraText = associatedRoomsCount > 3 ? ` y ${associatedRoomsCount - 3} más` : '';
        return res.status(400).json({
          success: false,
          message: `No se puede eliminar la categoría "${category.name}" porque tiene ${associatedRoomsCount} habitación(es) asociada(s) (${roomNames}${extraText}). Por favor, reasigna o elimina las habitaciones primero.`
        });
      }

      // 3. Eliminar la categoría
      await pool.request()
        .input('id', sql.VarChar(100), id)
        .query(`DELETE FROM [dbo].[categorias_habitaciones] WHERE id = @id`);
    } catch (dbErr) {
      console.warn('⚠️ SQL Server no disponible. Eliminando categoría en respaldo local:', dbErr.message);
      const data = getLocalData();
      if (!data.categories) data.categories = [];

      const cat = data.categories.find(c => c.id === id);
      if (!cat) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }

      const rooms = data.rooms || [];
      const associatedRooms = rooms.filter(r => r.category === cat.name || r.category === cat.id);

      if (associatedRooms.length > 0) {
        const roomNames = associatedRooms.map(r => `"${r.name}"`).slice(0, 3).join(', ');
        const extraText = associatedRooms.length > 3 ? ` y ${associatedRooms.length - 3} más` : '';
        return res.status(400).json({
          success: false,
          message: `No se puede eliminar la categoría "${cat.name}" porque tiene ${associatedRooms.length} habitación(es) asociada(s) (${roomNames}${extraText}). Por favor, reasigna o elimina las habitaciones primero.`
        });
      }

      data.categories = data.categories.filter(c => c.id !== id);
      saveLocalData(data);
    }

    return res.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateCategoriesOrder(req, res) {
  const { orders } = req.body;
  if (!Array.isArray(orders)) {
    return res.status(400).json({ success: false, message: 'Formato de órdenes inválido' });
  }

  try {
    try {
      const pool = await getConnection();
      for (const item of orders) {
        await pool.request()
          .input('id', sql.VarChar(100), item.id)
          .input('orderIndex', sql.Int, Number(item.orderIndex) || 0)
          .query(`UPDATE [dbo].[categorias_habitaciones] SET orderIndex = @orderIndex WHERE id = @id`);
      }
    } catch (dbErr) {
      const data = getLocalData();
      if (data.categories) {
        orders.forEach(item => {
          const cat = data.categories.find(c => c.id === item.id);
          if (cat) cat.orderIndex = Number(item.orderIndex) || 0;
        });
        data.categories.sort((a, b) => a.orderIndex - b.orderIndex);
        saveLocalData(data);
      }
    }

    return res.json({ success: true, message: 'Orden de categorías actualizado exitosamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

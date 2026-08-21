import { getConnection, sql } from '../config/db.js';
import { getLocalData, saveLocalData } from '../config/localStore.js';

// EXPERIENCIAS
export async function getExperiences(req, res) {
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT * FROM [dbo].[experiencias] ORDER BY orderIndex ASC
      `);
      const experiences = result.recordset.map(row => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        image: row.image,
        tag: row.tag,
        orderIndex: Number(row.orderIndex) || 0,
        isActive: Boolean(row.isActive)
      }));
      return res.json({ success: true, experiences });
    } catch (dbErr) {
      const data = getLocalData();
      return res.json({ success: true, experiences: data.experiences || [] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function saveExperience(req, res) {
  const exp = req.body;
  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.VarChar(100), exp.id)
        .input('title', sql.NVarChar(150), exp.title)
        .input('subtitle', sql.NVarChar(100), exp.subtitle || '')
        .input('description', sql.NVarChar(sql.MAX), exp.description || '')
        .input('image', sql.NVarChar(500), exp.image || '')
        .input('tag', sql.NVarChar(100), exp.tag || '')
        .input('orderIndex', sql.Int, Number(exp.orderIndex) || 0)
        .input('isActive', sql.Bit, exp.isActive !== false ? 1 : 0)
        .query(`
          IF EXISTS (SELECT 1 FROM [dbo].[experiencias] WHERE id = @id)
          BEGIN
            UPDATE [dbo].[experiencias] SET
              title = @title, subtitle = @subtitle, description = @description,
              image = @image, tag = @tag, orderIndex = @orderIndex, isActive = @isActive
            WHERE id = @id
          END
          ELSE
          BEGIN
            INSERT INTO [dbo].[experiencias] (id, title, subtitle, description, image, tag, orderIndex, isActive)
            VALUES (@id, @title, @subtitle, @description, @image, @tag, @orderIndex, @isActive)
          END
        `);
    } catch (dbErr) {
      const data = getLocalData();
      const idx = data.experiences.findIndex(e => e.id === exp.id);
      if (idx !== -1) data.experiences[idx] = exp;
      else data.experiences.push(exp);
      saveLocalData(data);
    }
    return res.json({ success: true, message: 'Experiencia guardada exitosamente', experience: exp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteExperience(req, res) {
  const { id } = req.params;
  try {
    try {
      const pool = await getConnection();
      await pool.request().input('id', sql.VarChar(100), id).query(`DELETE FROM [dbo].[experiencias] WHERE id = @id`);
    } catch (dbErr) {
      const data = getLocalData();
      data.experiences = data.experiences.filter(e => e.id !== id);
      saveLocalData(data);
    }
    return res.json({ success: true, message: 'Experiencia eliminada' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// SERVICIOS
export async function getServices(req, res) {
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`SELECT * FROM [dbo].[servicios] ORDER BY orderIndex ASC`);
      const services = result.recordset.map(row => ({
        id: row.id,
        icon: row.icon,
        title: row.title,
        description: row.description,
        orderIndex: Number(row.orderIndex) || 0,
        isActive: Boolean(row.isActive)
      }));
      return res.json({ success: true, services });
    } catch (dbErr) {
      const data = getLocalData();
      return res.json({ success: true, services: data.services || [] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function saveService(req, res) {
  const serv = req.body;
  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.VarChar(100), serv.id)
        .input('icon', sql.VarChar(50), serv.icon || 'Wifi')
        .input('title', sql.NVarChar(150), serv.title)
        .input('description', sql.NVarChar(sql.MAX), serv.description || '')
        .input('orderIndex', sql.Int, Number(serv.orderIndex) || 0)
        .input('isActive', sql.Bit, serv.isActive !== false ? 1 : 0)
        .query(`
          IF EXISTS (SELECT 1 FROM [dbo].[servicios] WHERE id = @id)
          BEGIN
            UPDATE [dbo].[servicios] SET
              icon = @icon, title = @title, description = @description,
              orderIndex = @orderIndex, isActive = @isActive
            WHERE id = @id
          END
          ELSE
          BEGIN
            INSERT INTO [dbo].[servicios] (id, icon, title, description, orderIndex, isActive)
            VALUES (@id, @icon, @title, @description, @orderIndex, @isActive)
          END
        `);
    } catch (dbErr) {
      const data = getLocalData();
      const idx = data.services.findIndex(s => s.id === serv.id);
      if (idx !== -1) data.services[idx] = serv;
      else data.services.push(serv);
      saveLocalData(data);
    }
    return res.json({ success: true, message: 'Servicio guardado exitosamente', service: serv });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteService(req, res) {
  const { id } = req.params;
  try {
    try {
      const pool = await getConnection();
      await pool.request().input('id', sql.VarChar(100), id).query(`DELETE FROM [dbo].[servicios] WHERE id = @id`);
    } catch (dbErr) {
      const data = getLocalData();
      data.services = data.services.filter(s => s.id !== id);
      saveLocalData(data);
    }
    return res.json({ success: true, message: 'Servicio eliminado' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// RESTAURANT ROOFTOP
export async function getRooftopInfo(req, res) {
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`SELECT * FROM [dbo].[restaurante] WHERE id = 'rooftop'`);
      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        let highlights = [];
        try {
          highlights = typeof row.highlights === 'string' ? JSON.parse(row.highlights) : row.highlights;
        } catch (e) { highlights = []; }
        return res.json({
          success: true,
          rooftop: {
            id: row.id,
            title: row.title,
            subtitle: row.subtitle,
            description: row.description,
            hours: row.hours,
            image: row.image,
            highlights
          }
        });
      }
    } catch (dbErr) {}
    const data = getLocalData();
    return res.json({ success: true, rooftop: data.rooftop });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateRooftopInfo(req, res) {
  const r = req.body;
  const highlightsJson = JSON.stringify(r.highlights || []);
  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('title', sql.NVarChar(150), r.title)
        .input('subtitle', sql.NVarChar(150), r.subtitle || '')
        .input('description', sql.NVarChar(sql.MAX), r.description || '')
        .input('hours', sql.NVarChar(150), r.hours || '')
        .input('image', sql.NVarChar(500), r.image || '')
        .input('highlights', sql.NVarChar(sql.MAX), highlightsJson)
        .query(`
          UPDATE [dbo].[restaurante] SET
            title = @title, subtitle = @subtitle, description = @description,
            hours = @hours, image = @image, highlights = @highlights, updatedAt = GETDATE()
          WHERE id = 'rooftop'
        `);
    } catch (dbErr) {
      const data = getLocalData();
      data.rooftop = { ...data.rooftop, ...r };
      saveLocalData(data);
    }
    return res.json({ success: true, message: 'Información del Restaurant actualizada', rooftop: r });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

import { getConnection, sql } from '../config/db.js';
import { getLocalData, saveLocalData } from '../config/localStore.js';

function formatRoomRow(row) {
  let gallery = [];
  let features = [];
  try {
    gallery = typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : (row.gallery || []);
  } catch (e) {
    gallery = [row.image];
  }
  try {
    features = typeof row.features === 'string' ? JSON.parse(row.features || '[]') : (row.features || []);
  } catch (e) {
    features = [];
  }

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    guests: Number(row.guests) || 1,
    guestsLabel: row.guestsLabel || `${row.guests} Personas`,
    size: row.size || '',
    bed: row.bed || '',
    pricePYG: row.pricePYG || '',
    priceNumeric: Number(row.priceNumeric) || 0,
    showPrice: Boolean(row.showPrice),
    badge: row.badge || '',
    badgeType: row.badgeType || 'popular',
    description: row.description || '',
    image: row.image,
    gallery,
    features,
    customBookingUrl: row.customBookingUrl || '',
    orderIndex: Number(row.orderIndex) || 0,
    isActive: Boolean(row.isActive)
  };
}

export async function getAllRooms(req, res) {
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT * FROM [dbo].[habitaciones] ORDER BY orderIndex ASC, name ASC
      `);
      const rooms = result.recordset.map(formatRoomRow);
      return res.json({ success: true, rooms });
    } catch (dbErr) {
      console.warn('⚠️ Almacenamiento primario no disponible. Usando respaldo local:', dbErr.message);
      const data = getLocalData();
      return res.json({ success: true, rooms: data.rooms || [] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getRoomById(req, res) {
  const { id } = req.params;
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.VarChar(100), id)
        .query(`SELECT * FROM [dbo].[habitaciones] WHERE id = @id`);
      
      if (result.recordset.length === 0) {
        return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
      }
      return res.json({ success: true, room: formatRoomRow(result.recordset[0]) });
    } catch (dbErr) {
      const data = getLocalData();
      const room = data.rooms.find(r => r.id === id);
      if (!room) return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
      return res.json({ success: true, room });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createRoom(req, res) {
  const roomData = req.body;
  if (!roomData.name || !roomData.id) {
    return res.status(400).json({ success: false, message: 'ID y Nombre de habitación son obligatorios' });
  }

  const galleryJson = JSON.stringify(roomData.gallery || [roomData.image || '']);
  const featuresJson = JSON.stringify(roomData.features || []);

  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.VarChar(100), roomData.id)
        .input('name', sql.NVarChar(150), roomData.name)
        .input('category', sql.NVarChar(100), roomData.category || 'Estándar')
        .input('guests', sql.Int, Number(roomData.guests) || 1)
        .input('guestsLabel', sql.NVarChar(100), roomData.guestsLabel || `${roomData.guests || 1} Persona`)
        .input('size', sql.NVarChar(50), roomData.size || '30 m²')
        .input('bed', sql.NVarChar(150), roomData.bed || 'Cama Doble')
        .input('pricePYG', sql.NVarChar(50), roomData.pricePYG || '')
        .input('priceNumeric', sql.Decimal(18, 2), Number(roomData.priceNumeric) || 0)
        .input('showPrice', sql.Bit, roomData.showPrice !== false ? 1 : 0)
        .input('badge', sql.NVarChar(100), roomData.badge || '')
        .input('badgeType', sql.VarChar(50), roomData.badgeType || 'popular')
        .input('description', sql.NVarChar(sql.MAX), roomData.description || '')
        .input('image', sql.NVarChar(500), roomData.image || '')
        .input('gallery', sql.NVarChar(sql.MAX), galleryJson)
        .input('features', sql.NVarChar(sql.MAX), featuresJson)
        .input('customBookingUrl', sql.NVarChar(500), roomData.customBookingUrl || '')
        .input('orderIndex', sql.Int, Number(roomData.orderIndex) || 0)
        .input('isActive', sql.Bit, roomData.isActive !== false ? 1 : 0)
        .query(`
          INSERT INTO [dbo].[habitaciones] (
            id, name, category, guests, guestsLabel, size, bed, pricePYG, priceNumeric,
            showPrice, badge, badgeType, description, image, gallery, features,
            customBookingUrl, orderIndex, isActive
          ) VALUES (
            @id, @name, @category, @guests, @guestsLabel, @size, @bed, @pricePYG, @priceNumeric,
            @showPrice, @badge, @badgeType, @description, @image, @gallery, @features,
            @customBookingUrl, @orderIndex, @isActive
          )
        `);
    } catch (dbErr) {
      console.warn('⚠️ SQL Server no disponible. Guardando en local_cache.json');
      const data = getLocalData();
      data.rooms.push({
        ...roomData,
        gallery: roomData.gallery || [roomData.image],
        features: roomData.features || []
      });
      saveLocalData(data);
    }

    return res.status(201).json({ success: true, message: 'Habitación creada exitosamente', room: roomData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateRoom(req, res) {
  const { id } = req.params;
  const roomData = req.body;
  const galleryJson = JSON.stringify(roomData.gallery || [roomData.image || '']);
  const featuresJson = JSON.stringify(roomData.features || []);

  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.VarChar(100), id)
        .input('name', sql.NVarChar(150), roomData.name)
        .input('category', sql.NVarChar(100), roomData.category)
        .input('guests', sql.Int, Number(roomData.guests) || 1)
        .input('guestsLabel', sql.NVarChar(100), roomData.guestsLabel)
        .input('size', sql.NVarChar(50), roomData.size)
        .input('bed', sql.NVarChar(150), roomData.bed)
        .input('pricePYG', sql.NVarChar(50), roomData.pricePYG)
        .input('priceNumeric', sql.Decimal(18, 2), Number(roomData.priceNumeric) || 0)
        .input('showPrice', sql.Bit, roomData.showPrice !== false ? 1 : 0)
        .input('badge', sql.NVarChar(100), roomData.badge)
        .input('badgeType', sql.VarChar(50), roomData.badgeType)
        .input('description', sql.NVarChar(sql.MAX), roomData.description)
        .input('image', sql.NVarChar(500), roomData.image)
        .input('gallery', sql.NVarChar(sql.MAX), galleryJson)
        .input('features', sql.NVarChar(sql.MAX), featuresJson)
        .input('customBookingUrl', sql.NVarChar(500), roomData.customBookingUrl)
        .input('orderIndex', sql.Int, Number(roomData.orderIndex) || 0)
        .input('isActive', sql.Bit, roomData.isActive !== false ? 1 : 0)
        .query(`
          UPDATE [dbo].[habitaciones] SET
            name = @name,
            category = @category,
            guests = @guests,
            guestsLabel = @guestsLabel,
            size = @size,
            bed = @bed,
            pricePYG = @pricePYG,
            priceNumeric = @priceNumeric,
            showPrice = @showPrice,
            badge = @badge,
            badgeType = @badgeType,
            description = @description,
            image = @image,
            gallery = @gallery,
            features = @features,
            customBookingUrl = @customBookingUrl,
            orderIndex = @orderIndex,
            isActive = @isActive,
            updatedAt = GETDATE()
          WHERE id = @id
        `);
    } catch (dbErr) {
      console.warn('⚠️ SQL Server no disponible. Actualizando local_cache.json');
      const data = getLocalData();
      const idx = data.rooms.findIndex(r => r.id === id);
      if (idx !== -1) {
        data.rooms[idx] = { ...data.rooms[idx], ...roomData };
        saveLocalData(data);
      }
    }

    return res.json({ success: true, message: 'Habitación actualizada exitosamente', room: { ...roomData, id } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteRoom(req, res) {
  const { id } = req.params;
  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.VarChar(100), id)
        .query(`DELETE FROM [dbo].[habitaciones] WHERE id = @id`);
    } catch (dbErr) {
      const data = getLocalData();
      data.rooms = data.rooms.filter(r => r.id !== id);
      saveLocalData(data);
    }

    return res.json({ success: true, message: 'Habitación eliminada exitosamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateRoomsOrder(req, res) {
  const { orders } = req.body;
  if (!Array.isArray(orders)) {
    return res.status(400).json({ success: false, message: 'Formato de orden inválido' });
  }

  try {
    try {
      const pool = await getConnection();
      for (const item of orders) {
        await pool.request()
          .input('id', sql.VarChar(100), item.id)
          .input('orderIndex', sql.Int, item.orderIndex)
          .query(`UPDATE [dbo].[habitaciones] SET orderIndex = @orderIndex WHERE id = @id`);
      }
    } catch (dbErr) {
      const data = getLocalData();
      orders.forEach(item => {
        const room = data.rooms.find(r => r.id === item.id);
        if (room) room.orderIndex = item.orderIndex;
      });
      data.rooms.sort((a, b) => a.orderIndex - b.orderIndex);
      saveLocalData(data);
    }

    return res.json({ success: true, message: 'Orden de habitaciones actualizado exitosamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

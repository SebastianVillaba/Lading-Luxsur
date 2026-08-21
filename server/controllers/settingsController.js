import { getConnection, sql } from '../config/db.js';
import { getLocalData, saveLocalData } from '../config/localStore.js';

export async function getSettings(req, res) {
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`SELECT * FROM [dbo].[configuraciones] WHERE id = 'main'`);
      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        return res.json({
          success: true,
          settings: {
            id: row.id,
            hotelName: row.hotelName,
            stars: row.stars,
            tagline: row.tagline,
            address: row.address,
            phone: row.phone,
            whatsappRaw: row.whatsappRaw,
            whatsappMessage: row.whatsappMessage,
            email: row.email,
            cloudbedsUrl: row.cloudbedsUrl,
            mapsUrl: row.mapsUrl,
            googleMapsEmbed: row.googleMapsEmbed,
            announcementBanner: row.announcementBanner,
            isBannerActive: Boolean(row.isBannerActive)
          }
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ SQL Server no conectado. Usando local_cache.json para configuraciones');
    }
    const data = getLocalData();
    return res.json({ success: true, settings: data.settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateSettings(req, res) {
  const s = req.body;
  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('hotelName', sql.NVarChar(150), s.hotelName)
        .input('stars', sql.Int, Number(s.stars) || 4)
        .input('tagline', sql.NVarChar(300), s.tagline || '')
        .input('address', sql.NVarChar(300), s.address || '')
        .input('phone', sql.NVarChar(100), s.phone || '')
        .input('whatsappRaw', sql.NVarChar(50), s.whatsappRaw || '')
        .input('whatsappMessage', sql.NVarChar(300), s.whatsappMessage || '')
        .input('email', sql.NVarChar(150), s.email || '')
        .input('cloudbedsUrl', sql.NVarChar(500), s.cloudbedsUrl || '')
        .input('mapsUrl', sql.NVarChar(500), s.mapsUrl || '')
        .input('googleMapsEmbed', sql.NVarChar(sql.MAX), s.googleMapsEmbed || '')
        .input('announcementBanner', sql.NVarChar(500), s.announcementBanner || '')
        .input('isBannerActive', sql.Bit, s.isBannerActive ? 1 : 0)
        .query(`
          UPDATE [dbo].[configuraciones] SET
            hotelName = @hotelName,
            stars = @stars,
            tagline = @tagline,
            address = @address,
            phone = @phone,
            whatsappRaw = @whatsappRaw,
            whatsappMessage = @whatsappMessage,
            email = @email,
            cloudbedsUrl = @cloudbedsUrl,
            mapsUrl = @mapsUrl,
            googleMapsEmbed = @googleMapsEmbed,
            announcementBanner = @announcementBanner,
            isBannerActive = @isBannerActive,
            updatedAt = GETDATE()
          WHERE id = 'main'
        `);
    } catch (dbErr) {
      console.warn('⚠️ Guardando configuraciones en local_cache.json');
      const data = getLocalData();
      data.settings = { ...data.settings, ...s };
      saveLocalData(data);
    }
    return res.json({ success: true, message: 'Configuraciones actualizadas exitosamente', settings: s });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

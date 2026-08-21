import { getConnection, sql } from '../config/db.js';
import { getLocalData, saveLocalData } from '../config/localStore.js';

export async function getReviews(req, res) {
  try {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT * FROM [dbo].[resenas] ORDER BY orderIndex ASC, createdAt DESC
      `);
      const reviews = result.recordset.map(row => ({
        id: row.id,
        name: row.name,
        origin: row.origin,
        rating: Number(row.rating) || 5,
        stayDate: row.stayDate,
        comment: row.comment,
        isFeatured: Boolean(row.isFeatured),
        orderIndex: Number(row.orderIndex) || 0
      }));
      return res.json({ success: true, reviews });
    } catch (dbErr) {
      const data = getLocalData();
      return res.json({ success: true, reviews: data.reviews || [] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createReview(req, res) {
  const rev = req.body;
  try {
    let createdId = Date.now();
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('name', sql.NVarChar(150), rev.name)
        .input('origin', sql.NVarChar(150), rev.origin || '')
        .input('rating', sql.Int, Number(rev.rating) || 5)
        .input('stayDate', sql.NVarChar(50), rev.stayDate || '')
        .input('comment', sql.NVarChar(sql.MAX), rev.comment)
        .input('isFeatured', sql.Bit, rev.isFeatured !== false ? 1 : 0)
        .input('orderIndex', sql.Int, Number(rev.orderIndex) || 0)
        .query(`
          INSERT INTO [dbo].[resenas] (name, origin, rating, stayDate, comment, isFeatured, orderIndex)
          OUTPUT INSERTED.id
          VALUES (@name, @origin, @rating, @stayDate, @comment, @isFeatured, @orderIndex)
        `);
      createdId = result.recordset[0].id;
    } catch (dbErr) {
      const data = getLocalData();
      data.reviews.push({ ...rev, id: createdId });
      saveLocalData(data);
    }
    return res.status(201).json({ success: true, message: 'Reseña agregada', review: { ...rev, id: createdId } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateReview(req, res) {
  const { id } = req.params;
  const rev = req.body;
  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, Number(id))
        .input('name', sql.NVarChar(150), rev.name)
        .input('origin', sql.NVarChar(150), rev.origin)
        .input('rating', sql.Int, Number(rev.rating) || 5)
        .input('stayDate', sql.NVarChar(50), rev.stayDate)
        .input('comment', sql.NVarChar(sql.MAX), rev.comment)
        .input('isFeatured', sql.Bit, rev.isFeatured !== false ? 1 : 0)
        .input('orderIndex', sql.Int, Number(rev.orderIndex) || 0)
        .query(`
          UPDATE [dbo].[resenas] SET
            name = @name, origin = @origin, rating = @rating, stayDate = @stayDate,
            comment = @comment, isFeatured = @isFeatured, orderIndex = @orderIndex
          WHERE id = @id
        `);
    } catch (dbErr) {
      const data = getLocalData();
      const idx = data.reviews.findIndex(r => String(r.id) === String(id));
      if (idx !== -1) {
        data.reviews[idx] = { ...data.reviews[idx], ...rev, id: Number(id) };
        saveLocalData(data);
      }
    }
    return res.json({ success: true, message: 'Reseña actualizada', review: { ...rev, id } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteReview(req, res) {
  const { id } = req.params;
  try {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, Number(id))
        .query(`DELETE FROM [dbo].[resenas] WHERE id = @id`);
    } catch (dbErr) {
      const data = getLocalData();
      data.reviews = data.reviews.filter(r => String(r.id) !== String(id));
      saveLocalData(data);
    }
    return res.json({ success: true, message: 'Reseña eliminada' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se subió ningún archivo de imagen' });
    }

    // Ruta relativa para acceso web público
    const fileUrl = `/uploads/rooms/${req.file.filename}`;

    return res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export function uploadMultipleImages(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No se subieron archivos' });
    }

    const urls = req.files.map(f => `/uploads/rooms/${f.filename}`);

    return res.json({
      success: true,
      message: `${req.files.length} imágenes subidas exitosamente`,
      urls
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

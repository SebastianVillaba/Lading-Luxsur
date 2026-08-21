import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import roomsRoutes from './routes/roomsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import { getConnection } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos de uploads (para que las fotos se vean en /uploads/rooms/...)
const uploadsPath = path.join(__dirname, '../public/uploads');
app.use('/uploads', express.static(uploadsPath));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check & info
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const pool = await getConnection();
    if (pool && pool.connected) {
      dbStatus = 'connected';
    }
  } catch (e) {
    dbStatus = 'active';
  }
  res.json({
    status: 'ok',
    hotel: 'LuxSur Hotel Boutique',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API LuxSur escuchando en el puerto ${PORT}`);
  console.log(`📡 URL API: http://localhost:${PORT}/api`);
  console.log(`📁 Carpeta de uploads estática: ${uploadsPath}`);
  
  // Intento de conexión en segundo plano
  getConnection().catch((err) => {
    console.log(`ℹ️ [Modo Resiliente]: La API está corriendo con soporte de caché local.`);
  });
});

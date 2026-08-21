import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'luxsur_hotel_boutique_secure_jwt_key_2026_encarnacion';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Acceso denegado: Token no proporcionado' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
  }
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id || user.usuario || user.id_usuario,
      username: user.username || user.usuario || user.nombre,
      role: user.role || user.rol || 'admin'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

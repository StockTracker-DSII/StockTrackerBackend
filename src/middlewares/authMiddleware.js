const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1]; // formato: "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Token inválido' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // guarda datos del usuario en la petición
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

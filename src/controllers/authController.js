const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta'; // usa env var segura

exports.register = async (req, res) => {
  const { name, user_id, email, password, is_admin } = req.body;

  if (!email || !password || !name || !user_id) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    // Verificar si ya existe el correo
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'El correo ya está en uso' });
    }

    // Crear el usuario (el hash ocurre automáticamente en el modelo con el hook)
    const newUser = await User.create({
      name,
      user_id,
      email,
      password,
      is_admin: is_admin || false,
    });

    // Crear JWT (puedes omitir esto si prefieres que inicien sesión después)
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        is_admin: newUser.is_admin,
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Retornar usuario básico y token
    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        is_admin: newUser.is_admin,
      },
      token,
    });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const isValid = await user.checkPassword(password); // método definido en el modelo
    if (!isValid) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Crear token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // 👈 excluye contraseñas por seguridad
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};
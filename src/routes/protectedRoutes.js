const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

router.get('/profile', auth, (req, res) => {
  res.json({ message: 'Perfil accedido', user: req.user });
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // opcional si usas cookies
}));

app.use(express.json());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/sale',saleRoutes);
app.use('/api/auth', authRoutes);
app.use('/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('Servidor activo');
  });
  
module.exports = app;

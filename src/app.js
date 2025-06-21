require('dotenv').config();
const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');

app.use(express.json());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/purcahse',purchaseRoutes);
app.use('/sale',saleRoutes);

app.get('/', (req, res) => {
    res.send('Servidor activo');
  });
  
module.exports = app;

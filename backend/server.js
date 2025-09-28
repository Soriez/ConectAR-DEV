const express = require('express');
const mongoose = require('mongoose');

// Crear la aplicación de Express
const app = express();
const PORT = 5000;

// Middleware para manejar JSON
app.use(express.json());

// Ruta básica para probar
app.get('/', (req, res) => {
  res.json({ 
    message: '¡Hola! Tu servidor está funcionando 🎉',
    fecha: new Date()
  });
});

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mi-primera-app')
  .then(() => {
    console.log('✅ Conectado a MongoDB');
  })
  .catch((error) => {
    console.log('❌ Error conectando a MongoDB:', error.message);
  });

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
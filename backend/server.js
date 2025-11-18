import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes.js';
// Importación necesaria para poder traer variables del .env
import 'dotenv/config';


// Crear la aplicación de Express
const app = express();
const MONGODB_URI = process.env.VITE_MONGODB_URI
const PORT = 8080;


// Middleware para manejar JSON
app.use(express.json());


// Ruta básica para probar
app.get('/', (req, res) => {
  res.json({ 
    message: '¡Hola! Tu servidor está funcionando 🎉',
    fecha: new Date()
  });
});

// --- RUTAS ---
//Ruta de usuarios
app.use('/api/users/', userRoutes)

// Conectar a MongoDB
const startServer = async () => {
  try {
    // Conectar a MongoDB. Usamos await aquí para esperar la conexión
    await mongoose.connect(MONGODB_URI);

    console.log('✅ Conectado a MongoDB en:', MONGODB_URI.substring(0, 50) + '...'); // Mostrar solo el inicio para seguridad

    // Iniciar el servidor SOLO si la conexión fue exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });

  } catch (error) {
    // Manejo de errores: Si falla la conexión a la DB, registramos el error y salimos
    console.error('❌ Error conectando a MongoDB. Revisa tu MONGODB_URI y que el servicio de MongoDB esté activo.');
    console.error('Detalle del error:', error.message);
    // process.exit(1) fuerza la detención de la aplicación Node.js
    process.exit(1);
  }
};

startServer();
import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes.js';
import opinionRoutes from './routes/opinionRoutes.js';
import servicioRoutes from './routes/servicioRoutes.js';
import tipoServicioRoutes from './routes/tipoServicioRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import technologyRoutes  from './routes/technologyRoutes.js'; 
// Importación necesaria para poder traer variables del .env
import 'dotenv/config';
import cors from 'cors'


// Crear la aplicación de Express
const app = express();
const MONGODB_URI = process.env.VITE_MONGODB_URI
const PORT = 8080;


// Middleware para manejar JSON
app.use(express.json());

//Configuración para permitir solicitudes desde el frontend
app.use(cors({
  origin: process.env.VITE_FRONTEND_URI,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
}))


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


//Ruta de opiniones
app.use('/api/opinions/', opinionRoutes)

//Ruta de servicios
app.use('/api/services/', servicioRoutes)

//Ruta de tipos de servicios
app.use('/api/types/', tipoServicioRoutes)

//Ruta de dashboard 
app.use('/api/dashboard/', dashboardRoutes)

//Ruta de tecnologias
app.use('/api/technologies', technologyRoutes)

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
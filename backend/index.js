
// Este archivo se encarga de arrancar el servidor Express y conecta la base de datos

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('.config/db')

// Cargar las vairbales de entorno
dotenv.config()

// conectar la base de datos
connectDB()

const app = express()

// middlewares
app.use(cors()) /* Permite peticiones del frontend */
app.use(express.json()) /* Permite recibir JSON en el cuerpo de las peticiones */

// Rutas de la API
app.get('/', (req, res) => {
    res.send('API está corriendo...')
})
app.use('/api/usuarios', require('./routes/usuarios')) //Conecta las rutas de usuarios

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Servidor corriento en el uerto ${PORT}`))


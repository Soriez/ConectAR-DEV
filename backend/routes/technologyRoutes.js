import express from 'express';
const router = express.Router();
// 1. Importación del Modelo de Tecnología (con .js y default export)
import Tecnologias from '../models/Technology.model.js'; 
// 2. Importación del Middleware: Solo 'protect'
import { protect } from '../middleware/authMiddleware.js'; 

// --- RUTA 1: CREAR UNA NUEVA TECNOLOGÍA ---
// Ahora solo se requiere que el usuario esté autenticado.
// POST /api/technologies
router.post('/', protect, async (req, res) => { // 👈 Solo usamos 'protect'
    try {
        const { name } = req.body;
        
        // Creamos la nueva tecnología
        const newTecnologias = new Tecnologias({ name });
        await newTecnologias.save();

        res.status(201).json(newTecnologias);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Esa tecnología ya existe.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error al crear la tecnología.' });
    }
});

// --- RUTA 2: OBTENER TODAS LAS TECNOLOGÍAS (PARA EL FRONTEND) ---
// GET /api/technologies/available
router.get('/available', async (req, res) => {
    try {
        const technologies = await Tecnologias.find().select('name -_id').sort({ name: 1 });
        const techNames = technologies.map(tech => tech.name); 
        res.status(200).json(techNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la lista de tecnologías.' });
    }
});

export default router;
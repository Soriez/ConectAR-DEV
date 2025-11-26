import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    createTechnology, 
    getAvailableTechnologies 
} from '../controllers/technology.controller.js';

const router = express.Router();

// --- RUTAS ---

// Obtener todas las tecnologías disponibles (Público o Privado según tu lógica, aquí lo dejé abierto como en tu original)
router.get('/available', getAvailableTechnologies);

// Crear una nueva tecnología (Requiere autenticación)
router.post('/', protect, createTechnology);

export default router;
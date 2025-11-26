import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createService,
    getServicesByFreelancer,
    deleteService,
    getServiceTypes,
    updateService
} from '../controllers/servicio.controller.js';

const router = express.Router();

// --- RUTAS PÚBLICAS ---

// Obtener el catálogo de tipos (Para el dropdown del modal)
router.get('/types', getServiceTypes);

// Ver los servicios de un freelancer X
router.get('/freelancer/:id', getServicesByFreelancer);


// --- RUTAS PROTEGIDAS (Solo Freelancers logueados) ---

// Crear un nuevo servicio
router.post('/', protect, createService);

// Eliminar un servicio
router.delete('/:id', protect, deleteService);

// Actualizar un servicio (NUEVA RUTA)
router.put('/:id', protect, updateService);

export default router;
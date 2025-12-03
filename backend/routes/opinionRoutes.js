import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createOpinion,
    getReceivedOpinions,
    getGivenOpinions,
    deleteOpinion
} from '../controllers/opinion.controller.js';

const router = express.Router();

// (C) CREATE - Crear opinión
// POST a /api/opinions/
// Necesita 'protect' porque necesitamos saber QUIÉN escribe la opinión (req.user)
router.post('/', protect, createOpinion);

// (R) READ - Leer opiniones RECIBIDAS (Perfil Freelancer)
// GET a /api/opinions/recibidas/:usuarioId
router.get('/recibidas/:usuarioId', getReceivedOpinions);

// (R) READ - Leer opiniones REALIZADAS (Historial Cliente)
// GET a /api/opinions/realizadas/:usuarioId
router.get('/realizadas/:usuarioId', getGivenOpinions);

// (D) DELETE - Eliminar opinión
// DELETE a /api/opinions/:id
router.delete('/:id', protect, deleteOpinion);

export default router;
import express from 'express';
import { getServiceTypes } from '../controllers/servicio.controller.js';

const router = express.Router();

// ! RUTAS PÚBLICAS

// GET /api/tipos-servicios/
// ? Obtiene el catálogo completo de categorías (para llenar los <select> o filtros)
router.get('/', getServiceTypes);

export default router;
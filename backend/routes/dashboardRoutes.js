import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getDashboardData,
    incrementarVisitas,
    incrementarAccesosLinkedin,
    incrementarAccesosPortfolio,
    registrarVisitaSitio,
    obtenerEstadisticasSitio
} from '../controllers/dashboard.controller.js';

const router = express.Router();

// --- RUTAS PROTEGIDAS (Usuario logueado) ---

// GET /api/dashboard
// Obtener datos del dashboard según tipo de usuario
router.get('/', protect, getDashboardData);

// --- RUTAS PÚBLICAS (Para tracking de estadísticas) ---

// POST /api/dashboard/stats/visitas
// Incrementar visitas al perfil
router.post('/stats/visitas', incrementarVisitas);

// POST /api/dashboard/stats/linkedin
// Incrementar accesos a LinkedIn
router.post('/stats/linkedin', incrementarAccesosLinkedin);

// POST /api/dashboard/stats/portfolio
// Incrementar accesos a Portfolio
router.post('/stats/portfolio', incrementarAccesosPortfolio);

// --- ESTADÍSTICAS GLOBALES DEL SITIO (Admin) ---

// POST /api/dashboard/stats/site-visit
// Registrar visita única al sitio
router.post('/stats/site-visit', registrarVisitaSitio);

// GET /api/dashboard/stats/site-global
// Obtener total de visitas globales
router.get('/stats/site-global', obtenerEstadisticasSitio);

export default router;
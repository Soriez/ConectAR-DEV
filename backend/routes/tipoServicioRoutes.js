import express from 'express';
import controllerTipoServicio from '../controllers/tipoServicio.controller.js';

const router = express.Router();

// ! RUTAS PÚBLICAS

// GET /api/tipos-servicios/
// ? Obtiene el catálogo completo de categorías (para llenar los <select> o filtros)
router.get('/', controllerTipoServicio.getTipoServicio);

// GET /api/tipos-servicios/categorias
// ? Obtiene el catálogo completo de categorías (para llenar los <select> o filtros)
router.get('/categorias', controllerTipoServicio.getCategoriasTipoServicio);

// GET /api/tipos-servicios/nombres
// ? Obtiene el catálogo completo de nombres (para llenar los <select> o filtros)
router.get('/nombres', controllerTipoServicio.getNombresTipoServicio);

// GET /api/tipos-servicios/categorias-principales
// ? Obtiene el catálogo completo de categorías principales (para llenar los <select> o filtros)
router.get('/categorias-principales', controllerTipoServicio.getCategoriasPrincipalesTipoServicio);

export default router;
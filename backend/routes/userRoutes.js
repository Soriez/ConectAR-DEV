import express from 'express';

import { protect } from '../middleware/authMiddleware.js';

// 1. Importamos el controlador
import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    getAllFreelancers,
    getPremiumFreelancers,
    becomeFreelancer,
    toggleAvailability,
    upgradeToPremium,
    actualizarSkillsUser,
    incrementVisit,
    incrementLinkedinAccess,
    incrementPortfolioAccess,
    getFreelancersByMainCategory,
    getFreelancersBySpecificCategory,
    deleteUser
} from '../controllers/user.controller.js';

const router = express.Router();
// --- Definimos las rutas CRUD ---

// (C) CREATE - Crear un usuario (Registro)
// Petición POST a /api/users/
router.post('/register', registerUser);

// POST a /api/users/login (Login)
router.post('/login', loginUser);

// (R) READ - Obtener todos los freelancers
// Petición GET a /api/users/freelancers
router.get('/freelancers', getAllFreelancers)

// (R) READ - Obtener freelancers PREMIUM (Endpoint dedicado)
// Petición GET a /api/users/freelancers/premium
router.get('/freelancers/premium', getPremiumFreelancers);

// (R) READ - Obtener freelancers por Categoría Principal
// Petición GET a /api/users/freelancers/category-main/:category
router.get('/freelancers/category-main/:category', getFreelancersByMainCategory);

// (R) READ - Obtener freelancers por Categoría Específica
// Petición GET a /api/users/freelancers/category-specific/:category
router.get('/freelancers/category-specific/:category', getFreelancersBySpecificCategory);

// (R) READ - Obtener todos los usuarios
// Petición GET a /api/users/
router.get('/', getAllUsers);

// (R) READ - Obtener un usuario por ID
// Petición GET a /api/users/:id
router.get('/:id', getUserById);

// (U) UPDATE - Actualizar un usuario por ID
// Petición PUT a /api/users/:id
router.put('/:id', protect, updateUser);


// (U) UPDATE - Convertirse en Freelancer
// PUT a /api/users/become-freelancer
router.put('/hacerse-freelancer', protect, becomeFreelancer);

// (U) UPDATE - Cambiar Disponibilidad
// PUT a /api/users/availability
router.put('/availability', protect, toggleAvailability);

// (U) UPDATE - Convertirse en Premium
// PUT a /api/users/upgrade-premium
router.put('/hacerse-premium', protect, upgradeToPremium);

// PUT /api/users/:id/skills
router.put('/:id/skills', protect, actualizarSkillsUser);

// (D) DELETE - Eliminar un usuario por ID
// Petición DELETE a /api/users/:id
router.delete('/:id', protect, deleteUser);

// --- ESTADÍSTICAS ---
router.put('/:id/visitas', incrementVisit);
router.put('/:id/linkedin', incrementLinkedinAccess);
router.put('/:id/portfolio', incrementPortfolioAccess);

// 2. Exportamos el router para que server.js pueda usarlo
export default router;
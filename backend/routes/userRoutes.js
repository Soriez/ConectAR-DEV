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
    becomeFreelancer,
    toggleAvailability,
    upgradeToPremium,
    actualizarSkillsUser
} from '../controllers/user.controller.js';

const router = express.Router();
// --- Definimos las rutas CRUD ---

// (C) CREATE - Crear un usuario (Registro)
// Petición POST a /api/users/
// (Usamos la función registerUser que creamos en el paso anterior)
router.post('/register', registerUser);

// POST a /api/users/login (Login)
router.post('/login', loginUser);

// (R) READ - Obtener todos los freelancers
//Petición GET a /api/users/freelancers
router.get('/freelancers', getAllFreelancers)

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
router.put('/become-freelancer', protect, becomeFreelancer);

// (U) UPDATE - Cambiar Disponibilidad
// PUT a /api/users/availability
router.put('/availability', protect, toggleAvailability);

// (U) UPDATE - Convertirse en Premium
// PUT a /api/users/upgrade-premium
router.put('/upgrade-premium', protect, upgradeToPremium);

// PUT /api/users/:id/skills
router.put('/:id/skills', protect, actualizarSkillsUser);

// 2. Exportamos el router para que server.js pueda usarlo
export default router;
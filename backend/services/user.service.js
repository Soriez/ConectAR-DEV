import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from "mongoose";



//Función para obtener todos los usuarios que hay en la base de datos
const obtenerTodosLosUsuarios = async () => {
    const usuarios = await User.find();
    return usuarios
}

//Función para obtener un usuario en específico mediante su email
const usuarioExiste = async (email) => {
    const userExist = await User.findOne({ email })
    if (userExist) {
        return true
    }
}

const verificarPasword = async (password, user) => {
    // Verificar si el usuario existe y si la contraseña es correcta
    // Usamos bcrypt.compare para comparar el texto plano con el hash
    const verificacion = await bcrypt.compare(password, user.password)
    return verificacion
}

const buscarUsuarioConPassword = async (email) => {
    const usuario = await User.findOne({ email }).select('+password');
    return usuario
}

//Función para guardar en la base de datos un NUEVO usuario
const guardarUsuario = async (nombre, apellido, email, password, role, saltRounds) => {

    const hashedPassword = await hashearPassword(password, saltRounds)

    // Si se intenta registrar como freelancer, forzamos el rol 'pendiente'
    let userRole = role || 'cliente';
    if (userRole === 'freelancer') {
        userRole = 'pendiente';
    }

    const newUser = new User({
        nombre, apellido, email,
        password: hashedPassword,
        role: userRole,
    })

    const usuarioGuardado = await newUser.save()
    return usuarioGuardado
}

//Función para actualizar los datos de un usuario
const actualizarUsuario = async (authenticatedUserId, updates) => {
    // Si viene la contraseña, la hasheamos antes de actualizar
    if (updates.password) {
        updates.password = await hashearPassword(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
        authenticatedUserId, // ¡USAMOS EL ID SEGURO DEL TOKEN!
        updates,
        {
            new: true,
            runValidators: true,
            omitUndefined: true
        }
    ).select('-password');
    return updatedUser
}

const hashearPassword = async (password, saltRounds) => {
    const passwordHasheada = await bcrypt.hash(password, saltRounds);
    return passwordHasheada
}

// --- Función Auxiliar para Generar JWT ---
// Usa el JWT_SECRET que debes poner en tu .env
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.VITE_JWT_SECRET, {
        expiresIn: '1d', // El token es válido por 1 día
    });
};

// Función para obtener freelancers con filtros opcionales
const obtenerFreelancers = async (filter = {}) => {
    // Si no se pasa ningún filtro, por defecto buscamos todos los freelancers
    const baseFilter = { role: 'freelancer', ...filter };
    const freelancers = await User.find(baseFilter)
        .populate({
            path: 'servicios',
            populate: {
                path: 'tipoServicio',
                model: 'TipoServicio'
            }
        })
        .populate('opiniones');
    return freelancers;
};

// Función para obtener freelancers premium
const obtenerFreelancersPremium = async () => {
    const freelancers = await User.find({
        role: 'premium' // Buscamos por ROL premium ahora
    }).populate('opiniones');
    return freelancers;
};

const buscarUsuarioSinPassword = async (decoded) => {
    const user = await User.findById(decoded.id).select('-password');
    return user;
};

// --- NUEVAS FUNCIONES DE ESTADO ---

// 1. Convertir a Freelancer (con campos nuevos)
const convertirAFreelancer = async (userId, linkedin, portfolio, descripcion, role) => {

    // Usamos findById y save() en lugar de findByIdAndUpdate para asegurar que se guarden los cambios
    const user = await User.findById(userId);
    const userSaved = await user.save();

    const userJson = userSaved.toJSON();
    delete userJson.password;

    return userJson;
};

// 2. Cambiar Disponibilidad (Disponible / Ocupado)
const cambiarDisponibilidad = async (userId, estado) => {
    const userUpdate = await User.findByIdAndUpdate(
        userId,
        { $set: { isDisponible: estado } },
        { new: true }
    ).select('-password');

    if (!userUpdate) {
        throw new Error('Usuario no encontrado al intentar cambiar disponibilidad');
    }

    return userUpdate.toJSON();
};

const cancelarSolicitudFreelancer = async (userId) => {
    // 1. Buscamos el usuario (instancia de Mongoose)
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // 2. Modificamos las propiedades directamente
    user.role = 'cliente';
    user.linkedin = "";
    user.portfolio = "";
    user.descripcion = "";

    // 3. Guardamos los cambios. Esto dispara validaciones y middleware de Mongoose.
    const updatedUser = await user.save();

    // 4. Retornamos el objeto limpio
    const userJson = updatedUser.toJSON();
    delete userJson.password;
    return userJson;
};

// 3. Convertir a Premium
const convertirAPremium = async (userId, plan) => {
    // Usamos findById y save()
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Usuario no encontrado al intentar convertir a Premium');
    }

    user.plan = plan;

    // Si se convierte a premium, actualizamos el ROL a 'premium'
    user.role = 'premium'; // NUEVO REQUERIMIENTO: Premium es un rol

    const userSaved = await user.save();

    const userJson = userSaved.toJSON();
    delete userJson.password;

    return userJson;
};



// --- FUNCIONES DE ESTADÍSTICAS ---

const incrementarVisitas = async (userId, ip) => {
    const user = await User.findById(userId);
    if (!user) return null;

    if (!user.visitHistory) {
        user.visitHistory = [];
    }

    const now = new Date();
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 horas

    // Buscar si esta IP ya visitó
    const visitIndex = user.visitHistory.findIndex(v => v.ip === ip);

    if (visitIndex !== -1) {
        const lastVisit = new Date(user.visitHistory[visitIndex].lastVisit);
        // Si la última visita fue hace menos de 24 horas, no contamos
        if (now - lastVisit < ONE_DAY) {
            return user;
        }
        // Si pasó más de un día, actualizamos la fecha y sumamos visita
        user.visitHistory[visitIndex].lastVisit = now;
        user.cantVisitas += 1;
    } else {
        // Nueva IP, agregamos al historial y sumamos visita
        user.visitHistory.push({ ip, lastVisit: now });
        user.cantVisitas += 1;
    }

    return await user.save();
};

const incrementarLinkedin = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        { $inc: { cantAccesosLinkedin: 1 } },
        { new: true }
    ).select('-password');
};

const incrementarPortfolio = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        { $inc: { cantAccesosPortfolio: 1 } },
        { new: true }
    ).select('-password');
};



// Obtener freelancers por Categoría Principal (ej: "Desarrollo Web")
const obtenerFreelancersPorCategoria = async (categoriaPrincipal) => {
    // 1. Buscar los Tipos de Servicio que coinciden con la categoría principal
    const tipos = await mongoose.model('TipoServicio').find({
        categoria_principal: { $regex: new RegExp(`^${categoriaPrincipal}$`, 'i') } // Case insensitive
    });

    const tiposIds = tipos.map(t => t._id);

    // 2. Buscar los Servicios que usan esos tipos
    const servicios = await mongoose.model('Servicio').find({
        tipoServicio: { $in: tiposIds }
    });

    const freelancerIds = [...new Set(servicios.map(s => s.freelancer))];

    // 3. Buscar los Freelancers dueños de esos servicios
    const freelancers = await User.find({
        _id: { $in: freelancerIds },
        role: 'freelancer'
    })
        .populate({
            path: 'servicios',
            populate: {
                path: 'tipoServicio',
                model: 'TipoServicio'
            }
        })
        .populate('opiniones');

    return freelancers;
};

// Obtener freelancers por Categoría Específica (ej: "Full Stack")
const obtenerFreelancersPorSubCategoria = async (categoriaEspecifica) => {
    // 1. Buscar los Tipos de Servicio que coinciden con la categoría específica
    const tipos = await mongoose.model('TipoServicio').find({
        categoria: { $regex: new RegExp(`^${categoriaEspecifica}$`, 'i') }
    });

    const tiposIds = tipos.map(t => t._id);

    // 2. Buscar los Servicios que usan esos tipos
    const servicios = await mongoose.model('Servicio').find({
        tipoServicio: { $in: tiposIds }
    });

    const freelancerIds = [...new Set(servicios.map(s => s.freelancer))];

    // 3. Buscar los Freelancers
    const freelancers = await User.find({
        _id: { $in: freelancerIds },
        role: 'freelancer'
    })
        .populate({
            path: 'servicios',
            populate: {
                path: 'tipoServicio',
                model: 'TipoServicio'
            }
        })
        .populate('opiniones');

    return freelancers;
};

const actualizarSkillsUser = async (userId, newSkills) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { skills: newSkills } }, // Usamos $set (si ya lo tenías)
        { new: true, runValidators: true }
    ).select('-password');

    // Si no se encontró el usuario, lanzamos un error claro.
    if (!updatedUser) {
        throw new Error('Usuario no encontrado para la actualización de skills.');
    }

    // 🟢 CORRECCIÓN CLAVE: Usamos .toJSON() para serializar el objeto de Mongoose.
    // Esto previene errores si hay propiedades virtuales o tipos complejos.
    return updatedUser.toJSON();
};

//Eliminar usuario
const eliminarUsuario = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    return deletedUser;
};

// Rechazar usuario (Actualizar estado a rechazado)
const rechazarUsuario = async (userId, motivo) => {

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { estado: 'rechazado', role: 'cliente', motivoRechazo: motivo } },
        { new: true }
    );

    return user;
};

// Aprobar usuario (Convertir a Freelancer)
const aprobarUsuario = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    user.estado = 'aprobado';
    // Si era pendiente, pasa a freelancer (o premium si ya tenía plan, pero asumimos freelancer base)
    if (user.role === 'pendiente') {
        user.role = 'freelancer';
    }

    await user.save();
    return user;
};

// Reaplicar usuario (Volver a pendiente)
const reaplicarUsuario = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                estado: 'pendiente',
                role: 'pendiente',
                motivoRechazo: null // Limpiamos el motivo anterior
            }
        },
        { new: true }
    );
    return user;
};

export default {
    obtenerTodosLosUsuarios,
    usuarioExiste,
    guardarUsuario,
    actualizarUsuario,
    generateToken,
    verificarPasword,
    buscarUsuarioConPassword,
    obtenerFreelancers,
    obtenerFreelancersPremium,
    buscarUsuarioSinPassword,
    convertirAFreelancer,
    cambiarDisponibilidad,
    convertirAPremium,
    actualizarSkillsUser,
    incrementarVisitas,
    incrementarLinkedin,
    incrementarPortfolio,
    obtenerFreelancersPorCategoria,
    obtenerFreelancersPorSubCategoria,
    eliminarUsuario,
    cancelarSolicitudFreelancer,
    rechazarUsuario,
    aprobarUsuario,
    reaplicarUsuario
}

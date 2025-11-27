const mongoose = require('mongoose')
const { Schema } = mongoose;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  // --- Datos Existentes ---
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },

  // --- Rol y Estado ---
  role: {
    type: String,
    enum: ['cliente', 'freelancer'],
    default: 'cliente'
  },

  // Para la pasarela de pago y ordenamiento
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },

  // --- Perfil Freelancer ---
  linkedin: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  descripcion: { type: String, trim: true },
  isDisponible: { type: Boolean, default: true },

  skills: {
    type: [String],
    default: [], // Por defecto, es un array vacío
    validate: {
      validator: function (v) {
        return v.length <= 5; // Límite de 5 skills
      },
      message: props => `El perfil solo puede tener un máximo de 5 skills, pero se intentó guardar ${props.value.length}.`
    }
  },

  // --- Estadísticas para el Dashboard ---
  cantVisitas: { type: Number, default: 0 },
  cantAccesosLinkedin: { type: Number, default: 0 },
  cantAccesosPortfolio: { type: Number, default: 0 },

  // --- Relaciones ---

  // 1. Opiniones RECIBIDAS (Para mostrar en el perfil del freelancer)
  // Cambio: De String a Array de ObjectIds
  opiniones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opinion'
  }],

  // 2. [NUEVO] Servicios que ofrece
  // Necesitas crear el modelo 'Service' o 'Servicio'
  servicios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio'
  }]

}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema, 'usuarios');



// funciones que se usarán en user.controller.js para que el controlador no maneje lógica y quede todo bien modularizado y bien distribuidas las responsabilidades

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

  const newUser = new User({
    nombre, apellido, email,
    password: hashedPassword,
    role: role || 'cliente'
  })

  const usuarioGuardado = await newUser.save()
  return usuarioGuardado
}

//Función para actualizar los datos de un usuario
const actualizarUsuario = async (authenticatedUserId, updates) => {
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
  const freelancers = await User.find(baseFilter);
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

  if (!user) {
    throw new Error('Usuario no encontrado al intentar convertir a freelancer');
  }

  // Actualizamos los campos manualmente
  user.role = role || 'freelancer';
  user.linkedin = linkedin;
  user.portfolio = portfolio;
  user.descripcion = descripcion;

  // Guardamos el usuario actualizado
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

// 3. Convertir a Premium
const convertirAPremium = async (userId, plan) => {
  // Usamos findById y save()
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('Usuario no encontrado al intentar convertir a Premium');
  }

  user.plan = plan;

  // Aseguramos que sea freelancer al hacerse premium
  if (user.role !== 'freelancer') {
    user.role = 'freelancer';
  }

  const userSaved = await user.save();

  const userJson = userSaved.toJSON();
  delete userJson.password;

  return userJson;
};

const actualizarSkills = async (userId, newSkills) => {
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

module.exports = {
  User,
  obtenerTodosLosUsuarios,
  usuarioExiste,
  guardarUsuario,
  actualizarUsuario,
  generateToken,
  verificarPasword,
  buscarUsuarioConPassword,
  obtenerFreelancers,
  buscarUsuarioSinPassword,
  convertirAFreelancer,
  cambiarDisponibilidad,
  convertirAPremium,
  actualizarSkills
}
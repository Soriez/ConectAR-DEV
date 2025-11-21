const mongoose = require('mongoose')
const { Schema } = mongoose;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  // --- Datos de Cuenta (Todos los usuarios) ---
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true, // Asegura que no haya dos emails iguales
    lowercase: true,
    trim: true,
    // Valida que sea un formato de email simple
    match: [/\S+@\S+\.\S+/, 'Por favor, usa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    select: false // ¡CLAVE! No envía el hash de la contraseña en las queries por defecto
  },
  isFreelancer: {
    type: Boolean,
    required: true,
    default: false // Por defecto, un usuario no es freelancer al registrarse
  },

  // --- Perfil de Freelancer (Opcional) ---
  linkedin: {
    type: String,
    trim: true
  },
  portfolio: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  tarifa: {
    type: Number,
    // Solo es requerido si es freelancer
    required: function() { return this.isFreelancer; },
    default: 0
  },
  isDisponible: {
    type: Boolean,
    default: true
  },
  opiniones: [
    // Esto te permite guardar los IDs de las opiniones
    // que estarán en *otra* colección (Modelo 'Opinion')
    {
      type: Schema.Types.ObjectId,
      ref: 'Opinion'
    }
  ]
}, {
  // Añade automáticamente los campos: createdAt y updatedAt
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
const usuarioExiste = async ( email ) => {
  const userExist = await User.findOne({ email })
  if(userExist) {
    return true
  }
}

const verificarPasword = async ( password, user ) => {
  // Verificar si el usuario existe y si la contraseña es correcta
  // Usamos bcrypt.compare para comparar el texto plano con el hash
  const verificacion = await bcrypt.compare(password, user.password)
  return verificacion
}

const buscarUsuarioConPassword = async ( email ) => {
  const usuario = await User.findOne({ email }).select('+password');
  return usuario
}

//Función para guardar en la base de datos un NUEVO usuario
const guardarUsuario = async ( nombre, apellido, email, password, isFreelancer, saltRounds ) => {

  const hashedPassword = await hashearPassword( password, saltRounds )

  const newUser = new User({
    nombre, apellido, email,
    password: hashedPassword,
    isFreelancer
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

const hashearPassword = async ( password, saltRounds ) => {
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

const obtenerFreelancers = async () => {
  const freelancers = await User.find({ isFreelancer: true });
  return freelancers
}

const buscarUsuarioSinPassword = async ( decoded ) => {
  return await User.findById(decoded.id).select('-password');
}



module.exports = {
  obtenerTodosLosUsuarios,
  usuarioExiste,
  guardarUsuario,
  actualizarUsuario,
  generateToken,
  verificarPasword,
  buscarUsuarioConPassword,
  obtenerFreelancers,
  buscarUsuarioSinPassword,

}
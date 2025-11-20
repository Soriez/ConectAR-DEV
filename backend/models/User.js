import mongoose from 'mongoose'
const { Schema } = mongoose;

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
export default User;
import mongoose from 'mongoose'
const { Schema } = mongoose;

const userSchema = new Schema({
  // --- Datos Existentes ---
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },

  // --- Rol y Estado ---
  role: {
    type: String,
    enum: ['cliente', 'freelancer', 'pendiente', 'premium', 'admin', 'rechazado'],
    default: 'cliente'
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente'
  },
  motivoRechazo: { type: String },

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
  visitHistory: [{
    ip: String,
    lastVisit: Date
  }],
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

export default User
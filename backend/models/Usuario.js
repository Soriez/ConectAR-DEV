const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  // Campos básicos para todos
  nombreCompleto: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ // Validación de formato
  },
  contraseña: {
    type: String,
    required: true,
    minlength: 8
  },
  rol: {
    type: String,
    enum: ['usuario', 'mentor', 'admin'],
    required: true
  },

  // Campos adicionales
  avatarUrl: {
    type: String,
    default: '' // URL de imagen de perfil
  },
  verificado: {
    type: Boolean,
    default: false // Estado de verificación de cuenta
  },

  // Campos específicos para usuarios que contratan
  historialServicios: [{
    servicioId: mongoose.Schema.Types.ObjectId,
    fecha: Date,
    mentor: String,
    estado: {
      type: String,
      enum: ['pendiente', 'completado', 'cancelado'],
      default: 'pendiente'
    }
  }],
  comentariosRealizados: [{
    mentorId: mongoose.Schema.Types.ObjectId,
    comentario: {
      type: String,
      maxlength: 500
    },
    valoracion: {
      type: Number,
      min: 1,
      max: 5
    },
    fecha: Date
  }],

  // Campos específicos para mentores
  especialidad: {
    type: String,
    enum: ['backend', 'frontend', 'fullstack', 'UX', 'mobile', 'datos', 'devops']
  },
  serviciosOfrecidos: [{
    titulo: {
      type: String,
      required: true,
      maxlength: 100
    },
    descripcion: {
      type: String,
      required: true,
      maxlength: 1000
    },
    precio: {
      type: Number,
      min: 0
    },
    duracion: {
      type: String,
      maxlength: 50
    }
  }],
  disponibilidad: {
    type: String,
    enum: ['disponible', 'ocupado', 'inactivo'],
    default: 'disponible'
  },
  valoraciones: [{
    usuarioId: mongoose.Schema.Types.ObjectId,
    comentario: {
      type: String,
      maxlength: 500
    },
    puntuacion: {
      type: Number,
      min: 1,
      max: 5
    },
    fecha: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);

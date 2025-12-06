import mongoose from 'mongoose';
const { Schema } = mongoose;

const servicioSchema = new Schema({
    // 1. Quién lo ofrece
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 2. Qué servicio es (Referencia al Catálogo)
    tipoServicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoServicio', // Referencia al modelo de arriba
        required: true
    },

    // 3. Detalles personalizados del Freelancer
    precio: {
        type: Number,
        required: [true, 'Debes establecer un precio base'],
        min: 0
    },
    descripcionPersonalizada: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    tiempoEstimado: {
        type: String
    }

}, { timestamps: true });

// Evitar que un freelancer ofrezca el mismo tipo de servicio dos veces
servicioSchema.index({ freelancer: 1, tipoServicio: 1 }, { unique: true });

const Servicio = mongoose.model('Servicio', servicioSchema, 'servicios');

export default Servicio;
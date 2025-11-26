const mongoose = require('mongoose');
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

// --- FUNCIONES LÓGICAS ---

// 1. Guardar Servicio
const guardarServicio = async (freelancerId, tipoServicioId, precio, descripcion) => {
    const nuevoServicio = new Servicio({
        freelancer: freelancerId,
        tipoServicio: tipoServicioId,
        precio,
        descripcionPersonalizada: descripcion
    });

    const servicioGuardado = await nuevoServicio.save();

    // Actualizar al usuario
    await mongoose.model('User').findByIdAndUpdate(
        freelancerId,
        { $push: { servicios: servicioGuardado._id } }
    );

    return servicioGuardado;
};

// 2. Obtener Servicios por Freelancer
const obtenerServiciosPorFreelancer = async (freelancerId) => {
    return await Servicio.find({ freelancer: freelancerId })
        .populate('tipoServicio');
};

// 3. Eliminar Servicio (LA FUNCIÓN QUE FALTABA)
const eliminarServicio = async (servicioId, freelancerId) => {
    const servicioEliminado = await Servicio.findOneAndDelete({
        _id: servicioId,
        freelancer: freelancerId // Aseguramos que solo el dueño pueda borrarlo
    });

    if (servicioEliminado) {
        // Lo sacamos del array del usuario
        await mongoose.model('User').findByIdAndUpdate(
            freelancerId,
            { $pull: { servicios: servicioId } }
        );
    }
    return servicioEliminado;
};
// 4. Actualizar Servicio
const servicioActualizado = async (servicioId, freelancerId, datosActualizados) => {
    // findOneAndUpdate asegura que el servicio pertenezca al freelancer (seguridad)
    const servicioActualizado = await Servicio.findOneAndUpdate(
        { _id: servicioId, freelancer: freelancerId },
        datosActualizados,
        { new: true, runValidators: true } // new: devuelve el dato actualizado
    ).populate('tipoServicio');

    return servicioActualizado;
};

module.exports = {
    Servicio,
    guardarServicio,
    obtenerServiciosPorFreelancer,
    eliminarServicio,
    servicioActualizado
};
const mongoose = require('mongoose');
const { Schema } = mongoose;

const opinionSchema = new Schema({
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true
    },
    puntuacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    opinion: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Opinion = mongoose.model('Opinion', opinionSchema, 'opinions');

// --- FUNCIONES DE SERVICIO (Lógica de DB) ---

// 1. Guardar opinión y vincularla al usuario destinatario
const guardarOpinion = async (destinatarioId, autorId, puntuacion, textoOpinion) => {
    // a. Crear la opinión
    const nuevaOpinion = new Opinion({
        destinatario: destinatarioId,
        autor: autorId,
        puntuacion,
        opinion: textoOpinion
    });

    const opinionGuardada = await nuevaOpinion.save();

    // b. Buscar al usuario destinatario y agregar el ID de la opinión a su array
    // Nota: Usamos mongoose.model('User') para evitar dependencias circulares de archivos
    await mongoose.model('User').findByIdAndUpdate(
        destinatarioId,
        { $push: { opiniones: opinionGuardada._id } }
    );

    return opinionGuardada;
};

// 2. Obtener opiniones RECIBIDAS por un usuario (Perfil del Freelancer)
const obtenerOpinionesRecibidas = async (usuarioId) => {
    const opiniones = await Opinion.find({ destinatario: usuarioId })
        .populate('autor', 'nombre apellido email')
        .sort({ createdAt: -1 });
    return opiniones;
};

// 3. Obtener opiniones REALIZADAS por un usuario (Historial del Cliente)
const obtenerOpinionesRealizadas = async (usuarioId) => {
    const opiniones = await Opinion.find({ autor: usuarioId })
        .populate('destinatario', 'nombre apellido email')
        .sort({ createdAt: -1 });
    return opiniones;
};

// 4. Eliminar una opinión (Opcional, pero útil para administración)
const eliminarOpinion = async (opinionId) => {
    const opinion = await Opinion.findByIdAndDelete(opinionId);

    if (opinion) {
        // También la sacamos del array del usuario
        await mongoose.model('User').findByIdAndUpdate(
            opinion.destinatario,
            { $pull: { opiniones: opinionId } }
        );
    }
    return opinion;
};

module.exports = {
    Opinion,
    guardarOpinion,
    obtenerOpinionesRecibidas,
    obtenerOpinionesRealizadas,
    eliminarOpinion
};
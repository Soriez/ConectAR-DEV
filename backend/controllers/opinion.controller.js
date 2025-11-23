import opinionModel from '../models/opinion.model.js';
const {
    guardarOpinion,
    obtenerOpinionesRecibidas,
    obtenerOpinionesRealizadas
} = opinionModel;

// ! POST /api/opinions
// ? Crear una nueva opinión
export const createOpinion = async (req, res) => {
    try {
        const { destinatarioId, puntuacion, opinion } = req.body;

        // El ID del autor viene del token (req.user), gracias al middleware 'protect'
        const autorId = req.user._id;

        // Validaciones básicas
        if (!destinatarioId || !puntuacion || !opinion) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Evitar auto-reseñas (opcional)
        if (destinatarioId === autorId.toString()) {
            return res.status(400).json({ message: "No puedes escribirte una opinión a ti mismo" });
        }

        // Llamamos a la lógica del modelo
        const nuevaOpinion = await guardarOpinion(destinatarioId, autorId, puntuacion, opinion);

        res.status(201).json({
            message: "Opinión creada exitosamente",
            opinion: nuevaOpinion
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al crear la opinión",
            error: error.message
        });
    }
};

// ! GET /api/opinions/recibidas/:usuarioId
// ? Obtener opiniones que le hicieron al usuario (Perfil Freelancer)
export const getReceivedOpinions = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const opiniones = await obtenerOpinionesRecibidas(usuarioId);
        res.status(200).json(opiniones);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las opiniones recibidas",
            error: error.message
        });
    }
};

// ! GET /api/opinions/realizadas/:usuarioId
// ? Obtener opiniones que el usuario escribió (Historial Cliente)
export const getGivenOpinions = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const opiniones = await obtenerOpinionesRealizadas(usuarioId);
        res.status(200).json(opiniones);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las opiniones realizadas",
            error: error.message
        });
    }
};
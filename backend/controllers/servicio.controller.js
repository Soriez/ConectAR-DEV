import { guardarServicio, obtenerServiciosPorFreelancer, eliminarServicio } from '../models/servicio.model.js';
import { obtenerTodosLosTipos } from '../models/tipoServicio.model.js';

// ! GET /api/services/types
// ? Obtener el catálogo de servicios disponibles (Para llenar el <select> del modal)
export const getServiceTypes = async (req, res) => {
    try {
        const tipos = await obtenerTodosLosTipos();
        res.status(200).json(tipos);
    } catch (error) {
        res.status(500).json({ message: "Error al cargar los tipos de servicios", error: error.message });
    }
};

// ! POST /api/services
// ? Un Freelancer agrega un servicio a su perfil
export const createService = async (req, res) => {
    try {
        const { tipoServicioId, precio, descripcion, tiempoEstimado } = req.body;

        // Obtenemos el ID del freelancer desde el token (gracias al middleware 'protect')
        const freelancerId = req.user._id;

        // Validaciones básicas
        if (!tipoServicioId || !precio || !descripcion) {
            return res.status(400).json({ message: "Faltan datos obligatorios (tipo, precio o descripción)" });
        }

        // Llamamos al modelo para guardar
        const nuevoServicio = await guardarServicio(
            freelancerId,
            tipoServicioId,
            precio,
            descripcion
        );

        res.status(201).json({
            message: "Servicio agregado correctamente",
            servicio: nuevoServicio
        });

    } catch (error) {
        // Código 11000 es duplicado en Mongo (definimos index unique en el schema)
        if (error.code === 11000) {
            return res.status(400).json({ message: "Ya ofreces este tipo de servicio. Edita el existente." });
        }
        res.status(500).json({ message: "Error al crear el servicio", error: error.message });
    }
};

// ! GET /api/services/freelancer/:id
// ? Ver los servicios que ofrece un freelancer específico
export const getServicesByFreelancer = async (req, res) => {
    try {
        const { id } = req.params; // ID del freelancer
        const servicios = await obtenerServiciosPorFreelancer(id);

        res.status(200).json(servicios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener servicios", error: error.message });
    }
};

// ! DELETE /api/services/:id
// ? Eliminar un servicio propio
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params; // ID del Servicio (no del usuario)
        const freelancerId = req.user._id;

        const resultado = await eliminarServicio(id, freelancerId);

        if (!resultado) {
            return res.status(404).json({ message: "Servicio no encontrado o no tienes permiso para eliminarlo" });
        }

        res.status(200).json({ message: "Servicio eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el servicio", error: error.message });
    }
};
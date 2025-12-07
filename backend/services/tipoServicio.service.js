// --- FUNCIONES AUXILIARES (Para el Controller) ---

import TipoServicio from "../models/tipoServicio.model.js";

// Obtener todo el catálogo para mostrar en el dropdown del frontend
const obtenerTodosLosTipos = async () => {
    return await TipoServicio.find().sort({ nombre: 1 }); // Ordenado alfabéticamente
};

export default {
    obtenerTodosLosTipos
};
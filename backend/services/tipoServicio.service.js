// --- FUNCIONES AUXILIARES (Para el Controller) ---

import TipoServicio from "../models/tipoServicio.model.js";

// Obtener todo el catálogo para mostrar en el dropdown del frontend
const obtenerTodosLosTipos = async () => {
    return await TipoServicio.find().sort({ nombre: 1 }); // Ordenado alfabéticamente
};
//Obtener todas las categorías por categoria_principal
const obtenerCategoriasPorCategoriaPrincipal = async (categoria_principal) => {
    return await TipoServicio.find({ categoria_principal }).sort({ nombre: 1 });
};
//Obtener todos los nombres por categoría
const obtenerNombresPorCategoria = async (categoria) => {
    return await TipoServicio.find({ categoria }).sort({ nombre: 1 });
};
//Obtener las categorías_principales (si se repite la categoría solo la devuelve una vez)
const obtenerCategoriasPrincipales = async () => {
    const categorias = await TipoServicio.distinct('categoria_principal');
    return categorias.sort();
};

export default {
    obtenerTodosLosTipos,
    obtenerCategoriasPorCategoriaPrincipal,
    obtenerNombresPorCategoria,
    obtenerCategoriasPrincipales
};
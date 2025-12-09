import tipoServicioService from "../services/tipoServicio.service.js";

// ! GET /api/types/
// ? Obtener todos los tipos de servicios (Legacy/General)
export const getTipoServicio = async (req, res) => {
    try {
        const tipoServicio = await tipoServicioService.obtenerTodosLosTipos();
        res.status(200).json(tipoServicio);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los tipos de servicios", error: error.message });
    }
};

// ! GET /api/types/categorias
// ? Obtener todas las sub-categorías dado una categoría principal
// ? Query param: ?principal=NombreCategoriaPrincipal
export const getCategoriasTipoServicio = async (req, res) => {
    try {
        const { principal } = req.query;
        if (!principal) {
            return res.status(400).json({ message: "Se requiere el parámetro 'principal'" });
        }

        // El servicio retorna documentos completos que coinciden con la categoria_principal.
        const servicios = await tipoServicioService.obtenerCategoriasPorCategoriaPrincipal(principal);

        // Extraemos solo los nombres de sub-categorías únicos
        const subCategoriasUnicas = [...new Set(servicios.map(t => t.categoria))];

        res.status(200).json(subCategoriasUnicas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las categorías", error: error.message });
    }
};

// ! GET /api/types/nombres
// ? Obtener todos los servicios (objetos completos) dada una sub-categoría
// ? Query param: ?categoria=NombreSubCategoria
export const getNombresTipoServicio = async (req, res) => {
    try {
        const { categoria } = req.query;
        if (!categoria) {
            return res.status(400).json({ message: "Se requiere el parámetro 'categoria'" });
        }
        // Retorna los objetos TipoServicio completos que tienen esa sub-categoría
        const servicios = await tipoServicioService.obtenerNombresPorCategoria(categoria);
        res.status(200).json(servicios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los nombres de servicios", error: error.message });
    }
};

// ! GET /api/types/categorias-principales
// ? Obtener todas las categorías principales (solo strings únicos)
export const getCategoriasPrincipalesTipoServicio = async (req, res) => {
    try {
        // El servicio retorna strings únicos gracias a .distinct('categoria_principal')
        const categorias = await tipoServicioService.obtenerCategoriasPrincipales();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las categorías principales", error: error.message });
    }
};

export default {
    getTipoServicio,
    getCategoriasTipoServicio,
    getNombresTipoServicio,
    getCategoriasPrincipalesTipoServicio
};
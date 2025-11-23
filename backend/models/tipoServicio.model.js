const mongoose = require('mongoose');
const { Schema } = mongoose;

const tipoServicioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Programación', 'Diseño', 'Marketing', 'Finanzas', 'Legal', 'Otros']
    },
    descripcionBase: {
        type: String
    }
});

const TipoServicio = mongoose.model('TipoServicio', tipoServicioSchema, 'tipos_servicios');

// --- FUNCIONES AUXILIARES (Para el Controller) ---

// Obtener todo el catálogo para mostrar en el dropdown del frontend
const obtenerTodosLosTipos = async () => {
    return await TipoServicio.find().sort({ nombre: 1 }); // Ordenado alfabéticamente
};

module.exports = {
    TipoServicio,
    obtenerTodosLosTipos
};
import mongoose from 'mongoose'
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
        trim: true
    },
    categoria_principal: {
        type: String,
        required: true,
        trim: true,
        index: true
    }
});

const TipoServicio = mongoose.model('TipoServicio', tipoServicioSchema, 'tipos_servicios');

export default TipoServicio
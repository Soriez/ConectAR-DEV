import mongoose from 'mongoose'; // Usar import si usas ES Modules en Node
const { Schema } = mongoose;

const technologySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Tecnologias = mongoose.model('Technology', technologySchema , 'technologies');

// 👇 CORRECCIÓN CLAVE: Usamos 'export default' para que funcione con 'import Tecnologias from...'
export default Tecnologias;
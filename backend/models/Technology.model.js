import mongoose from 'mongoose'; 
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

// Nota: Asegúrate que el tercer argumento ('technologies') coincida con tu colección en Mongo
const Tecnologias = mongoose.model('Technology', technologySchema , 'technologies');

export default Tecnologias;
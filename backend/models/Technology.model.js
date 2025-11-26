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

// el tercer argumento ('technologies') debe de conincidir con tu colección en Mongo
const Tecnologias = mongoose.model('Technology', technologySchema , 'technologies');

export default Tecnologias;
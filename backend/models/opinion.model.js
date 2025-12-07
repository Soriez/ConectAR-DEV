import mongoose from 'mongoose';
const { Schema } = mongoose;

// --- SCHEMA DE OPINIONES ---
// Define cómo se estructura una opinión en la base de datos
const opinionSchema = new Schema({
    // Usuario que RECIBE la opinión (el freelancer que fue calificado)
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true
    },
    // Usuario que ESCRIBE la opinión (el cliente que contrató)
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true
    },
    // Calificación numérica (1 a 5 estrellas)
    puntuacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // Texto de la opinión/reseña

    opinion: {
        type: String,
        required: true,
        trim: true // Elimina espacios al inicio y final
    }
}, { timestamps: true });// Agrega automáticamente createdAt y updatedAt

const Opinion = mongoose.model('Opinion', opinionSchema, 'opinions');

export default Opinion;
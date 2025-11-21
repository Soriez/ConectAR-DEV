
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParse: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1) /* Salida con fallo */
    }
}

module.exports = connectDB
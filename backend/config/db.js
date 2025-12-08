import mongoose from 'mongoose'
import 'dotenv/config'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParse: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error al conectar a MongoDB: ${error.message}`);
        process.exit(1) /* Salida con fallo */
    }
}

export default connectDB
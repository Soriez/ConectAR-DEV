// --- FUNCIONES LÓGICAS ---

import mongoose from "mongoose";
import Servicio from "../models/servicio.model.js";

// 1. Guardar Servicio
const guardarServicio = async (freelancerId, tipoServicioId, precio, descripcion) => {
    const nuevoServicio = new Servicio({
        freelancer: freelancerId,
        tipoServicio: tipoServicioId,
        precio,
        descripcionPersonalizada: descripcion
    });

    const servicioGuardado = await nuevoServicio.save();

    // Actualizar al usuario
    await mongoose.model('User').findByIdAndUpdate(
        freelancerId,
        { $push: { servicios: servicioGuardado._id } }
    );

    return servicioGuardado;
};

// 2. Obtener Servicios por Freelancer
const obtenerServiciosPorFreelancer = async (freelancerId) => {
    return await Servicio.find({ freelancer: freelancerId })
        .populate('tipoServicio');
};

// 3. Eliminar Servicio (LA FUNCIÓN QUE FALTABA)
const eliminarServicio = async (servicioId, freelancerId) => {
    const servicioEliminado = await Servicio.findOneAndDelete({
        _id: servicioId,
        freelancer: freelancerId // Aseguramos que solo el dueño pueda borrarlo
    });

    if (servicioEliminado) {
        // Lo sacamos del array del usuario
        await mongoose.model('User').findByIdAndUpdate(
            freelancerId,
            { $pull: { servicios: servicioId } }
        );
    }
    return servicioEliminado;
};
// 4. Actualizar Servicio
const servicioActualizado = async (servicioId, freelancerId, datosActualizados) => {
    // findOneAndUpdate asegura que el servicio pertenezca al freelancer (seguridad)
    const servicioActualizado = await Servicio.findOneAndUpdate(
        { _id: servicioId, freelancer: freelancerId },
        datosActualizados,
        { new: true, runValidators: true } // new: devuelve el dato actualizado
    ).populate('tipoServicio');

    return servicioActualizado;
};

export default {
    guardarServicio,
    obtenerServiciosPorFreelancer,
    eliminarServicio,
    servicioActualizado
};
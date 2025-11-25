import userModel from '../models/user.model.js';
import opinionModel from '../models/opinion.model.js';
import servicioModel from '../models/servicio.model.js';

const { buscarUsuarioSinPassword } = userModel;
const { obtenerOpinionesRecibidas, obtenerOpinionesRealizadas } = opinionModel;
const { obtenerServiciosPorFreelancer } = servicioModel;

// ! GET /api/dashboard
// ? Obtener datos del dashboard según el tipo de usuario
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await buscarUsuarioSinPassword({ id: userId });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Datos base para todos los usuarios
        const dashboardData = {
            usuario: {
                _id: user._id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                isFreelancer: user.isFreelancer,
                isPremium: user.isPremium
            }
        };

        // --- USUARIO NO FREELANCER ---
        if (!user.isFreelancer) {
            // Obtener opiniones que ha realizado
            const opinionesRealizadas = await obtenerOpinionesRealizadas(userId);
            
            dashboardData.estadisticas = {
                totalOpinionesRealizadas: opinionesRealizadas.length,
                ultimasOpiniones: opinionesRealizadas.slice(0, 5) // Últimas 5 opiniones
            };

            dashboardData.mensaje = "Dashboard de Cliente - Aquí puedes ver tu historial de opiniones";
        }
        
        // --- USUARIO FREELANCER (NO PREMIUM) ---
        else if (user.isFreelancer && !user.isPremium) {
            // Obtener opiniones recibidas
            const opinionesRecibidas = await obtenerOpinionesRecibidas(userId);
            
            // Calcular promedio de puntuación
            const promedioCalificacion = opinionesRecibidas.length > 0
                ? (opinionesRecibidas.reduce((sum, op) => sum + op.puntuacion, 0) / opinionesRecibidas.length).toFixed(1)
                : 0;

            // Obtener servicios ofrecidos
            const servicios = await obtenerServiciosPorFreelancer(userId);

            dashboardData.estadisticas = {
                totalOpinionesRecibidas: opinionesRecibidas.length,
                promedioCalificacion: parseFloat(promedioCalificacion),
                totalServicios: servicios.length,
                cantVisitas: user.cantVisitas || 0,
                isDisponible: user.isDisponible,
                ultimasOpiniones: opinionesRecibidas.slice(0, 5) // Últimas 5 opiniones
            };

            dashboardData.servicios = servicios;
            dashboardData.mensaje = "Dashboard de Freelancer - Gestiona tu perfil y servicios";
        }
        
        // --- USUARIO FREELANCER PREMIUM ---
        else if (user.isFreelancer && user.isPremium) {
            // Obtener opiniones recibidas
            const opinionesRecibidas = await obtenerOpinionesRecibidas(userId);
            
            // Calcular promedio de puntuación
            const promedioCalificacion = opinionesRecibidas.length > 0
                ? (opinionesRecibidas.reduce((sum, op) => sum + op.puntuacion, 0) / opinionesRecibidas.length).toFixed(1)
                : 0;

            // Obtener servicios ofrecidos
            const servicios = await obtenerServiciosPorFreelancer(userId);

            // Estadísticas avanzadas para Premium
            dashboardData.estadisticas = {
                totalOpinionesRecibidas: opinionesRecibidas.length,
                promedioCalificacion: parseFloat(promedioCalificacion),
                totalServicios: servicios.length,
                cantVisitas: user.cantVisitas || 0,
                cantAccesosLinkedin: user.cantAccesosLinkedin || 0,
                cantAccesosPortfolio: user.cantAccesosPortfolio || 0,
                isDisponible: user.isDisponible,
                ultimasOpiniones: opinionesRecibidas.slice(0, 5),
                // Estadísticas adicionales Premium
                distribucionCalificaciones: calcularDistribucionCalificaciones(opinionesRecibidas),
                tasaConversion: calcularTasaConversion(user.cantVisitas, user.cantAccesosLinkedin, user.cantAccesosPortfolio)
            };

            dashboardData.servicios = servicios;
            dashboardData.perfil = {
                linkedin: user.linkedin,
                portfolio: user.portfolio,
                descripcion: user.descripcion,
                tarifa: user.tarifa
            };
            dashboardData.mensaje = "Dashboard Premium - Acceso completo a estadísticas avanzadas";
        }

        res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        res.status(500).json({
            message: "Error al obtener los datos del dashboard",
            error: error.message
        });
    }
};

// ! GET /api/dashboard/stats/visitas
// ? Incrementar contador de visitas al perfil (solo para freelancers)
export const incrementarVisitas = async (req, res) => {
    try {
        const { freelancerId } = req.body;

        if (!freelancerId) {
            return res.status(400).json({ message: "Se requiere el ID del freelancer" });
        }

        const user = await buscarUsuarioSinPassword({ id: freelancerId });

        if (!user || !user.isFreelancer) {
            return res.status(404).json({ message: "Freelancer no encontrado" });
        }

        // Incrementar visitas
        await userModel.User.findByIdAndUpdate(
            freelancerId,
            { $inc: { cantVisitas: 1 } }
        );

        res.status(200).json({ message: "Visita registrada correctamente" });

    } catch (error) {
        res.status(500).json({
            message: "Error al registrar la visita",
            error: error.message
        });
    }
};

// ! POST /api/dashboard/stats/linkedin
// ? Incrementar contador de accesos a LinkedIn (solo para freelancers)
export const incrementarAccesosLinkedin = async (req, res) => {
    try {
        const { freelancerId } = req.body;

        if (!freelancerId) {
            return res.status(400).json({ message: "Se requiere el ID del freelancer" });
        }

        const user = await buscarUsuarioSinPassword({ id: freelancerId });

        if (!user || !user.isFreelancer) {
            return res.status(404).json({ message: "Freelancer no encontrado" });
        }

        // Incrementar accesos a LinkedIn
        await userModel.User.findByIdAndUpdate(
            freelancerId,
            { $inc: { cantAccesosLinkedin: 1 } }
        );

        res.status(200).json({ message: "Acceso a LinkedIn registrado correctamente" });

    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el acceso a LinkedIn",
            error: error.message
        });
    }
};

// ! POST /api/dashboard/stats/portfolio
// ? Incrementar contador de accesos a Portfolio (solo para freelancers)
export const incrementarAccesosPortfolio = async (req, res) => {
    try {
        const { freelancerId } = req.body;

        if (!freelancerId) {
            return res.status(400).json({ message: "Se requiere el ID del freelancer" });
        }

        const user = await buscarUsuarioSinPassword({ id: freelancerId });

        if (!user || !user.isFreelancer) {
            return res.status(404).json({ message: "Freelancer no encontrado" });
        }

        // Incrementar accesos a Portfolio
        await userModel.User.findByIdAndUpdate(
            freelancerId,
            { $inc: { cantAccesosPortfolio: 1 } }
        );

        res.status(200).json({ message: "Acceso a Portfolio registrado correctamente" });

    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el acceso a Portfolio",
            error: error.message
        });
    }
};

// --- FUNCIONES AUXILIARES ---

// Calcular distribución de calificaciones (para usuarios Premium)
const calcularDistribucionCalificaciones = (opiniones) => {
    const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    opiniones.forEach(opinion => {
        distribucion[opinion.puntuacion]++;
    });

    return distribucion;
};

// Calcular tasa de conversión (visitas -> clics en enlaces)
const calcularTasaConversion = (visitas, accesosLinkedin, accesosPortfolio) => {
    if (visitas === 0) return { linkedin: 0, portfolio: 0, total: 0 };

    const tasaLinkedin = ((accesosLinkedin / visitas) * 100).toFixed(2);
    const tasaPortfolio = ((accesosPortfolio / visitas) * 100).toFixed(2);
    const tasaTotal = (((accesosLinkedin + accesosPortfolio) / visitas) * 100).toFixed(2);

    return {
        linkedin: parseFloat(tasaLinkedin),
        portfolio: parseFloat(tasaPortfolio),
        total: parseFloat(tasaTotal)
    };
};
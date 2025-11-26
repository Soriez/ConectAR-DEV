import Tecnologias from '../models/Technology.model.js';

// ! POST /api/technologies
// ? Crear una nueva tecnología (Protegido)
export const createTechnology = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Creamos la nueva tecnología
        const newTecnologias = new Tecnologias({ name });
        await newTecnologias.save();

        res.status(201).json(newTecnologias);
    } catch (error) {
        if (error.code === 11000) {
            // Error de duplicado de MongoDB (name: unique)
            return res.status(400).json({ message: 'Esa tecnología ya existe.' });
        }
        console.error("Error en createTechnology:", error);
        res.status(500).json({ message: 'Error al crear la tecnología.' });
    }
};

// ! GET /api/technologies/available
// ? Obtener lista de nombres de tecnologías (Para el frontend)
export const getAvailableTechnologies = async (req, res) => {
    try {
        // Obtenemos solo el campo 'name', ordenado alfabéticamente
        const technologies = await Tecnologias.find().select('name -_id').sort({ name: 1 });
        
        // Mapeamos para devolver un array simple de strings (ej: ["REACT", "NODEJS"])
        const techNames = technologies.map(tech => tech.name); 

        res.status(200).json(techNames);
    } catch (error) {
        console.error("Error en getAvailableTechnologies:", error);
        res.status(500).json({ message: 'Error al obtener la lista de tecnologías.' });
    }
};
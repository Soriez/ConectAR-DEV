const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const path = require('path');

// 1. Carga explícita del .env
dotenv.config();

// ----------------------------------------------------------------------------------
// CRÍTICO: Usamos VITE_MONGODB_URI si MONGO_URI no existe.
// ----------------------------------------------------------------------------------
const MONGODB_URI_REAL = process.env.MONGO_URI || process.env.VITE_MONGODB_URI || "mongodb://localhost:27017/conectardev_db";
// ----------------------------------------------------------------------------------

// --- SOLUCIÓN MissingSchemaError: Forzamos la carga de modelos ---
try {
    require('./models/user.model');
    require('./models/opinion.model');
    require('./models/servicio.model');
    require('./models/tipoServicio.model');
} catch (error) {
    console.error("❌ Error cargando modelos. Revisa las rutas en dataSeeder.js (líneas 17-20).");
    process.exit(1);
}

// Recuperamos los modelos ya registrados
const User = mongoose.model('User');
const Opinion = mongoose.model('Opinion');
const Servicio = mongoose.model('Servicio');
const TipoServicio = mongoose.model('TipoServicio');

// --- CONFIGURACIÓN Y DATOS MOCK ---
const CANTIDAD_USUARIOS = 200;
const PORCENTAJE_FREELANCERS = 0.4;
const PORCENTAJE_PREMIUM = 0.2;
const PASSWORD_DEFAULT = "123456";
const SALT_ROUNDS = 10;

const nombres = ["Alex", "Juan", "Maria", "Sofia", "Carlos", "Luis", "Ana", "Laura", "Pedro", "Miguel", "Lucia", "Diego", "Elena", "Javier", "Carmen", "Roberto", "Isabel", "Fernando", "Patricia", "Ricardo", "Valentina", "Camila", "Mateo", "Nicolas"];
const apellidos = ["Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz", "Reyes", "Morales", "Ortiz", "Castillo", "Chavez", "Vasquez"];
const rolesIT = ["Desarrollador Full Stack", "DevOps Engineer", "Diseñador UX/UI", "Data Scientist", "QA Tester", "Mobile Developer", "Cloud Architect", "Cybersecurity Specialist", "DBA", "Frontend Developer"];
const descripcionesServicios = ["Soluciones escalables y limpias.", "Optimización de rendimiento garantizada.", "Resolución de problemas complejos.", "Diseño centrado en el usuario.", "Migración a la nube segura.", "APIs RESTful eficientes.", "Consultoría tecnológica integral."];
const comentariosOpiniones = ["Excelente profesional.", "Muy buen trabajo.", "El código es impecable.", "Gran comunicación.", "Experto total en su área.", "Buen servicio.", "Increíble capacidad."];

// 🛑 ARRAY DE SERVICIOS EXPANDIDO (22 TIPOS) Y MAPEADO AL ENUM 🛑
const tiposServiciosIT = [
    // --- Programación (Mapeado a 'Programación') ---
    { nombre: "Desarrollo Web Full Stack", categoria: "Programación", icono: "fa-solid fa-layer-group" },
    { nombre: "Desarrollo Frontend (React/Vue)", categoria: "Programación", icono: "fa-brands fa-react" },
    { nombre: "Desarrollo Backend (Node/Python)", categoria: "Programación", icono: "fa-brands fa-node" },
    { nombre: "Desarrollo Mobile Híbrido", categoria: "Programación", icono: "fa-solid fa-mobile-screen-button" },
    { nombre: "DevOps y Automatización (CI/CD)", categoria: "Programación", icono: "fa-solid fa-infinity" },
    { nombre: "Arquitectura Cloud (AWS/GCP)", categoria: "Programación", icono: "fa-solid fa-cloud" },
    { nombre: "Desarrollo de APIs REST/GraphQL", categoria: "Programación", icono: "fa-solid fa-network-wired" },
    { nombre: "Microservicios y Serverless", categoria: "Programación", icono: "fa-solid fa-cubes" },

    // --- Diseño IT (Mapeado a 'Diseño') ---
    { nombre: "Diseño UI/UX Completo", categoria: "Diseño", icono: "fa-solid fa-pen-ruler" },
    { nombre: "Prototipado en Figma", categoria: "Diseño", icono: "fa-solid fa-object-group" },
    { nombre: "Diseño de Ilustraciones (SVG)", categoria: "Diseño", icono: "fa-solid fa-palette" },

    // --- Marketing Digital / SEO (Mapeado a 'Marketing') ---
    { nombre: "Estrategia de SEO Técnico", categoria: "Marketing", icono: "fa-solid fa-magnifying-glass-chart" },
    { nombre: "Marketing de Contenidos", categoria: "Marketing", icono: "fa-solid fa-bullhorn" },
    { nombre: "Análisis y Reportes Web (GA4)", categoria: "Marketing", icono: "fa-solid fa-chart-bar" },

    // --- Finanzas/Legal (Mapeado a 'Legal' o 'Finanzas') ---
    { nombre: "Asesoría de Propiedad Intelectual", categoria: "Legal", icono: "fa-solid fa-scale-balanced" },
    { nombre: "Consultoría de Compliance", categoria: "Legal", icono: "fa-solid fa-gavel" },

    // --- Otros (Data, QA, Soporte - Mapeado a 'Otros') ---
    { nombre: "Data Science y Modelos ML", categoria: "Otros", icono: "fa-solid fa-brain" },
    { nombre: "Ingeniería de Datos (ETL)", categoria: "Otros", icono: "fa-solid fa-database" },
    { nombre: "QA Automation (Selenium/Cypress)", categoria: "Otros", icono: "fa-solid fa-robot" },
    { nombre: "Soporte Técnico Nivel 2", categoria: "Otros", icono: "fa-solid fa-headset" },
    { nombre: "Desarrollo de Videojuegos (Unity)", categoria: "Otros", icono: "fa-solid fa-gamepad" },
    { nombre: "Administración de Bases de Datos", categoria: "Otros", icono: "fa-solid fa-server" },
];
// 🛑 FIN DE CORRECCIÓN 🛑

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const ejecutarSeed = async () => {
    try {
        console.log("-----------------------------------------");

        // Conexión
        const uri = MONGODB_URI_REAL;

        console.log(`🔌 Intentando conectar a la DB...`);

        if (!uri) {
            throw new Error("ERROR: La URI de conexión es nula o indefinida. Revisa tu .env o la línea de MONGODB_URI_REAL.");
        }

        await mongoose.connect(uri);
        console.log("✅ Conexión exitosa a MongoDB");

        console.log("🧹 Limpiando colecciones...");
        await Promise.all([
            User.deleteMany({}),
            Opinion.deleteMany({}),
            Servicio.deleteMany({}),
            TipoServicio.deleteMany({})
        ]);

        // PASO 1: TIPOS
        console.log("📚 Creando catálogo...");
        const tiposGuardados = await TipoServicio.insertMany(tiposServiciosIT);

        // PASO 2: USUARIOS
        console.log("👥 Creando usuarios...");
        const passwordHash = await bcrypt.hash(PASSWORD_DEFAULT, SALT_ROUNDS);
        const usuariosArr = [];

        for (let i = 0; i < CANTIDAD_USUARIOS; i++) {
            const esFreelancer = Math.random() < PORCENTAJE_FREELANCERS;
            const nombre = getRandom(nombres);
            const apellido = getRandom(apellidos);

            const usuario = {
                nombre,
                apellido,
                email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${i}@test.com`,
                password: passwordHash,
                isFreelancer: esFreelancer,
                isPremium: esFreelancer && Math.random() < PORCENTAJE_PREMIUM,
                tarifa: esFreelancer ? getRandomInt(20, 100) * 1000 : 0,
                descripcion: esFreelancer ? `${getRandom(rolesIT)}. ${getRandom(descripcionesServicios)}` : "",
                linkedin: esFreelancer ? `https://linkedin.com/in/${nombre}${i}` : "",
                portfolio: esFreelancer ? `https://${nombre}${i}.dev` : "",
                cantVisitas: esFreelancer ? getRandomInt(0, 500) : 0,
                cantAccesosLinkedin: 0,
                cantAccesosPortfolio: 0,
            };
            usuariosArr.push(usuario);
        }

        const usersDB = await User.insertMany(usuariosArr);
        const freelancersDB = usersDB.filter(u => u.isFreelancer);

        // PASO 3: RELACIONES
        console.log("🔗 Generando relaciones...");

        for (const free of freelancersDB) {

            // A. Servicios
            const serviciosIds = [];
            const numServicios = getRandomInt(1, 3);

            for (let k = 0; k < numServicios; k++) {
                const tipo = getRandom(tiposGuardados);
                const existe = await Servicio.findOne({ freelancer: free._id, tipoServicio: tipo._id });
                if (existe) continue;

                const nuevoServicio = await Servicio.create({
                    freelancer: free._id,
                    tipoServicio: tipo._id,
                    precio: getRandomInt(30, 150) * 1000,
                    descripcionPersonalizada: getRandom(descripcionesServicios),
                    tiempoEstimado: "2 semanas"
                });
                serviciosIds.push(nuevoServicio._id);
            }

            // B. Opiniones
            const opinionesIds = [];
            const numOpiniones = getRandomInt(0, 5);

            for (let k = 0; k < numOpiniones; k++) {
                let autor = getRandom(usersDB);
                while (autor._id.equals(free._id)) autor = getRandom(usersDB);

                const nuevaOpinion = await Opinion.create({
                    destinatario: free._id,
                    autor: autor._id,
                    puntuacion: getRandomInt(3, 5),
                    opinion: getRandom(comentariosOpiniones)
                });
                opinionesIds.push(nuevaOpinion._id);
            }

            // C. Actualizar Freelancer
            await User.findByIdAndUpdate(free._id, {
                $set: { servicios: serviciosIds, opiniones: opinionesIds }
            });
            process.stdout.write(".");
        }

        console.log("\n✅ ¡SEED FINALIZADO!");
        console.log(`   - Contraseña general: ${PASSWORD_DEFAULT}`);
        process.exit(0);

    } catch (error) {
        console.error("\n❌ ERROR EN EL SCRIPT:");
        console.error(error);
        process.exit(1);
    }
};

ejecutarSeed();
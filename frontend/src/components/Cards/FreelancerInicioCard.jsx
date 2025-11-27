import BotonPrincipal from "../Botones/BotonPrincipal"

/**
 * @component
 * @description Tarjeta de presentación de un Freelancer para la sección de inicio, adaptada al modelo de Mongoose.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.data - Objeto con los datos del freelancer (nombre, descripcion, tarifa, skills, etc.).
 * @returns {JSX.Element} El elemento Tarjeta (<li>).
 */
const FreelancerCard = ( { data } ) => {
    
    // 💡 MAPEO DE PROPIEDADES AL MODELO DE MONGOOSE (user.model.js):
    
    const nombreCompleto = `${data.nombre || ''} ${data.apellido || ''}`.trim();
    
    // 1. TARIFA: Usa el campo 'tarifa' del modelo.
    const tarifa = data.tarifa || 0; 
    
    // 2. DESCRIPCIÓN Y ROL: Usa el campo 'descripcion' para la bio.
    const descripcionCompleta = data.descripcion || 'Especialista de desarrollo de software.';
    
    // Usamos la primera frase de la descripción como rol principal (ej: "Full Stack Developer.")
    // Esto coincide con el patrón que se ve en el diseño que desea.
    const especialidadPrincipal = descripcionCompleta.split('.')[0] + (descripcionCompleta.includes('.') ? '.' : '...');
    
    // 3. SKILLS: Usa el campo 'skills' del modelo. Lo forzamos a ser array [] si es nulo (CLAVE).
    const habilidadesList = data.skills || [];
    
    // Usamos valores por defecto para estadísticas que probablemente aún no existen en la DB
    const rating = data.rating || '4.5'; 
    const numReviews = data.opiniones ? data.opiniones.length : 0; // Contamos las opiniones si existen
    
    return (
        // Tarjeta Contenedora (<li>)
        <li className={`
            /* Estilos Base de la Tarjeta */
            bg-gray-800 
            rounded-xl 
            text-white 
            p-4 
            shadow-lg 
            text-center 
            flex-col h-full 

            /* Responsividad: Ajustes de la tarjeta */
            sm:p-6 
            md:shadow-xl 
            lg:p-8 
        `}>
          
            {/* Sección Superior: Imagen y Datos Personales */}
            <div className="flex items-center space-x-4 mb-4">
                
                {/* Foto de Perfil y Verificación */}
                <div className={`
                    relative 
                    w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                    rounded-full overflow-hidden 
                    border-2 border-blue-500
                `}>
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-3xl sm:text-4xl text-gray-400">
                        👤
                    </div>
                    {/* Acá se podría agregar el "verificado" */}
                    <span className="absolute bottom-0 right-0 block w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-800"></span>
                </div>

                {/* Nombre y Especialidad */}
                <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-left">{nombreCompleto || 'Freelancer'}</h3>
                    {/* MOSTRAR EL ROL: La primera parte de la descripción */}
                    <p className="text-xs sm:text-sm text-gray-400 text-left">{especialidadPrincipal}</p>
                </div>
            </div>

            {/* Sección de Descripción */}
            <div className="mb-4 text-xs sm:text-sm text-gray-400 text-left">
                <p className="flex items-center">
                    {/* Usamos el rating y el número de reviews */}
                    ⭐ <span className="text-yellow-400 mr-1 ml-1 font-semibold">{rating}</span> ({numReviews})
                </p>
            </div>

            {/* Contenedor FLEX-GROW */}
            <div className="flex flex-col"> 

                {/* Descripción: Usamos la descripción completa de la DB */}
                <p className="text-gray-300 leading-relaxed text-left text-sm sm:text-base mb-4 grow overflow-hidden"> 
                    {descripcionCompleta}
                </p>

                {/* Sección de Habilidades (Tags): Usa data.skills */}
                <div className="flex flex-wrap items-center pt-2 border-t border-gray-700 mb-4 ">
                    
                    {/* Mapeamos el array 'skills' */}
                    {habilidadesList.slice(0, 4).map((habilidad, index) => (
                        <span
                            key={habilidad || index} 
                            className="bg-gray-700 text-xs sm:text-sm text-blue-300 px-2 py-1 rounded-full mr-2 mb-2"
                        >
                            {habilidad}
                        </span>
                    ))}
                    
                    {/* Mostrar el contador de habilidades extra */}
                    {habilidadesList.length > 4 && (
                        <span className="bg-blue-500 text-xs sm:text-sm px-2 py-1 rounded-full mr-2 mb-2">
                            +{habilidadesList.length - 4}
                        </span>
                    )}
                </div>
            </div>
            {/* FIN DEL CONTENEDOR FLEX-GROW */}


            {/* Sección de Tarifa y Botón (Forzado al fondo con mt-auto) */}
            <div className="mt-auto pt-4"> 
                <p className="text-xl sm:text-2xl font-extrabold text-blue-400 mb-2">
                    {/* MOSTRAR TARIFA REAL: Usamos data.tarifa */}
                    ${tarifa}<span className="text-sm text-gray-400">/hora</span>
                </p>
                <BotonPrincipal text={'Ver Perfil'}/>
            </div>
        </li>
    )
}

export default FreelancerCard
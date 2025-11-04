import BotonPrincipal from "../Botones/BotonPrincipal"

/**
 * @component
 * @description Tarjeta de presentación de un Freelancer. Diseñada para ser utilizada en una cuadrícula responsiva.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.data - Objeto con los datos del freelancer (nombre, especialidad, etc.).
 * @returns {JSX.Element} El elemento Tarjeta (<li>).
 */
const FreelancerCard = ( { data } ) => {
  return (
    // Tarjeta Contenedora (<li>): Base flex-col h-full para forzar la misma altura en un grid.
    <li className={`
        /* Estilos Base de la Tarjeta */
        bg-gray-800 
        rounded-xl                        /* Bordes ligeramente más definidos */
        text-white 
        p-4                               /* Padding base para móviles */
        shadow-lg                         /* Sombra base para móviles */
        text-center 
        flex-col h-full              /* Clave para la uniformidad de altura en el grid */

        /* Responsividad: Ajustes de la tarjeta */
        sm:p-6                            /* Más padding en pantallas pequeñas */
        md:shadow-xl                      /* Sombra más pronunciada en desktop */
        lg:p-8                            /* Más padding para pantallas grandes */
    `}>
      
      {/* Sección Superior: Imagen y Datos Personales */}
      <div className="flex items-center space-x-4 mb-4">
        
        {/* Foto de Perfil y Verificación */}
        <div className={`
            relative 
            w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 /* Responsividad: Aumenta la foto en pantallas más grandes */
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
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-left">{data.nombre}</h3>
          <p className="text-xs sm:text-sm text-gray-400 text-left">{data.especialidad}</p>
        </div>
      </div>

      {/* Sección de Descripción */}
      <div className="mb-4 text-xs sm:text-sm text-gray-400 text-left">
        <p className="flex items-center">
          ⭐ <span className="text-yellow-400 mr-1 ml-1 font-semibold">4.5</span> ({data.edad})
        </p>
      </div>

      {/* Contenedor FLEX-GROW: Asegura que la descripción empuje el contenido inferior */}
      <div className="flex flex-col"> 

        {/* Descripción: Se le permite crecer */}
        <p className="text-gray-300 leading-relaxed text-left text-sm sm:text-base mb-4 grow overflow-hidden"> 
            {/* Responsividad: Aumenta la fuente para una mejor lectura en pantallas grandes */}
            {data.descripcionCorta}
        </p>

        {/* Sección de Habilidades (Tags): Contiene la línea divisoria */}
        <div className="flex flex-wrap items-center pt-2 border-t border-gray-700 mb-4 ">
          {data.habilidades.map((habilidad, index) => (
            <span
              key={index}
              className="bg-gray-700 text-xs sm:text-sm text-blue-300 px-2 py-1 rounded-full mr-2 mb-2"
              /* Responsividad: Tags ligeramente más grandes en desktop */
            >
              {habilidad}
            </span>
          ))}
          {/* Mostrar el contador de habilidades extra */}
          {data.habilidadesExtra > 0 && (
            <span className="bg-blue-500 text-xs sm:text-sm px-2 py-1 rounded-full mr-2 mb-2">
              +{data.habilidadesExtra}
            </span>
          )}
        </div>
      </div>
      {/* FIN DEL CONTENEDOR FLEX-GROW */}


      {/* Sección de Tarifa y Botón (Forzado al fondo con mt-auto) */}
      <div className="mt-auto pt-4"> 
        <p className="text-xl sm:text-2xl font-extrabold text-blue-400 mb-2">
            {/* Responsividad: Tarifa más grande para destacarse */}
          ${data.tarifaHora}<span className="text-sm text-gray-400">{data.moneda}</span>
        </p>
        {/* El BotonPrincipal ya es responsivo por sí mismo */}
        <BotonPrincipal text={'Ver Perfil'}/>
      </div>
    </li>
  )
}

export default FreelancerCard
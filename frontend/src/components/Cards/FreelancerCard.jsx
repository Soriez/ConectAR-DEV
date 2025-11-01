import BotonPrincipal from "../Botones/BotonPrincipal"


const FreelancerCard = ( { data } ) => {
  return (
    // Tarjeta: Sigue siendo flex-col h-full
    <li className="bg-gray-800 rounded-lg text-white p-4 shadow-xl text-center flex flex-col h-full">
      
      {/* Sección Superior: Imagen y Datos Personales (Altura Fija) */}
      <div className="flex items-center space-x-4 mb-4">
        
        {/* Foto de Perfil y Verificación */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
          <div className="w-full h-full bg-gray-600 flex items-center justify-center text-4xl text-gray-400">
            👤
          </div>
          <span className="absolute bottom-0 right-0 block w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-800"></span>
        </div>

        {/* Nombre y Especialidad */}
        <div>
          <h3 className="text-lg font-bold text-left">{data.nombre}</h3>
          <p className="text-sm text-gray-400 text-left">{data.especialidad}</p>
        </div>
      </div>

      {/* Sección de Resumen y Ubicación (Índice de edad/rating) */}
      <div className="mb-4 text-sm text-gray-400 text-left">
        <p className="flex items-center mb-4">
          ⭐ <span className="text-yellow-400 mr-1 ml-1">4.5</span> ({data.edad})
        </p>
      </div>

      {/* MODIFICACIÓN CLAVE 2: Nuevo contenedor con flex-grow para el contenido variable y el HR */}
      {/* Esto asegura que la descripción crezca y empuje el HR hacia la misma posición */}
      <div className="flex flex-col flex-grow"> 

        {/* Descripción: Se le permite crecer dentro de su contenedor padre flex-grow */}
        <p className="text-gray-300 leading-relaxed text-left text-sm mb-4 flex-grow">
            {data.descripcionCorta}
        </p>

        {/* Sección de Habilidades (Tags): AHORA SÍ CONTIENE LA LÍNEA (HR) */}
        {/* El margen inferior (mb-4) en este div lo separa del precio/botón de abajo */}
        <div className="flex flex-wrap items-center pt-2 border-t border-gray-700 mb-4">
          {data.habilidades.map((habilidad, index) => (
            <span
              key={index}
              className="bg-gray-700 text-xs text-blue-300 px-2 py-1 rounded-full mr-2 mb-2"
            >
              {habilidad}
            </span>
          ))}
          {/* Mostrar el contador de habilidades extra */}
          {data.habilidadesExtra > 0 && (
            <span className="bg-blue-500 text-xs px-2 py-1 rounded-full mr-2 mb-2">
              +{data.habilidadesExtra}
            </span>
          )}
        </div>
      </div>
      {/* FIN DEL CONTENEDOR FLEX-GROW */}


      {/* Sección de Tarifa y Botón (Altura Fija, forzada al fondo por el contenedor flex-grow superior) */}
      <div className="mt-auto"> 
        <p className="text-xl font-bold text-blue-400 mb-2">
          ${data.tarifaHora}<span className="text-sm text-gray-400">{data.moneda}</span>
        </p>
        <BotonPrincipal text={'Ver Perfil'}/>
      </div>
    </li>
  )
}

export default FreelancerCard
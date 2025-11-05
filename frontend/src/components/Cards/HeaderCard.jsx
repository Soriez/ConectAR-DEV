import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

/**
 * @component
 * @description Tarjeta de cabecera utilizada para mostrar "Para empresas" y "Para Freelancers"
 * @param {object} props - Propiedades del componente.
 * @param {object} props.data - Objeto con el icono, título, subtítulo y texto del botón.
 * @returns {JSX.Element} El elemento Tarjeta de Cabecera.
 */
const HeaderCard = ( { data } ) => {
  return (
    // Contenedor principal de la tarjeta. Usamos 'grow' para que ocupe el espacio disponible en un flex/grid padre.
    <div className={`
      /* Estilos base */
      my-2                      /* Margen vertical por defecto */
      bg-blue-600 
      py-3                      /* Aumento ligero del padding vertical base */
      rounded-lg                /* Bordes redondeados más suaves */
      px-4 
      grow 
      shadow-lg                 /* Añadimos una sombra para destacarla */

      /* Responsividad */
      sm:py-4                   /* Más padding vertical en sm+ */
      md:px-6                   /* Más padding horizontal en md+ */
      md:my-4                   /* Más margen en pantallas medianas */
    `}>

      {/* 1. Sección superior: Icono y Textos */}
      <div className="flex text-white items-start gap-3 sm:gap-4 mb-3">
        
        {/* Icono de Font Awesome */}
        <FontAwesomeIcon 
          icon={data.icon} 
          className={`
            text-yellow-200 
            bg-yellow-600 
            bg-opacity-50             /* Le damos una ligera opacidad para que no opaque al texto */
            p-2                       /* Padding base del icono */
            rounded-md
            
            /* Responsividad del icono */
            text-base sm:text-lg md:text-xl /* Icono más grande en resoluciones mayores */
            sm:p-3
          `}
        />

        {/* Textos: Título y Subtítulo */}
        <div className="flex flex-col justify-center min-w-0">
          {/* Título: Aseguramos que se ajuste y tenga buen tamaño */}
          <h2 className="font-extrabold text-sm sm:text-base md:text-lg whitespace-nowrap overflow-hidden text-ellipsis">
            {data.titulo}
          </h2>
          {/* Subtítulo: Texto secundario responsivo */}
          <h3 className="text-xs sm:text-sm text-blue-200 whitespace-nowrap overflow-hidden text-ellipsis">
            {data.subtitulo}
          </h3>
        </div>
      </div>

      {/* 2. Sección inferior: Botón de Acción */}
      <div className="text-center grid">
        <button 
          className={`
            /* Estilos base del botón */
            cursor-pointer 
            bg-yellow-400 
            text-gray-900             /* Texto oscuro para contraste en botón amarillo */
            font-semibold 
            rounded-md 
            py-1.5                    /* Padding vertical base */
            transition-colors         /* Suaviza el hover */
            hover:bg-yellow-300
            
            /* Responsividad del botón */
            text-sm sm:text-base      /* Tamaño de texto más grande en sm+ */
            md:py-2                   /* Más padding vertical en md+ */
          `}
        >
          {data.textoBoton}
        </button>
      </div>
    </div>
  )
}

export default HeaderCard
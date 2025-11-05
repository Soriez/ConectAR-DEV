import { useNavigate } from "react-router";


/**
 * @component
 * @description Botón secundario oscuro estilizado, ideal para acciones menos prioritarias o alternativas.
 * Utiliza un fondo oscuro con un borde que contrasta para una clara diferenciación.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.text - Texto que se mostrará dentro del botón.
 * @returns {JSX.Element} El elemento botón secundario.
 */
const BotonSecundario = ( { link, text } ) => {

    // 1. Obtener la función de navegación de React Router
    const navigate = useNavigate(); 
    
    // Función que maneja el clic
    const handleClick = () => {
      if (link) {
        console.log("Navegando a:", link);
        // 2. Usar navigate() para cambiar la ruta sin recargar la página
        navigate(link); 
      }
    };

  return (
    // Contenedor principal del botón
    <button 
      onClick={handleClick}
      className={`
        /* Estilos base */
        bg-gray-900                /* Fondo oscuro para un estilo secundario */
        text-blue-500               /* Texto que coincide con el color del borde */
        border border-blue-500      /* Borde azul para destacar el contorno */
        rounded-lg                  /* Bordes ligeramente más redondeados que el original */
        h-12                        /* Altura estándar para mantener la consistencia con BotonPrincipal */
        px-4                        /* Padding horizontal base */
        font-bold                   /* Texto en negrita para visibilidad */
        whitespace-nowrap           /* Evita que el texto se rompa */
        my-8                        /* Margen vertical por defecto (ajustable por el padre) */
        transition-all              /* Suaviza las transiciones */
        
        /* Interacción (Hover/Focus) */
        hover:bg-gray-800           /* Ligeramente más claro al pasar el ratón para indicar interacción */
        hover:border-blue-400       /* Borde cambia sutilmente al pasar el ratón */
        focus:outline-none          /* Elimina el outline por defecto en focus */
        focus:ring-2                /* Agrega un anillo de foco para accesibilidad */
        focus:ring-blue-500         /* Color del anillo de foco */
        focus:ring-opacity-50       /* Opacidad del anillo */

        /* Responsividad: Estilos para dispositivos pequeños (sm y arriba) */
        sm:h-10                     /* Altura ajustada para pantallas pequeñas */
        sm:px-6                     /* Más padding horizontal en sm+ para mejor clicabilidad */
        sm:text-base                /* Tamaño de fuente estándar en sm+ */
        
        /* Responsividad: Estilos para dispositivos medianos (md y arriba) */
        md:h-12                     /* Vuelve a la altura estándar en md+ */
        md:text-lg                  /* Fuente ligeramente más grande en md+ */
        
        /* Responsividad: Estilos para dispositivos grandes (lg y arriba) */
        lg:px-8                     /* Más padding en pantallas grandes */
        cursor-pointer
      `}
    >
      {text}
    </button>
  )
}

export default BotonSecundario
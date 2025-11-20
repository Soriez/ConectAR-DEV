import { useNavigate } from "react-router"

/**
 * @component
 * @description Botón principal azul reutilizable con estilos responsivos.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.text - Texto que se mostrará dentro del botón.
 * @returns {JSX.Element} El elemento botón.
 */
const BotonPrincipal = ( { link, text } ) => {

  const navigate = useNavigate()

  const handleClick = () => {
    if( link ) {
      navigate(link)
    }
  }


  return (
    // Contenedor principal del botón
    <button 
      onClick={handleClick}
      className={`
        /* Estilos base */
        bg-blue-500              /* Fondo azul por defecto */
        text-white                /* Texto blanco */
        rounded-lg                /* Bordes ligeramente más redondeados */
        h-12                      /* Altura fija para consistencia en botones principales */
        px-4                      /* Padding horizontal por defecto */
        font-bold                 /* Texto en negrita para destacar */
        whitespace-nowrap         /* Previene saltos de línea en el texto */
        transition-colors         /* Suaviza las transiciones de color para hover/focus */
        
        /* Interacción (Hover/Focus) */
        hover:bg-blue-600         /* Tono más oscuro al pasar el ratón */
        focus:outline-none        /* Elimina el outline por defecto en focus */
        focus:ring-2              /* Agrega un anillo de foco para accesibilidad */
        focus:ring-blue-500       /* Color del anillo de foco */
        focus:ring-opacity-50     /* Opacidad del anillo */

        /* Responsividad: Estilos para dispositivos pequeños (sm y arriba) */
        sm:h-10                   /* Altura ligeramente menor en pantallas pequeñas si se necesita ajuste */
        sm:px-6                   /* Mayor padding horizontal en sm+ para mejor clicabilidad */
        sm:text-base              /* Tamaño de fuente estándar en sm+ */
        
        /* Responsividad: Estilos para dispositivos medianos (md y arriba) */
        md:h-12                   /* Vuelve a la altura estándar en md+ */
        md:text-lg                /* Fuente ligeramente más grande en md+ */
        md:shadow-md              /* Sombra sutil en md+ para darle profundidad */
        
        /* Responsividad: Estilos para dispositivos grandes (lg y arriba) */
        lg:px-8                   /* Más padding en pantallas grandes para un look más "premium" */
      `}
    >
      {text}
    </button>
  )
}

export default BotonPrincipal
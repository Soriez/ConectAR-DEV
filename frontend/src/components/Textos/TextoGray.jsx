
/**
 * @component
 * @description Párrafo de texto secundario (generalmente gris) utilizado para descripciones o subtítulos largos.
 * Ajusta su tamaño de fuente y espaciado vertical de forma responsiva para optimizar la lectura.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.text - Contenido de texto que se mostrará en el párrafo.
 * @returns {JSX.Element} El elemento <p>.
 */
const TextoGray = ( { text, textNumber } ) => {
  return (
    <p 
      className={`
        /* Alineación y Color */
        text-center 
        text-gray-${textNumber}
        
        /* Tipografía Responsiva */
        text-sm           // Base (Móvil): Texto pequeño para ahorrar espacio.
        md:text-base      // Tablet: Tamaño de fuente estándar.
        lg:text-lg        // Escritorio: Texto un poco más grande para mejor lectura.
        
        /* Espaciado Vertical Responsivo */
        py-4              // Base (Móvil): Padding vertical.
        sm:py-6           // Tablet en adelante: Más padding vertical para mejor separación visual.
        
        /* Utilidades UX (si está disponible en tu versión de Tailwind/CSS) */
        text-balance      // Mejora la legibilidad equilibrando las líneas de texto.
      `}
    >
      {text}
    </p>
  )
}

export default TextoGray
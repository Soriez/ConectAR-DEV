import React from 'react'

/**
 * @component
 * @description Título secundario (H2) utilizado para secciones y bloques de contenido importantes.
 * Escala su tamaño de fuente dramáticamente para atraer la atención en pantallas grandes.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.text - Contenido de texto que se mostrará en el subtítulo.
 * @returns {JSX.Element} El elemento <h2>.
 */
const TextoSubtitulo = ( { text, textColor} ) => {
  return (
    <h2 
      className={`
        /* Alineación y Color Base */
        text-center 
        font-extrabold          // Usamos "extrabold" para darle más impacto
        ${textColor}           // Color gris oscuro, ideal para títulos principales
        
        /* Tipografía Responsiva */
        text-3xl                // Base (Móvil): Tamaño grande pero no excesivo
        sm:text-4xl             // Tablet: Tamaño estándar para títulos de sección
        lg:text-5xl             // Escritorio: Tamaño extra grande para prominencia
        
        /* Espaciado Responsivo */
        mb-4                    // Margen inferior base para separación
        sm:mb-6                 // Más margen en pantallas medianas
        md:mb-8                 // Margen generoso en pantallas grandes
      `}
    >
      {text}
    </h2>
  )
}

export default TextoSubtitulo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas)

/**
 * @component
 * @description Tarjeta de presentación simple, centrada en un icono. Utilizada para listar características o pasos.
 * Clave: Se ha implementado una altura máxima (max-h) en la descripción para FORZAR una altura uniforme en la cuadrícula,
 * truncando el texto que exceda el límite.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.data - Objeto con el icono, título, descripción, color del icono y color de fondo.
 * @returns {JSX.Element} El elemento Tarjeta (<li>).
 */
const Card = ( { data } ) => {
  return (
    // Contenedor principal de la tarjeta (<li>). Mantenemos flex-col y h-full para compatibilidad si el padre lo soporta.
    <li className={`
        /* Estilos Base de la Tarjeta */
        bg-gray-800 
        rounded-xl                        
        text-center 
        p-4                               
        shadow-lg                         
        flex flex-col h-full              /* Mantenido por si el padre puede forzar la altura */

        /* Responsividad: Ajustes de la tarjeta */
        sm:p-4                            
        md:p-8                            
    `}>
        
        {/* Contenedor del Icono: Altura fija, no crece */}
        <div className={`
            text-4xl sm:text-5xl md:text-6xl 
            p-2 sm:p-4 mb-4                   
        `}>
          <FontAwesomeIcon 
            icon={['fas', data.icon]} 
            style={{color: data.color, backgroundColor: data.bgColor}}
            className='
              p-3 sm:p-4 rounded-xl         
              shadow-lg                     
            '
          />
        </div>
        
        {/* Título: Altura fija */}
        <div className="
            text-white 
            font-extrabold 
            py-2 
            text-lg sm:text-xl md:text-2xl  
        ">
            {data.title}
        </div>
        
        {/* descipción */}
        <div className='grow min-h-24 flex-col justify-start'>
            <div className="
                text-gray-400 
                py-2 
                px-2 sm:px-4             
                text-sm sm:text-base            
                leading-relaxed 
                overflow-hidden                 /* CLAVE: Oculta el texto que se desborda */
                h-auto                          /* Permite que el texto fluya hasta el max-h */
                max-h-26                  /* CLAVE: Define una altura máxima fija (ajustar según el número de líneas deseado) */
            ">
                {data.description}
            </div>
        </div>
        
    </li>
  )
}

export default Card
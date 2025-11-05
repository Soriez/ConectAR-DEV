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
        shadow-lg 
        flex flex-col h-full 
        
        /* Reducido para darle más espacio al texto */
        px-3                      /* Valor base: p-x reducido de 16px a 12px */
        sm:px-3                   /* Valor sm: p-x reducido */
        md:px-4                   /* Valor md: p-x reducido de 32px a 16px */
        
        /* Mantenemos el control de Padding Vertical para el borde */
        pt-4 
        pb-2 
        sm:pb-2 
        md:pb-4                        
    `}>
        
        {/* Contenedor del Icono: Altura fija, no crece */}
        <div className={`
            text-4xl sm:text-5xl md:text-6xl 
            p-2 sm:p-4
        `}>
          <FontAwesomeIcon 
            icon={['fas', data.icon]} 
            style={{color: data.color, backgroundColor: data.bgColor}}
            className='
              p-3 rounded-xl         
              shadow-lg                     
            '
          />
        </div>
        
        {/* Título: Altura fija */}
        <div className="
           text-white 
            font-extrabold 
            py-1 sm:py-2 
            text-lg sm:text-xl md:text-2xl
        ">
            {data.title}
        </div>
        
        {/* descipción */}
        <div className='grow min-h-24 flex-col justify-start'>
            <div className="
               text-gray-400 
                pt-2 pb-0
                text-sm sm:text-base
                leading-relaxed 
                h-auto
                max-h-26
            ">
                {data.description}
            </div>
        </div>
        
    </li>
  )
}

export default Card
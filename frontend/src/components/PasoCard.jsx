import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * @component
 * @description Tarjeta individual de un paso dentro de la sección "Cómo Funciona".
 * Devuelve un elemento <li> con el contenido y estilos de un paso.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.paso - Objeto con los datos del paso (id, icon, title, text, colorClass, bgColorClass).
 * @returns {JSX.Element} El elemento <li> con la tarjeta del paso.
 */
const PasoCard = ({ paso }) => {
    return (
        // Tarjeta de Paso Individual (<li>)
        <li 
            key={paso.id}
            // 1. Convertimos el contenedor principal a 'relative'.
            // 2. Mantenemos el padding normal, ya que el número saldrá del flujo.
            className='bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 text-left relative'
        >
            
            {/* Círculo y Número de Paso (Posicionamiento Absoluto y Negativo) */}
            {/* - 'absolute top-0 left-0' lo ancla a la esquina.
                - '-translate-x-4 -translate-y-4' mueve el elemento 4 unidades
                  hacia la izquierda (fuera del borde) y 4 unidades hacia arriba (fuera del borde),
                  logrando el efecto de sobresalir.
            */}
            <span 
                className='w-8 h-8 flex items-center justify-center text-white text-sm font-bold rounded-full bg-blue-600 absolute top-0 left-0 transform -translate-x-4 -translate-y-4 z-20'
            >
                {paso.id}
            </span>
            
            {/* Icono del Paso (Se mueve al flujo normal, sin el número) */}
            {/* Este div ya no contiene el número, sino solo el ícono. */}
            <div className={`
                w-12 h-12 flex items-center justify-center rounded-lg 
                bg-opacity-10 mb-4 
                ${paso.bgColorClass} 
            `}>
                <FontAwesomeIcon icon={paso.icon} className={`text-xl ${paso.colorClass}`} />
            </div>
            
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2'>
                {paso.title}
            </h3>
            <p className='text-sm text-gray-600 leading-relaxed'>
                {paso.text}
            </p>
        </li>
    );
};

export default PasoCard;
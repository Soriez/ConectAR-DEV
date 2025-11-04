import { Link } from 'react-router'
import { cards_data } from '../../constants/item-services-cards'
import ServicioCard from '../Cards/ServicioCard'
import TextoGray from '../Textos/TextoGray'
import TextoSubtitulo from '../Textos/TextoSubtitulo'

/**
 * @component
 * @description Sección de inicio que muestra el listado principal de categorías de servicios/tecnologías.
 * Implementa una cuadrícula responsiva para las tarjetas y un llamado a la acción al final.
 * @returns {JSX.Element} El elemento Section.
 */
const ServiciosInicio = () => {
  return (
    // Contenedor principal de la sección. Usamos padding vertical responsivo y el ID para navegación.
    <section className='bg-white py-12 sm:py-16 md:py-20' id='servicios'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        
        {/* Cabecera de la Sección */}
        <div className='mb-8 sm:mb-12'>
            <TextoSubtitulo text={'Servicios'}/>
            <TextoGray 
                text={'Conectate con freelancers Argentinos expertos en todas las áreas de tecnología. Desde desarrollo hasta inteligencia artificial, encontrá el talento que necesitas.'}
                // Centramos y limitamos el ancho de la descripción en desktop
                className="max-w-3xl mx-auto mt-2 text-base sm:text-lg" 
            />
        </div>

        {/* Contenedor de la Cuadrícula de Tarjetas */}
        <div className='mx-auto max-w-7xl'> {/* Ajustamos el contenedor de la cuadrícula al ancho máximo */}
          <ul className={`
            /* Estilos Base del Grid */
            grid 
            gap-6 sm:gap-8 lg:gap-10       /* Espacio entre tarjetas responsivo */
            mb-12 sm:mb-16                 /* Margen inferior para separar del CTA */

            /* Responsividad de la Columna */
            grid-cols-1                    /* Una columnas en dispositivos muy pequeños */
            sm:grid-cols-2                 /* Dos columnas en dispositivos pequeños (móviles grandes/tablets) */
            lg:grid-cols-4                 /* Cuatro columnas en dispositivos medianos y grandes (desktop) */
          `}>
            {
              // Mapeo de las tarjetas de servicio
              cards_data.map( (card) => (
                <ServicioCard data={card} key={card.title}/>
              ))
            }
          </ul>
        </div>
        
        {/* Sección abajo con texto y link */}
        <div className='mt-8 sm:mt-12'> {/* Margen superior para separarlo del grid */}
            <TextoGray 
                text={'¿No encontrás lo que buscás? También tenemos expertos en otras tecnologías.'}
                className="mb-4 text-base sm:text-lg" /* Ajustamos el tamaño del texto */
            />
            <div className='text-center text-blue-600 hover:text-blue-700 transition-colors font-bold text-lg sm:text-xl md:text-2xl py-2'>
                <Link
                    to={'/freelancers'}
                    className='focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2' /* Añadimos focus para accesibilidad */
                >
                    Ver todos los Servicios
                </Link>
            </div>
        </div>
      </div>
    </section>
  )
}

export default ServiciosInicio
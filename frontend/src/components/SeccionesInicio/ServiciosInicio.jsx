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
    <section className='py-20 bg-slate-900' id='servicios'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>

        {/* Cabecera de la Sección - Alineación izquierda para variar ritmo */}
        <div className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Expertos en <span className="text-blue-400">tecnología de punta</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Desde desarrollo web full-stack hasta inteligencia artificial.
              Encontrá especialistas argentinos listos para sumarse a tu equipo.
            </p>
          </div>

          <div className='hidden md:block'>
            <Link
              to={'/freelancers'}
              className='text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-2 transition-colors'
            >
              Ver todas las categorías &rarr;
            </Link>
          </div>
        </div>

        {/* Contenedor de la Cuadrícula de Tarjetas */}
        {/* Grid de Tarjetas */}
        <div className='mx-auto'>
          <ul className={`
            grid 
            gap-6 
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
            mb-12
          `}>
            {cards_data.map((card) => (
              // Nota: Asegúrate que ServicioCard maneje bien el contraste, o envuélvelo en un div blanco si es transparente.
              // Asumiendo que ServicioCard es flexible, aquí se verá bien sobre oscuro.
              <Link
                key={card.title}
                to={`/freelancers?categoria=${encodeURIComponent(card.title)}`}
                className="transform hover:-translate-y-1 transition-transform duration-300 block"
              >
                <ServicioCard data={card} />
              </Link>
            ))}
          </ul>
        </div>

        {/* Sección abajo con texto y link */}
        <div className='mt-8 sm:mt-12'> {/* Margen superior para separarlo del grid */}
          <TextoGray
            text={'¿No encontrás lo que buscás? También tenemos expertos en otras tecnologías.'}
            textNumber={'300'}
            className="mb-4 text-base sm:text-lg" /* Ajustamos el tamaño del texto */
          />
          <div className='text-center text-yellow-400 hover:text-yellow-300 transition-colors font-bold text-lg sm:text-xl md:text-2xl py-2'>
            <Link
              to={'/freelancers'}
              className='focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-md p-2 ring-1' /* Añadimos focus para accesibilidad */
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
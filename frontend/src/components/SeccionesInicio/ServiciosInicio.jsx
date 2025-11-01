
import { Link } from 'react-router'
import { cards_data } from '../../constants/item-services-cards'
import Card from '../Cards/ServicioCard'
import TextoGray from '../Textos/TextoGray'
import TextoSubtitulo from '../Textos/TextoSubtitulo'

const ServiciosInicio = () => {
  return (
    <section className='bg-white' id='servicios'>
      <div className='container mx-auto'>
        <TextoSubtitulo text={'Servicios'}/>
        <TextoGray 
        text={'Conectate con freelancers Argentinos expertos en todas las áreas de tecnología. Desde desarrollo hasta inteligencia artificial, encontrá el talento que necesitas.'}
        />
        <div className='mx-4 sm:mx-auto'>
          <ul className='grid md:grid-cols-4 gap-4'>
            {
              cards_data.map( (card) => (
                <Card data={card} key={card.title}/>
              ))
            }
          </ul>
        </div>
        <TextoGray 
          text={'¿No encontrás lo que buscás? También tenemos expertos en otras tecnologías.'}
        />
        <div className='text-center text-blue-700 font-semibold text-2xl py-4'>
          <Link
            to={'/freelancers'}
          >
          Ver todos los Servicios
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ServiciosInicio
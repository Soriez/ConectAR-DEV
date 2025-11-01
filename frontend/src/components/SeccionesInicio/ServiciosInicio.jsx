
import { cards_data } from '../../constants/item-cards'
import Card from '../Card'

const ServiciosInicio = () => {
  return (
    <div className='bg-white'>
      <div className='container mx-auto'>
      <p className='text-center text-gray-600'>
        Conectate con freelancers Argentinos expertos en todas las áreas de tecnología. Desde desarrollo hasta inteligencia artificial, encontrá el talento que necesitas.
        </p>
      <div>
        <ul className='grid md:grid-cols-4 gap-4'>
          {
            cards_data.map( (card) => (
              <Card data={card} key={card.title}/>
            ))
          }
        </ul>
      </div>

      </div>
    </div>
  )
}

export default ServiciosInicio
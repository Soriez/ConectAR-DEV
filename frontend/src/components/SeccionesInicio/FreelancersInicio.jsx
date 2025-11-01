
import TextoGray from '../Textos/TextoGray'
import TextoSubtitulo from '../Textos/TextoSubtitulo'
import { freelancersDestacadosData } from '../../constants/item-freelancers-cards'
import FreelancerCard from '../Cards/FreelancerCard'
import BotonSecundario from '../Botones/BotonSecundario'

const FreelancersInicio = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container mx-auto text-center'>
        <TextoSubtitulo text={'Freelancers Destacados'}/>
        <TextoGray text={'Conocé algunos de los profesionales Argentinos más talentosos de nuestra plataforma. Todos verificados y con experiencia comprobada.'}/>
        <div className='mx-4 sm-mx-auto'>
          <ul className='grid md:grid-cols-4 gap-4'>
            {
              freelancersDestacadosData.map( (freelancer) => (
                <FreelancerCard data={freelancer} key={freelancer.id}/>
              ))
            }
          </ul>
        </div>
        <BotonSecundario text={'Ver Todos los Freelancers'}/>
      </div>
    </section>
  )
}

export default FreelancersInicio
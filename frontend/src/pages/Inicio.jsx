
import ContactoInicio from '../components/SeccionesInicio/ContactoInicio'
import FreelancersInicio from '../components/SeccionesInicio/FreelancersInicio'
import HeaderInicio from '../components/SeccionesInicio/HeaderInicio'
import ServiciosInicio from '../components/SeccionesInicio/ServiciosInicio'

const Inicio = () => {
  return (
    // Opcion gradiente completo
    <div className='from-blue-950 to-blue-200 bg-linear-to-b'>
      <div className=''>
        <HeaderInicio />
      </div>

      <div className=''>
        <ServiciosInicio />
        <FreelancersInicio />
        <ContactoInicio />
      </div>
    </div>

  // Opcion 2: fondos separados con un gradiente intermedio
    // <div>
    //   <div className='bg-blue-950'>
    //     <HeaderInicio />
    //   </div>
    //   <div className="h-20 bg-gradient-to-b from-blue-950 to-blue-800"/>
    //   <div className=' from-blue-800 to-blue-200 bg-linear-to-b'>
    //     <ServiciosInicio />
    //     <FreelancersInicio />
    //     <ContactoInicio />
    //   </div>
    // </div>
  )
}

export default Inicio
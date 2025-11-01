
import ComoFuncionaInicio from '../components/SeccionesInicio/ComoFuncionaInicio'
import ContactoInicio from '../components/SeccionesInicio/ContactoInicio'
import FreelancersInicio from '../components/SeccionesInicio/FreelancersInicio'
import HeaderInicio from '../components/SeccionesInicio/HeaderInicio'
import ServiciosInicio from '../components/SeccionesInicio/ServiciosInicio'

const Inicio = () => {
  return (
    <div className='bg-gray-800'>
      <HeaderInicio />
      <ServiciosInicio />
      <FreelancersInicio />
      <ComoFuncionaInicio />
      <ContactoInicio />
    </div>
  )
}

export default Inicio
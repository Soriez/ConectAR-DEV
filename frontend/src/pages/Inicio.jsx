
import ComoFuncionaInicio from '../components/SeccionesInicio/ComoFuncionaInicio'
import ContactoInicio from '../components/SeccionesInicio/ContactoInicio'
import FreelancersInicio from '../components/SeccionesInicio/FreelancersInicio'
import HeaderInicio from '../components/SeccionesInicio/HeaderInicio'
import ServiciosInicio from '../components/SeccionesInicio/ServiciosInicio'

const Inicio = () => {
  return (
    <div className='bg-gray-800'>
      {/* Sección del Hero/Header - sin ID porque no necesitamos hacer scroll aquí */}
      <HeaderInicio />
      {/* 
        Envolvemos ServiciosInicio en un div con ID
        Este ID coincide con el scrollTo: "servicios" del navbar
        Cuando se haga click en "Servicios", el scroll irá aquí
      */}
      <div id='servicios'>
        <ServiciosInicio />
      </div>
      {/* Sección de Freelancers - sin ID por ahora */}
      <FreelancersInicio />
      {/* 
        Envolvemos ComoFuncionaInicio en un div con ID
        Este ID coincide con el scrollTo: "como-funciona" del navbar
        Cuando se haga click en "Como Funciona", el scroll irá aquí
      */}
      <div id='como-funciona'>
        <ComoFuncionaInicio />
      </div>
      <ContactoInicio />
    </div>
  )
}

export default Inicio
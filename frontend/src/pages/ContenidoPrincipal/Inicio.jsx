
import ContactoInicio from '../../components/SeccionesInicio/ContactoInicio'
import FreelancersInicio from '../../components/SeccionesInicio/FreelancersInicio'
import HeaderInicio from '../../components/SeccionesInicio/HeaderInicio'
import ServiciosInicio from '../../components/SeccionesInicio/ServiciosInicio'

const Inicio = () => {
  return (
    // Opcion gradiente completo
    <div className='bg-white min-h-screen flex flex-col'>
      {/* Header ocupa la parte superior (Hero) */}
        <HeaderInicio />
      <main>
        <ServiciosInicio />
        <FreelancersInicio />
        <ContactoInicio />
      </main>
    </div>
  )
}

export default Inicio
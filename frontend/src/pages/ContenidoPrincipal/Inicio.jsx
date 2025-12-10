
import ContactoInicio from '../../components/SeccionesInicio/ContactoInicio'
import FreelancersInicio from '../../components/SeccionesInicio/FreelancersInicio'
import HeaderInicio from '../../components/SeccionesInicio/HeaderInicio'
import ServiciosInicio from '../../components/SeccionesInicio/ServiciosInicio'

import { useEffect } from 'react';
import axios from 'axios';

const Inicio = () => {

  // Tracking de Visitas (Se ejecuta al entrar al Inicio)
  useEffect(() => {
    const track = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
        if (BASE_URL) await axios.post(`${BASE_URL}/api/dashboard/stats/site-visit`);
      } catch (e) { console.error(e); }
    };
    track();
  }, []);
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
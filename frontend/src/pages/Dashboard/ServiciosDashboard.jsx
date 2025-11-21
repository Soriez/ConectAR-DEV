import React, { useState, useEffect } from 'react';
import ServiceCard from '../../components/Dashboard/ServiceCard';

const ServiciosDashboard = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      setServices([
        { id: 1, name: 'Hosting Pro', desc: 'Servidor dedicado.', price: '$29/mes' },
        { id: 2, name: 'Base de Datos', desc: 'PostgreSQL Cloud.', price: '$15/mes' },
      ]);
    }, 500);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mis Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(s => <ServiceCard key={s.id} service={s} />)}
      </div>
    </div>
  );
};
export default ServiciosDashboard;
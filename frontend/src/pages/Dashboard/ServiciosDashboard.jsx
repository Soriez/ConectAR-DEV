import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ServiciosDashboard = () => {
  const { user: authUser, isAuthenticated, BASE_URL, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({
    tipoServicio: '',
    descripcion: '',
    precio: ''
  });

  // Fetch profile, services and service types
  useEffect(() => {
    if (!isAuthenticated || !authUser || !authUser._id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Obtener perfil del usuario
        const userRes = await axios.get(`${BASE_URL}/api/users/${authUser._id}`);
        setProfile(userRes.data);

        // Si es freelancer, cargar sus servicios y los tipos disponibles
        if (userRes.data.isFreelancer) {
          const servicesRes = await axios.get(`${BASE_URL}/api/services/freelancer/${authUser._id}`);
          setServices(servicesRes.data);

          const typesRes = await axios.get(`${BASE_URL}/api/services/types`);
          setServiceTypes(typesRes.data);
        }
      } catch (err) {
        console.error('Error al cargar servicios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, authUser, BASE_URL]);

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.tipoServicio || !newService.descripcion || newService.precio === '') {
      alert('Completa todos los campos');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post(`${BASE_URL}/api/services`, newService, config);

      // Recargar la página como solicitó el usuario
      window.location.reload();

    } catch (err) {
      console.error('Error al crear el servicio:', err.response?.data || err);
      alert(err.response?.data?.message || 'Error al crear el servicio');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`${BASE_URL}/api/services/${serviceId}`, config);
      setServices(services.filter(s => s._id !== serviceId));
      alert('Servicio eliminado');
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
      alert('Error al eliminar el servicio');
    }
  };

  if (loading) {
    return <div className="p-8">Cargando servicios...</div>;
  }

  // Si el usuario no es freelancer, mostrar mensaje informativo
  if (!profile || !profile.isFreelancer) {
    return (
      <div className="p-8 text-center">
        <Briefcase className="mx-auto mb-4 text-slate-400" size={64} />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Sección solo para Freelancers</h2>
        <p className="text-slate-500">Debes ser freelancer para gestionar servicios</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mis Servicios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar Servicio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-slate-800">
                {service.tipoServicio?.nombre || 'Servicio'}
              </h3>
              <button
                onClick={() => handleDeleteService(service._id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <p className="text-slate-600 text-sm mb-4">{service.descripcion}</p>
            <p className="text-blue-600 font-bold text-xl">${service.precio}</p>
          </div>
        ))}

        {/* Card para agregar servicio */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center min-h-[200px] group"
        >
          <Plus className="text-slate-400 group-hover:text-blue-600 transition mb-2" size={48} />
          <p className="text-slate-500 group-hover:text-blue-600 font-medium transition">Agregar Servicio</p>
        </button>
      </div>

      {/* Modal para agregar servicio */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Agregar Nuevo Servicio</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Servicio</label>
                <select
                  required
                  value={newService.tipoServicio}
                  onChange={e => setNewService({ ...newService, tipoServicio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un tipo</option>
                  {serviceTypes.map(type => (
                    <option key={type._id} value={type._id}>{type.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  required
                  value={newService.descripcion}
                  onChange={e => setNewService({ ...newService, descripcion: e.target.value })}
                  placeholder="Describe tu servicio..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newService.precio}
                  onChange={e => setNewService({ ...newService, precio: e.target.value })}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiciosDashboard;
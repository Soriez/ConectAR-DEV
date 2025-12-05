import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, Briefcase, X, DollarSign, FileText , Edit} from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ServiciosDashboard = () => {
  const { user: authUser, isAuthenticated, BASE_URL, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);

  const [formData, setFormData] = useState({
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
        if (userRes.data.role === 'freelancer') {
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

  // Abrir modal para CREAR
  const handleOpenCreate = () => {
    setFormData({ tipoServicio: '', descripcion: '', precio: '' });
    setIsEditing(false);
    setCurrentServiceId(null);
    setShowModal(true);
  };

  // Abrir modal para EDITAR
  const handleOpenEdit = (service) => {
    setFormData({
      tipoServicio: service.tipoServicio._id, // ID para el select (aunque esté deshabilitado)
      descripcion: service.descripcionPersonalizada,
      precio: service.precio
    });
    // Guardamos el nombre del tipo para mostrarlo visualmente si deshabilitamos el select
    setIsEditing(true);
    setCurrentServiceId(service._id);
    setShowModal(true);
  };

  // Enviar formulario (Crear o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.precio || !formData.descripcion) {
      alert('Completa todos los campos');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (isEditing) {
        // --- LOGICA PUT ---
        // Enviamos 'descripcionPersonalizada' porque así lo espera el backend en el updateService
        const updateData = {
            precio: formData.precio,
            descripcionPersonalizada: formData.descripcion
        };

        const res = await axios.put(`${BASE_URL}/api/services/${currentServiceId}`, updateData, config);
        
        // Actualizar estado local
        setServices(services.map(s => s._id === currentServiceId ? res.data.servicio : s));
        alert('Servicio actualizado correctamente');

      } else {
        // --- LOGICA POST ---
        if (!formData.tipoServicio) return alert("Selecciona un tipo de servicio");
        
        const res = await axios.post(`${BASE_URL}/api/services`, formData, config);
        
        // El backend devuelve { message, servicio: ... } pero necesitamos popular el tipoServicio para mostrarlo bien sin recargar
        // Truco: Buscamos el objeto tipoServicio completo de nuestra lista local 'serviceTypes'
        const fullType = serviceTypes.find(t => t._id === formData.tipoServicio);
        const newServiceWithPopulate = { ...res.data.servicio, tipoServicio: fullType };
        
        setServices([...services, newServiceWithPopulate]);
        alert('Servicio creado correctamente');
      }

      setShowModal(false);

    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.message || 'Ocurrió un error');
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
  if (!profile || profile.role !== 'freelancer') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <Briefcase className="text-slate-400 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-700">Gestión de Servicios</h2>
        <p className="text-slate-500 mt-2">Esta sección es exclusiva para freelancers activos.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Mis Servicios</h1>
            <p className="text-slate-500 text-sm">Administra los servicios que ofreces a tus clientes.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Servicio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Lista de Servicios */}
        {services.map(service => (
          <div key={service._id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            
            {/* Decoración Fondo */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Briefcase size={24} />
                    </div>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => handleOpenEdit(service)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                         >
                             <Edit size={18} />
                         </button>
                         <button 
                            onClick={() => handleDeleteService(service._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar"
                         >
                             <Trash2 size={18} />
                         </button>
                    </div>
                </div>

                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">
                    {service.tipoServicio?.nombre || 'Servicio Desconocido'}
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-3 min-h-[60px]">
                    {service.descripcionPersonalizada}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio Base</span>
                    <span className="text-lg font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                        ${service.precio}
                    </span>
                </div>
            </div>
          </div>
        ))}

        {/* Card para agregar (Si no hay servicios o para rellenar grid) */}
        {services.length === 0 && (
            <button
            onClick={handleOpenCreate}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition duration-300"
            >
            <Plus size={48} className="mb-4 opacity-50" />
            <span className="font-semibold">Agregar tu primer servicio</span>
            </button>
        )}
      </div>

      {/* --- MODAL CREAR / EDITAR --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
            
            <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition"
            >
                <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {isEditing ? <Edit className="text-blue-600"/> : <Plus className="text-blue-600"/>}
                {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Select Tipo Servicio */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Servicio</label>
                <div className="relative">
                    <select
                    required
                    disabled={isEditing} // No permitimos cambiar el tipo al editar para simplificar lógica
                    value={formData.tipoServicio}
                    onChange={e => setFormData({ ...formData, tipoServicio: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${isEditing ? 'bg-slate-100 text-slate-500 border-slate-200' : 'border-slate-300'}`}
                    >
                    <option value="">Selecciona una categoría...</option>
                    {serviceTypes.map(type => (
                        <option key={type._id} value={type._id}>{type.nombre}</option>
                    ))}
                    </select>
                    {!isEditing && <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">▼</div>}
                </div>
                {isEditing && <p className="text-xs text-slate-400 mt-1 ml-1">El tipo de servicio no se puede cambiar.</p>}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 items-center gap-2">
                    <FileText size={16}/> Descripción Personalizada
                </label>
                <textarea
                  required
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe qué incluye este servicio, tu metodología, etc..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Precio */}
              <div>
                <label className=" text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16}/> Precio Base ($)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.precio}
                  onChange={e => setFormData({ ...formData, precio: e.target.value })}
                  placeholder="Ej: 1500"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                  {isEditing ? 'Guardar Cambios' : 'Publicar Servicio'}
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
import { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, Briefcase, X, DollarSign, FileText, Edit } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

const ServiciosDashboard = () => {
  const { user: authUser, isAuthenticated, BASE_URL, token } = useContext(AuthContext);
  const { showErrorModal, showSuccess } = useNotification();

  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal de Creación/Edición
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);

  // Estados para el Modal de Confirmación de Borrado
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Estados para selección jerárquica de categorías
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [availableServiceTypes, setAvailableServiceTypes] = useState([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [formData, setFormData] = useState({
    tipoServicio: '',
    descripcion: '',
    precio: ''
  });

  // Fetch inicial (Perfil, Servicios existentes, Categorías Principales)
  useEffect(() => {
    if (!isAuthenticated || !authUser || !authUser._id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Obtener perfil
        const userRes = await axios.get(`${BASE_URL}/api/users/${authUser._id}`);
        setProfile(userRes.data);

        if (userRes.data.role === 'freelancer') {
          // 2. Obtener servicios del freelancer
          const servicesRes = await axios.get(`${BASE_URL}/api/servicios/freelancer/${authUser._id}`);
          setServices(servicesRes.data);

          // 3. Obtener Categorías Principales (Nivel 1)
          const catRes = await axios.get(`${BASE_URL}/api/types/categorias-principales`);
          setMainCategories(catRes.data);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, authUser, BASE_URL]);

  // Cargar Sub Categorías cuando cambia la Principal
  useEffect(() => {
    if (selectedMainCategory) {
      const fetchSubcats = async () => {
        try {
          // Usamos param 'principal' según el backend
          const res = await axios.get(`${BASE_URL}/api/types/categorias?principal=${encodeURIComponent(selectedMainCategory)}`);
          setSubCategories(res.data);
        } catch (err) {
          console.error("Error fetching subcategories:", err);
        }
      };
      fetchSubcats();
    } else {
      setSubCategories([]);
    }
  }, [selectedMainCategory, BASE_URL]);

  // Cargar Servicios (Tipos) cuando cambia la Sub Categoría
  useEffect(() => {
    if (selectedSubCategory) {
      const fetchTypes = async () => {
        try {
          // Usamos param 'categoria' según el backend
          const res = await axios.get(`${BASE_URL}/api/types/nombres?categoria=${encodeURIComponent(selectedSubCategory)}`);
          setAvailableServiceTypes(res.data);
        } catch (err) {
          console.error("Error fetching service types:", err);
        }
      };
      fetchTypes();
    } else {
      setAvailableServiceTypes([]);
    }
  }, [selectedSubCategory, BASE_URL]);


  // Abrir modal para CREAR
  const handleOpenCreate = () => {
    setFormData({ tipoServicio: '', descripcion: '', precio: '' });
    setSelectedMainCategory('');
    setSelectedSubCategory('');
    setIsEditing(false);
    setCurrentServiceId(null);
    setShowModal(true);
  };

  // Abrir modal para EDITAR
  const handleOpenEdit = async (service) => {
    setIsEditing(true);
    setCurrentServiceId(service._id);

    // Pre-llenar datos básicos
    setFormData({
      tipoServicio: service.tipoServicio?._id || '',
      descripcion: service.descripcionPersonalizada,
      precio: service.precio
    });

    // Pre-llenar selectores fetch manual
    const typeObj = service.tipoServicio;
    if (typeObj) {
      try {
        // 1. Setear Main Category 
        setSelectedMainCategory(typeObj.categoria_principal);

        // Fetch Subcategorias de esta principal
        const subRes = await axios.get(`${BASE_URL}/api/types/categorias?principal=${encodeURIComponent(typeObj.categoria_principal)}`);
        setSubCategories(subRes.data);
        setSelectedSubCategory(typeObj.categoria);

        // Fetch Nombres de esta subcategoria
        const nameRes = await axios.get(`${BASE_URL}/api/types/nombres?categoria=${encodeURIComponent(typeObj.categoria)}`);
        setAvailableServiceTypes(nameRes.data);

      } catch (err) {
        console.error("Error pre-filling edit modal:", err);
      }
    }

    setShowModal(true);
  };

  // Enviar formulario (Crear o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.precio || !formData.descripcion) {
      showErrorModal('Completa todos los campos');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditing) {
        // --- LOGICA PUT ---
        const updateData = {
          precio: formData.precio,
          descripcionPersonalizada: formData.descripcion
        };

        const res = await axios.put(`${BASE_URL}/api/servicios/${currentServiceId}`, updateData, config);

        // Actualizar estado local
        setServices(services.map(s => s._id === currentServiceId ? res.data.servicio : s));
        showSuccess('Servicio actualizado correctamente');

      } else {
        // --- LOGICA POST ---
        if (!formData.tipoServicio) return showErrorModal('Selecciona un tipo de servicio completo');

        const res = await axios.post(`${BASE_URL}/api/servicios`, formData, config);

        // Recuperar objeto completo del tipo seleccionado para mostrarlo en la UI sin refetch
        const fullType = availableServiceTypes.find(t => t._id === formData.tipoServicio);
        const newServiceWithPopulate = { ...res.data.servicio, tipoServicio: fullType };

        setServices([...services, newServiceWithPopulate]);
        showSuccess('Servicio creado correctamente');
      }

      setShowModal(false);

    } catch (err) {
      showErrorModal(err.response?.data?.message || 'Ocurrió un error');
    }
  };

  // 1. Iniciar Flujo de Borrado
  const handleDeleteClick = (serviceId) => {
    setServiceToDelete(serviceId);
    setShowDeleteModal(true);
  };

  // 2. Confirmar Borrado
  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`${BASE_URL}/api/servicios/${serviceToDelete}`, config);
      setServices(services.filter(s => s._id !== serviceToDelete));
      showSuccess('Servicio eliminado correctamente');
    } catch (err) {
      showErrorModal('Error al eliminar el servicio');
    } finally {
      setShowDeleteModal(false);
      setServiceToDelete(null);
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
    <div className="animate-fade-in-up relative">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteService}
        title="¿Eliminar Servicio?"
        message="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este servicio de tu perfil?"
        confirmText="Eliminar"
      />

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
        {services.length > 0 && services.map(service => (
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
                    onClick={() => handleDeleteClick(service._id)} // Cambiado a handleDeleteClick
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {service.tipoServicio?.categoria_principal || 'Sin Categ.'}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">
                {service.tipoServicio?.nombre || 'Servicio Desconocido'}
              </h3>

              <p className="text-slate-500 text-sm mb-6 line-clamp-3 min-h-[60px]">
                {service.descripcionPersonalizada}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Precio Base</span>
                <span className="text-lg font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  ${service.precio}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Card para agregar (Si no hay servicios) */}
        {services.length === 0 && (
          <button
            onClick={handleOpenCreate}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition duration-300 w-full"
          >
            <Plus size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">No tienes servicios activos</h3>
            <span className="font-medium">Agregar tu primer servicio</span>
          </button>
        )}
      </div>

      {/* --- MODAL CREAR / EDITAR --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              {isEditing ? <Edit className="text-blue-600" /> : <Plus className="text-blue-600" />}
              {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Categoría Principal */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Categoría Principal</label>
                <div className="relative">
                  <select
                    disabled={isEditing}
                    value={selectedMainCategory}
                    onChange={e => {
                      setSelectedMainCategory(e.target.value);
                      setSelectedSubCategory('');
                      setFormData({ ...formData, tipoServicio: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${isEditing ? 'bg-slate-100 text-slate-500' : 'border-slate-300'}`}
                  >
                    <option value="">Selecciona principal...</option>
                    {mainCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {!isEditing && <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">▼</div>}
                </div>
              </div>

              {/* Sub Categoría */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Categoría Específica</label>
                <div className="relative">
                  <select
                    disabled={isEditing || !selectedMainCategory}
                    value={selectedSubCategory}
                    onChange={e => {
                      setSelectedSubCategory(e.target.value);
                      setFormData({ ...formData, tipoServicio: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${isEditing || !selectedMainCategory ? 'bg-slate-100 text-slate-500' : 'border-slate-300'}`}
                  >
                    <option value="">Selecciona sub-categoría...</option>
                    {subCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {!isEditing && <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">▼</div>}
                </div>
              </div>

              {/* Nombre del Servicio (El ID final) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Servicio</label>
                <div className="relative">
                  <select
                    required
                    disabled={isEditing || !selectedSubCategory}
                    value={formData.tipoServicio}
                    onChange={e => setFormData({ ...formData, tipoServicio: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${isEditing || !selectedSubCategory ? 'bg-slate-100 text-slate-500' : 'border-slate-300'}`}
                  >
                    <option value="">Selecciona el servicio...</option>
                    {availableServiceTypes.map(type => (
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
                  <FileText size={16} /> Descripción Personalizada
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
                  <DollarSign size={16} /> Precio Base ($)
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
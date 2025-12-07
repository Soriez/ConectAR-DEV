import React, { useState, useEffect, useContext } from 'react';
import { Star, MessageSquare, Trash2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const renderStars = (rating) => {
  return [...Array(5)].map((_, index) => (
    <Star
      key={index}
      size={16}
      className={`${index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
    />
  ));
};

const OpinionesDashboard = () => {
  const { user: authUser, isAuthenticated, BASE_URL } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [opinionesRecibidas, setOpinionesRecibidas] = useState([]);
  const [opinionesRealizadas, setOpinionesRealizadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('realizadas');

  // Estado para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [opinionToDelete, setOpinionToDelete] = useState(null);

  const handleDeleteClick = (opinion) => {
    setOpinionToDelete(opinion);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!opinionToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/opinions/${opinionToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Actualizar el estado local eliminando la opinión
      setOpinionesRealizadas(prev => prev.filter(op => op._id !== opinionToDelete._id));

      // Cerrar modal
      setShowDeleteModal(false);
      setOpinionToDelete(null);
    } catch (error) {
      console.error("Error al eliminar opinión:", error);
      alert("Error al eliminar la opinión");
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !authUser || !authUser._id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${BASE_URL}/api/users/${authUser._id}`);
        setProfile(userRes.data);
        // Cargar opiniones realizadas (para todos)
        const realizadasRes = await axios.get(`${BASE_URL}/api/opinions/realizadas/${authUser._id}`);
        setOpinionesRealizadas(realizadasRes.data);

        // Cargar opiniones recibidas (solo si es freelancer)
        if (userRes.data.role === 'freelancer') {
          const recibidasRes = await axios.get(`${BASE_URL}/api/opinions/recibidas/${authUser._id}`);
          setOpinionesRecibidas(recibidasRes.data);
          // Si es freelancer, por defecto mostramos las recibidas primero (opcional)
          setActiveTab('recibidas');
        }
      } catch (err) {
        console.error('Error al cargar opiniones:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, authUser, BASE_URL]);

  if (loading) {
    return <div className="p-8">Cargando opiniones...</div>;
  }

  if (!profile) {
    return <div className="p-8">No se encontró información del usuario.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Opiniones</h1>

      {profile.role === 'freelancer' && (
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('recibidas')}
            className={`pb-3 px-4 font-medium transition ${activeTab === 'recibidas'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Recibidas ({opinionesRecibidas.length})
          </button>
          <button
            onClick={() => setActiveTab('realizadas')}
            className={`pb-3 px-4 font-medium transition ${activeTab === 'realizadas'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Realizadas ({opinionesRealizadas.length})
          </button>
        </div>
      )}

      {profile.role === 'freelancer' && activeTab === 'recibidas' && (
        <div className="space-y-4">
          {opinionesRecibidas.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto mb-4 text-slate-300" size={64} />
              <p className="text-slate-500">Aún no has recibido opiniones</p>
            </div>
          ) : (
            opinionesRecibidas.map((opinion) => (
              <div key={opinion._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {opinion.autor?.nombre} {opinion.autor?.apellido}
                    </h3>
                    <div className="flex gap-1 mt-1">{renderStars(opinion.puntuacion)}</div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(opinion.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600">{opinion.opinion}</p>
              </div>
            ))
          )}
        </div>
      )}

      {(profile.role !== 'freelancer' || activeTab === 'realizadas') && (
        <div className="space-y-4">
          {opinionesRealizadas.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto mb-4 text-slate-300" size={64} />
              <p className="text-slate-500">No has realizado opiniones aún</p>
            </div>
          ) : (
            opinionesRealizadas.map((opinion) => (
              <div key={opinion._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Para: {opinion.destinatario?.nombre} {opinion.destinatario?.apellido}
                    </h3>
                    <div className="flex gap-1 mt-1">{renderStars(opinion.puntuacion)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-slate-400">
                      {new Date(opinion.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteClick(opinion)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar opinión"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-600">{opinion.opinion}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar opinión?</h3>
              <p className="text-gray-600 mb-6">
                Esta acción no se puede deshacer. La opinión desaparecerá permanentemente del perfil del freelancer.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Eliminar de todos modos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpinionesDashboard;
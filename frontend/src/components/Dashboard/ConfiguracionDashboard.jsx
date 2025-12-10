import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Mail, Lock, Linkedin, Briefcase, Link as LinkIcon, Crown, Trash2, Clock } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext'; // Importar contexto
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';

//import de modales
import PortfolioModal from '../Modals/ModalsConfiguracion/PortfolioModal';
import LinkedinModal from '../Modals/ModalsConfiguracion/LinkedinModal';
import ConfirmationModal from '../Modals/ConfirmationModal';

const ConfiguracionDashboard = () => {
  const { user, setUser, BASE_URL, token, logout } = useContext(AuthContext); // Datos reales
  const { showErrorModal, showSuccess } = useNotification();
  const navigate = useNavigate();

  // --- ESTADOS PARA MODALES ---
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelRequestModal, setShowCancelRequestModal] = useState(false);

  // Helpers
  const isFreelancer = user?.role === 'freelancer';
  const isPremium = user?.plan === 'premium';

  // --- LÓGICA DE NEGOCIO (HANDLERS) ---

  // 1. Guardar Portfolio
  const handleSavePortfolio = async (newUrl) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/users/${user._id}`, { portfolio: newUrl });

      // 🛡️ FIX DE ROBUSTEZ:
      // Verificamos si el usuario viene directo en response.data o dentro de una propiedad .user
      // (Dependiendo de cómo esté programado tu user.controller.js)
      const updatedUser = response.data.user ? response.data.user : response.data;

      // Actualizamos el contexto solo con el objeto de usuario limpio
      setUser(updatedUser);

      showSuccess("Portfolio actualizado correctamente.");

    } catch (error) {
      showErrorModal("Error al guardar el portfolio.");
    }
  };

  // 2. Hacerse Premium
  const handleUpgradePremium = () => {
    navigate('/hacerse-premium');
  };

  // 3. Eliminar Cuenta
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Logout y redirigir
      logout();
      navigate('/');
    } catch (error) {
      console.error(error);
      showErrorModal('Error al eliminar la cuenta. Inténtalo de nuevo.');
    }
  };

  // 4. Cancelar Solicitud de Freelancer
  const handleCancelRequest = async () => {
    try {
      const { data } = await axios.put(`${BASE_URL}/api/users/cancelar-solicitud/${user._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Asegurar que usamos el objeto de usuario correcto
      const updatedUser = data.user || data;
      setUser(updatedUser);
      showSuccess("Solicitud cancelada correctamente");
      setShowCancelRequestModal(false);
    } catch (error) {
      console.error(error);
      showErrorModal("Error al cancelar la solicitud");
    }
  };

  // Componente de Item de Configuración
  const ConfigItem = ({ title, subtitle, actionLabel, icon, onClick, toggle, isDestructive }) => (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${isDestructive ? 'hover:bg-red-50' : 'hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-4">
        {icon && <div className={isDestructive ? "text-red-500" : "text-slate-400"}>{icon}</div>}
        <div>
          <h4 className={`text-sm font-semibold ${isDestructive ? 'text-red-600' : 'text-slate-800'}`}>{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actionLabel && <span className="text-xs font-medium text-slate-500">{actionLabel}</span>}
        <ChevronRight size={16} className={isDestructive ? "text-red-300" : "text-slate-400"} />
      </div>
    </div>
  );

  if (!user) return <div>Cargando ajustes...</div>;

  return (
    <div className="relative animate-fade-in-up">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Ajustes</h1>

      {/*1- SECCIÓN GENERAL */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">General</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ConfigItem
            title="Dirección de correo electrónico"
            actionLabel={user.email} // Muestra el email real
            icon={<Mail size={18} />}
            onClick={() => navigate('/cambiar-email')}
          />
          <ConfigItem
            title="Cambiar contraseña"
            actionLabel="*********"
            icon={<Lock size={18} />}
            onClick={() => navigate('/cambiar-password')}
          />
        </div>
      </div>
      {/* 2. SECCIÓN FREELANCER (Solo si YA es freelancer) */}
      {isFreelancer && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Perfil Profesional</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

            <ConfigItem
              title="LinkedIn"
              subtitle={user.linkedin ? "Cuenta conectada" : "Conecta tu perfil profesional"}
              icon={<Linkedin size={18} />}
              actionLabel={user.linkedin ? "Editar" : "Conectar"}
              onClick={() => setShowLinkedinModal(true)}
            />

            <ConfigItem
              title="Portfolio"
              subtitle={user.portfolio ? "Portfolio enlazado" : "Muestra tu trabajo"}
              icon={<LinkIcon size={18} />}
              actionLabel={user.portfolio ? "Editar" : "Agregar"}
              onClick={() => setShowPortfolioModal(true)}
            />
          </div>
        </div>
      )}

      {/* 3. SECCIÓN SUSCRIPCIÓN (Solo Freelancers NO Premium) */}
      {isFreelancer && !isPremium && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Membresía</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div onClick={handleUpgradePremium} className="p-4 bg-linear-to-r from-orange-50 to-white flex justify-between items-center cursor-pointer hover:bg-orange-100 transition">
              <div className="flex gap-4 items-center">
                <div className="text-orange-500"><Crown size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Hacerse Premium</h4>
                  <p className="text-xs text-slate-500">Destaca tu perfil y accede a métricas.</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
          </div>
        </div>
      )}
      {/* 4. SECCIÓN CUENTAS CONECTADAS (Opcional/Para todos) */}
      {!isFreelancer && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Integraciones</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <ConfigItem
              title="LinkedIn"
              subtitle={user.linkedin ? "Cuenta vinculada" : "No conectado"}
              icon={<Linkedin size={18} />}
              actionLabel={user.linkedin ? "Desconectar" : "Conectar"}
              onClick={() => setShowLinkedinModal(true)}
            />
          </div>
        </div>
      )}
      {/* 5. SECCIÓN OPORTUNIDADES (Si NO es freelancer) */}
      {!isFreelancer && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Oportunidades</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {user.role === 'pendiente' ? (
              <ConfigItem
                title="Convertirse en Freelancer"
                subtitle="Solicitud Pendiente de Revisión"
                icon={<Clock size={18} className="text-orange-500" />}
                actionLabel="Cancelar Petición"
                isDestructive={true}
                onClick={() => setShowCancelRequestModal(true)}
              />
            ) : (
              <ConfigItem
                title="Convertirse en Freelancer"
                subtitle="Empieza a vender tus servicios hoy"
                icon={<Briefcase size={18} />}
                actionLabel="Empezar"
                onClick={() => setShowLinkedinModal(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* 6. ZONA DE PELIGRO */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 ml-1">Zona de Peligro</h3>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
          <ConfigItem
            title="Eliminar cuenta"
            subtitle="Esta acción es permanente y no se puede deshacer"
            icon={<Trash2 size={18} />}
            isDestructive={true}
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {/* --- MODALES  --- */}

      <PortfolioModal
        show={showPortfolioModal}
        onClose={() => setShowPortfolioModal(false)}
        currentPortfolio={user.portfolio}
        onSave={handleSavePortfolio}
      />

      <LinkedinModal
        show={showLinkedinModal}
        onClose={() => setShowLinkedinModal(false)}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="¿Eliminar cuenta permanentemente?"
        message="Estás a punto de eliminar tu cuenta. Todos tus datos, servicios y configuraciones se perderán de forma permanente y no podrán recuperarse. Sin embargo, siempre serás bienvenido si decides registrarte nuevamente en el futuro."
        confirmText="Sí, eliminar mi cuenta"
        cancelText="Cancelar"
      />

      <ConfirmationModal
        isOpen={showCancelRequestModal}
        onClose={() => setShowCancelRequestModal(false)}
        onConfirm={handleCancelRequest}
        title="¿Cancelar solicitud de Freelancer?"
        message="Si cancelas la solicitud, tu perfil volverá a ser de cliente y se borrarán los datos de freelancer ingresados. Podrás volver a enviar la solicitud cuando quieras."
        confirmText="Sí, cancelar solicitud"
        cancelText="No, mantener"
      />

    </div>
  );
};

export default ConfiguracionDashboard;
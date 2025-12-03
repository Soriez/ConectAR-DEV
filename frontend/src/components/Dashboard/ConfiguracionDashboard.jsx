import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Mail, Lock, Linkedin, Globe, X, Briefcase, Link as LinkIcon, Crown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext'; // Importar contexto
import axios from 'axios';

//import de modales
import PortfolioModal from '../Modals/ModalsConfiguracion/PortfolioModal';
import LinkedinModal from '../Modals/ModalsConfiguracion/LinkedinModal';

const ConfiguracionDashboard = () => {
  const { user, setUser, BASE_URL, token } = useContext(AuthContext); // Datos reales
  const navigate = useNavigate();

  // --- ESTADOS PARA MODALES ---
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

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

      alert("Portfolio actualizado correctamente.");

    } catch (error) {
      console.error("Error al guardar portfolio", error);
      alert("Error al guardar el portfolio.");
    }
  };

  // 2. Hacerse Premium
  const handleUpgradePremium = () => {
    navigate('/hacerse-premium');
  };

  // Componente de Item de Configuración
  const ConfigItem = ({ title, subtitle, actionLabel, icon, onClick, toggle }) => (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
    >
      <div className="flex items-center gap-4">
        {icon && <div className="text-slate-400">{icon}</div>}
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actionLabel && <span className="text-xs font-medium text-slate-500">{actionLabel}</span>}
        <ChevronRight size={16} className="text-slate-400" />
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
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Integraciones</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Si no es freelancer, mostramos LinkedIn aquí como integración social */}
          {!isFreelancer && (
            <ConfigItem
              title="LinkedIn"
              subtitle={user.linkedin ? "Cuenta vinculada" : "No conectado"}
              icon={<Linkedin size={18} />}
              actionLabel={user.linkedin ? "Desconectar" : "Conectar"}
              onClick={() => setShowLinkedinModal(true)}
            />
          )}
        </div>
      </div>
      {/* 5. SECCIÓN OPORTUNIDADES (Si NO es freelancer) */}
      {!isFreelancer && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Oportunidades</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <ConfigItem
              title="Convertirse en Freelancer"
              subtitle="Empieza a vender tus servicios hoy"
              icon={<Briefcase size={18} />}
              actionLabel="Empezar"
              onClick={() => setShowLinkedinModal(true)}
            />
          </div>
        </div>
      )}
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
        isConnected={!!user.linkedin}
        baseUrl={BASE_URL}
        token={token}
      />

    </div>
  );
};

export default ConfiguracionDashboard;
import React, { useState, useContext } from 'react';
import { ChevronRight, Mail, Lock, Linkedin, Globe, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext'; // Importar contexto

const ConfiguracionDashboard = () => {
  const { user } = useContext(AuthContext); // Datos reales

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);

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

      {/* SECCIÓN GENERAL */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">General</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ConfigItem
            title="Dirección de correo electrónico"
            actionLabel={user.email} // Muestra el email real
            onClick={() => setShowEmailModal(true)}
          />
          <ConfigItem
            title="Cambiar contraseña"
            actionLabel="*********"
            onClick={() => setShowPasswordModal(true)}
          />
        </div>
      </div>

      {/* SECCIÓN CONEXIONES */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Cuentas Conectadas</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ConfigItem
            title="Google"
            subtitle="Inicio de sesión social"
            icon={<Globe size={18} />}
            actionLabel="Configurar"
            onClick={() => setShowGoogleModal(true)}
          />
          <ConfigItem
            title="LinkedIn"
            // Lógica: Si hay url de linkedin en la BD, está conectado
            subtitle={user.linkedin ? "Cuenta vinculada" : "No conectado"}
            icon={<Linkedin size={18} />}
            actionLabel={user.linkedin ? "Desconectar" : "Conectar"}
            onClick={() => setShowLinkedinModal(true)}
          />
        </div>
      </div>

      {/* SECCIÓN PREMIUM (Solo si NO es premium aún) */}
      {user.plan !== 'premium' && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Suscripción</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-linear-to-r from-orange-100 to-orange-50 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-orange-800">Hazte Premium</h4>
                <p className="text-xs text-orange-600 mt-1">Desbloquea funciones exclusivas.</p>
              </div>
              <a href="/hacerse-premium">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition">
                  Ver Planes
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALES (Se mantienen igual, solo lógica visual por ahora) --- */}
      {/* --- MODAL CAMBIAR CONTRASEÑA --- */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEmailModal(false)}></div>
          <div className="bg-[#1e293b] text-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Cambiar correo electrónico</h2>
              <button onClick={() => setShowEmailModal(false)}><X size={20} /></button>
            </div>
            <p className="text-slate-300 text-sm mb-6">¿Estas seguro que deseas cambiar tu email? Tu email actual es: <span className="text-white font-bold">{user.email}</span></p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-full text-sm">Cancelar</button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm">Continuar</button>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL CAMBIAR CONTRASEÑA --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Oscuro */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>

          {/* Contenido Modal */}
          <div className="bg-[#1e293b] text-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-700 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Cambia tu contraseña</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-slate-700 rounded-full transition"><X size={20} /></button>
            </div>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Para cambiar tu contraseña, antes necesitarás confirmar tu contraseña actual. Te acompañaremos a lo largo del proceso.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-full text-slate-300 font-bold hover:bg-slate-700 transition text-sm"
              >
                Cancelar
              </button>
              <button className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/50 transition text-sm">
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL CONECTAR GOOGLE  --- */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Oscuro */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowGoogleModal(false)}></div>

          {/* Contenido Modal */}
          <div className="bg-[#1e293b] text-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-700 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Conecta tu cuenta de google</h2>
              <button onClick={() => setShowGoogleModal(false)} className="p-1 hover:bg-slate-700 rounded-full transition"><X size={20} /></button>
            </div>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Estas a punto de vincular tu cuenta de Google. Te acompañaremos a lo largo del proceso.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowGoogleModal(false)}
                className="px-4 py-2 rounded-full text-slate-300 font-bold hover:bg-slate-700 transition text-sm"
              >
                Cancelar
              </button>
              <button className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/50 transition text-sm">
                Vincular
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL CONECTAR LINKEDIN --- */}
      {showLinkedinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Oscuro */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLinkedinModal(false)}></div>

          {/* Contenido Modal */}
          <div className="bg-[#1e293b] text-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-700 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Conectar tu cuenta de LinkedIn</h2>
              <button onClick={() => setShowLinkedinModal(false)} className="p-1 hover:bg-slate-700 rounded-full transition"><X size={20} /></button>
            </div>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Estas a punto de vincular tu cuenta de LinkedIn. Te acompañaremos a lo largo del proceso.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLinkedinModal(false)}
                className="px-4 py-2 rounded-full text-slate-300 font-bold hover:bg-slate-700 transition text-sm"
              >
                Cancelar
              </button>
              <button className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/50 transition text-sm">
                Vincular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionDashboard;
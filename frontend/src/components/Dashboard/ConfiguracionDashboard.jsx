import React, { useState } from 'react';
import { ChevronRight, Mail, Lock, Linkedin, Globe, X } from 'lucide-react';
import { faL } from '@fortawesome/free-solid-svg-icons';

const ConfiguracionDashboard = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal,setShowPasswordModal] = useState(false);
  const [showGoogleModal,setShowGoogleModal] = useState(false);
  const [showLinkedinModal,setShowLinkedinModal] = useState(false);

  // Componente de Item de Configuración (Estilo Reddit)
  const ConfigItem = ({ title, subtitle, actionLabel, icon, onClick, toggle }) => (
    <div 
      onClick={onClick} 
      className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
    >
      <div className="flex items-center gap-4">
        {/* Si no hay icono, ocultamos el div */}
        {icon && <div className="text-slate-400">{icon}</div>}
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {actionLabel && <span className="text-xs font-medium text-slate-500">{actionLabel}</span>}
        
        {/* Si es toggle renderizamos el switch, sino la flecha */}
        {toggle !== undefined ? (
           <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${toggle ? 'bg-blue-600' : 'bg-slate-300'}`}>
             <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${toggle ? 'translate-x-5' : 'translate-x-0'}`}></div>
           </div>
        ) : (
           <ChevronRight size={16} className="text-slate-400" />
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Ajustes</h1>

      {/* SECCIÓN GENERAL */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">General</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ConfigItem 
            title="Dirección de correo electrónico" 
            actionLabel="johndon@company.com" 
            onClick={() => setShowEmailModal(true)} // Abre el modal
          />
          <ConfigItem 
            title="Cambiar contraseña"
            actionLabel="*********" 
            onClick={() => setShowPasswordModal(true)} // Abre el modal
          />
        </div>
      </div>

      {/* SECCIÓN CONEXIONES */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Cuentas Conectadas</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ConfigItem 
            title="Google" 
            subtitle="Conectado como John Don" 
            icon={<Globe size={18}/>}
            actionLabel="Desconectar"
            onClick={() => setShowGoogleModal(true)} // Abre el modal

          />
          <ConfigItem 
            title="LinkedIn" 
            subtitle="Conectado como John Don" 
            icon={<Linkedin size={18}/>}
            actionLabel="Desconectar"
            // agregar un switch toggle={false} // Switch apagado
            onClick={() => setShowLinkedinModal(true)} // Abre el modal
          />
        </div>
      </div>

      {/* SECCIÓN PREMIUM */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Suscripción</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-4 bg-linear-to-r from-orange-100 to-orange-50 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-orange-800">Hazte Premium</h4>
                <p className="text-xs text-orange-600 mt-1">Desbloquea funciones exclusivas y mejor visibilidad.</p>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition">
                Ver Planes
              </button>
           </div>
        </div>
      </div>

      {/* --- MODAL CAMBIAR EMAIL --- */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Oscuro */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEmailModal(false)}></div>
          
          {/* Contenido Modal */}
          <div className="bg-[#1e293b] text-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-700 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Cambia tu dirección de correo electrónico</h2>
              <button onClick={() => setShowEmailModal(false)} className="p-1 hover:bg-slate-700 rounded-full transition"><X size={20}/></button>
            </div>
            
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Para cambiar tu dirección de correo electrónico, antes necesitarás confirmar tu contraseña actual. Te acompañaremos a lo largo del proceso.
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowEmailModal(false)} 
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
      {/* --- MODAL CAMBIAR CONTRASEÑA --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Oscuro */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
          
          {/* Contenido Modal */}
          <div className="bg-[#1e293b] text-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-700 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Cambia tu contraseña</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-slate-700 rounded-full transition"><X size={20}/></button>
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
      {/* --- MODAL CAMBIAR CONTRASEÑA --- */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Oscuro */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowGoogleModal(false)}></div>
          
          {/* Contenido Modal */}
          <div className="bg-[#1e293b] text-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-700 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Conecta tu cuenta de google</h2>
              <button onClick={() => setShowGoogleModal(false)} className="p-1 hover:bg-slate-700 rounded-full transition"><X size={20}/></button>
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
      {/* --- MODAL CAMBIAR CONTRASEÑA --- */}
      {showLinkedinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Oscuro */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLinkedinModal(false)}></div>
          
          {/* Contenido Modal */}
          <div className="bg-[#1e293b] text-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-700 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Conectar tu cuenta de LinkedIn</h2>
              <button onClick={() => setShowLinkedinModal(false)} className="p-1 hover:bg-slate-700 rounded-full transition"><X size={20}/></button>
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
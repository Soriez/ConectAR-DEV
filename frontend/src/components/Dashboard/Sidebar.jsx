import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { User, Settings, MessageSquare, LogOut, Layers, Home, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // SIMULACIÓN: Esto vendría de tu contexto de usuario o base de datos
  const userRole = 'client'; // Cambia a 'client' para probar que se oculte "Opiniones"
  const isFreelancer = userRole === 'freelancer';

  const menuItems = [
    { path: '/dashboard', label: 'Perfil', icon: <User size={20} />, end: true },
    { path: '/dashboard/servicios', label: 'Servicios', icon: <Layers size={20} /> },
    { path: '/dashboard/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
    // Condicional: Solo mostramos opiniones si es freelancer
    ...(isFreelancer ? [{ path: '/dashboard/opiniones', label: 'Opiniones', icon: <MessageSquare size={20} /> }] : []),
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      {/* Overlay Móvil */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1e293b] text-white flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Header */}
        <div className="p-6 flex flex-col items-center border-b border-slate-700 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 md:hidden"><X size={24} /></button>
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mb-3 shadow-lg">JD</div>
          <span className="text-lg font-semibold tracking-wide">Mi Panel</span>
          {/* Badge Freelancer en Sidebar (Opcional) */}
          {isFreelancer && <span className="mt-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">Freelancer</span>}
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <NavLink to="/" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Home size={20} /> <span className="font-medium">Volver al Inicio</span>
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut size={20} /> <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
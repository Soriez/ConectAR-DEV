import { NavLink, useNavigate } from 'react-router';
import { User, Settings, MessageSquare, LogOut, Layers, Home, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Perfil', icon: <User size={20} />, end: true },
    { path: '/dashboard/servicios', label: 'Servicios', icon: <Layers size={20} /> },
    { path: '/dashboard/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
    { path: '/dashboard/opiniones', label: 'Opiniones', icon: <MessageSquare size={20} /> },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      {/* OVERLAY (Fondo oscuro) - Solo visible en móvil cuando el menú está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#1e293b] text-white flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
        `}
      >
        {/* Header del Sidebar */}
        <div className="p-6 flex flex-col items-center border-b border-slate-700 relative">
          
          {/* Botón Cerrar (X) - Solo visible en móvil */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white md:hidden"
          >
            <X size={24} />
          </button>

          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mb-3 shadow-lg mt-2 md:mt-0">
            JD
          </div>
          <span className="text-lg font-semibold tracking-wide">Mi Panel</span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose} // Cierra el menú al hacer click en un link (UX móvil)
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

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <NavLink 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
              <Home size={20} />
              <span className="font-medium">Volver al Inicio</span>
          </NavLink>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
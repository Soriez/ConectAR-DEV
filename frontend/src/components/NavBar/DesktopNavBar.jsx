
import { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { User, LayoutDashboard, HelpCircle, LogOut, ChevronDown } from 'lucide-react';

const DesktopNavBar = ({ isLoggedIn, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Cierra el menú si se hace click fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userId = user?.id || user?._id;
  const profileLink = userId ? `/perfil/${userId}` : '/dashboard';

  // Estilos comunes para los items del menú (siguiendo estética mobile)
  const itemClass = "flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all group mx-2 mb-1";
  const iconClass = "text-blue-500 group-hover:text-white transition-colors";

  return (
    <div className="relative" ref={dropdownRef}>
      {isLoggedIn ? (
        <>
          {/* Botón Trigger del Menú */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 focus:outline-none group"
            aria-expanded={isMenuOpen}
          >
            {/* Avatar Circular */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-blue-500/30 group-hover:ring-blue-400 transition-all">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : <User size={20} />}
            </div>

            {/* Nombre y Flecha (Opcional, para mejor UX en desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
              <span className="text-sm font-medium max-w-[100px] truncate">
                {user?.nombre?.split(' ')[0]}
              </span>
              <ChevronDown size={16} className={`transition - transform duration - 200 ${isMenuOpen ? "rotate-180" : ""} `} />
            </div>
          </button>

          {/* Menú Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-100">

              {/* Header del Dropdown */}
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 mb-2">
                <p className="text-sm text-slate-400">Hola, {user?.nombre}!</p>
                <p className="text-white font-semibold truncate hover:text-blue-400 transition-colors cursor-default" title={user?.email}>
                  {user?.email || "Usuario"}
                </p>
              </div>

              {/* Items del Menú */}
              <div className="flex flex-col">

                {/* 1. Mi Perfil (Solo freelancers) */}
                {(user?.role === "freelancer" || user?.isFreelancer) && (
                  <NavLink to={profileLink} onClick={() => setIsMenuOpen(false)} className={itemClass}>
                    <User size={18} className={iconClass} />
                    <span className="font-medium text-sm">Mi Perfil Público</span>
                  </NavLink>
                )}

                {/* 2. Dashboard */}
                <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setIsMenuOpen(false)} className={itemClass}>
                  <LayoutDashboard size={18} className={iconClass} />
                  <span className="font-medium text-sm">{user?.role === 'admin' ? 'Panel de Administrador' : 'Mi Panel de Control'}</span>
                </NavLink>

                {/* 3. Ayuda */}
                <NavLink to="/contacto" onClick={() => setIsMenuOpen(false)} className={itemClass}>
                  <HelpCircle size={18} className={iconClass} />
                  <span className="font-medium text-sm">Ayuda / FAQ</span>
                </NavLink>

                <div className="my-2 border-t border-slate-800 mx-4"></div>

                {/* 4. Cerrar Sesión */}
                <div className="px-2 pb-2">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white py-2.5 rounded-xl transition-all duration-300 font-medium border border-red-500/20 hover:border-transparent text-sm"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>

              </div>
            </div>
          )}
        </>
      ) : (
        // Vista visitante (Botones de login/registro)
        <div className="flex items-center gap-4">
          <NavLink
            to={"/iniciar-sesion"}
            className="text-slate-300 hover:text-white font-medium text-sm transition-colors"
          >
            Iniciar Sesión
          </NavLink>
          <NavLink
            to={"/registrarse"}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
          >
            Registrarse
          </NavLink>
        </div>
      )}
    </div>
  );
};
export default DesktopNavBar;
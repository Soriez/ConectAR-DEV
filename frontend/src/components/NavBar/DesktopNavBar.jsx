import { faUser, faCog, faQuestionCircle, faSignOutAlt, faThLarge, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const DesktopNavBar = ({ isLoggedIn, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/"); // Redirige al home
  };

  // 💡 CLASES CORREGIDAS: Fondo azul claro (bg-blue-300) y hover amarillo (bg-yellow-300)
  const menuLinkClasses =
    "flex items-center gap-3 px-4 py-2 text-base font-medium transition duration-150 ease-in-out mx-3 rounded-md text-white hover:bg-blue-300 hover:text-black";

  // CLAVE: Determinamos el ID de usuario de forma robusta
  const userId = user?.id || user?._id; 
  const profileLink = userId ? `/perfil/${userId}` : '/dashboard';

  return (
    <div>
      {isLoggedIn ? (
        // Vista usuario
        <div className="relative inline-block text-left">
          {/* Botón con inicial o ícono */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-lg transition duration-150 ease-in-out focus:outline-none"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
              {/* Muestra la inicial o el ícono si no hay nombre */}
              {user?.nombre?.charAt(0) || <FontAwesomeIcon icon={faUser} />}
            </div>
          </button>

          {/* Menú Dropdown - POSICIÓN Y COLOR CORREGIDOS */}
          {isMenuOpen && (
            <div
              // Fondo azul claro (bg-blue-300), Centrado
              className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-blue-950 rounded-lg shadow-xl py-2 z-10 text-black"
              style={{ borderTop: "1px solid #a8caff" }} 
            >
              
              {/* 1. Saludo: Fondo Distinto */}
              <div 
                className="px-4 py-3 mb-2 bg-blue-950 rounded-t-lg mx-2"
                style={{ borderBottom: "1px solid #1e3a8a" }} 
              >
                <p className="text-sm font-extrabold text-white truncate">
                    Hola, {user?.nombre || "Usuario"}
                </p>
              </div>

              {/* 2. Mi Perfil - SOLO FREELANCERS */}
              {(user?.role === "freelancer" || user?.isFreelancer) && userId && (
                <NavLink
                  to={profileLink} 
                  onClick={() => setIsMenuOpen(false)}
                  className={menuLinkClasses}
                >
                  <FontAwesomeIcon icon={faIdCard} /> {/* Ícono de Perfil/Tarjeta */}
                  Mi Perfil
                </NavLink>
              )}
              
              {/* 3. Mi Panel de Control */}
              <NavLink
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={menuLinkClasses}
              >
                <FontAwesomeIcon icon={faThLarge} /> {/* Ícono de Panel/Dashboard */}
                Mi Panel de Control
              </NavLink>

              {/* 4. Ayuda/FAQ */}
              <NavLink
                to="/contacto"
                onClick={() => setIsMenuOpen(false)}
                className={menuLinkClasses}
              >
                <FontAwesomeIcon icon={faQuestionCircle} /> {/* Ícono de Ayuda */}
                Ayuda/FAQ
              </NavLink>

              {/* 5. Línea separadora */}
              <div className="my-2 border-t border-gray-200 mx-3"></div>

              {/* 6. Cerrar Sesión */}
              <button
                onClick={handleLogoutClick}
                className={`${menuLinkClasses} w-[90%] text-left font-bold text-red-700 hover:bg-red-100`} // Destacamos Cerrar Sesión
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> {/* Ícono de Salir */}
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      ) : (
        // Vista visitante
        <>
          <NavLink
            to={"/iniciar-sesion"}
            className="whitespace-nowrap hover:text-blue-400 px-3 py-2 m-8 text-base font-medium transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            Iniciar Sesión
          </NavLink>
          <NavLink
            to={"/registrarse"}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-md shadow-lg transition duration-150 ease-in-out whitespace-nowrap focus:ring-2 focus:ring-white"
          >
            Registrarse
          </NavLink>
        </>
      )}
    </div>
  );
};

export default DesktopNavBar;
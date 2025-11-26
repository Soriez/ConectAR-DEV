import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react"
import { NavLink } from "react-router"


const DesktopNavBar = ({ isLoggedIn, user, handleLogout }) => {
    // Para abrir o cerrar el menú hamburguesa
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Función para simular el cierre de sesión
    const handleLogoutClick = () => {
        handleLogout()
        setIsMenuOpen(false)
    };
    // Estilos genéricos para los elementos del menú
    const menuLinkClasses = "block px-4 py-2 text-base font-medium hover:bg-yellow-300 transition duration-150 ease-in-out hover:text-black mx-3 rounded-md";
    return (
        <div>
            {/* Compruebo si tengo que mostrar vista visitante o vista usuario */}
            {isLoggedIn ? (
                // Vista usuario
                <>
                    {/* Boton para ir a las preguntas frecuentes */}
                    <NavLink>

                    </NavLink>
                    {/* Boton para mirar los perfiles guardados */}
                    <NavLink>

                    </NavLink>
                    {/* Boton para abrir un menú hamburguesa */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-lg transition duration-150 ease-in-out focus:outline-none"
                        aria-expanded={isMenuOpen}
                        aria-haspopup="true"
                    >
                        <div className="w-full h-full bg-blue-500 text-white rounded-full flex items-center justify-center">
                            {user?.nombre ? user.nombre[0].toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                        </div>
                    </button>

                    {/* Menú que se desplegará con el boton del menú hamburguesa */}
                    {isMenuOpen && (
                        <div
                            className="absolute right-0 mt-2 w-64 bg-blue-300 rounded-lg shadow-xl py-2 z-10 text-black"
                            // Estilo para simular la separación interna de la imagen
                            style={{ borderTop: '1px solid #e5e7eb' }}
                        >
                            {/* Grupo Superior */}
                            {/* Perfil del usuario - SOLO FREELANCERS */}
                            {(user?.role === 'freelancer') && (
                                <NavLink to={`/perfil/${user.id}`} onClick={() => setIsMenuOpen(false)} className={menuLinkClasses}>
                                    Mi perfil
                                </NavLink>
                            )}
                            {/* Dashboard */}
                            <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} className={menuLinkClasses}>
                                Mi panel de control
                            </NavLink>
                            {/* Preguntas frecuentes */}
                            <NavLink to="/contacto" onClick={() => setIsMenuOpen(false)} className={menuLinkClasses}>
                                Preguntas frecuentes
                            </NavLink>

                            {/* Línea Separadora (simulada) */}
                            <div className="my-2 border-t border-gray-200"></div>

                            {/* Grupo Inferior */}
                            {/* Cerrar sesión */}
                            <button onClick={handleLogoutClick} className={`${menuLinkClasses} w-[90%] text-left`}>
                                Salir de mi cuenta
                            </button>
                        </div>
                    )}
                </>
            ) : (
                // Vista visitante
                <>
                    {/* Boton de inicio de sesión */}
                    <NavLink
                        to={'/iniciar-sesion'}
                        className="whitespace-nowrap hover:text-blue-400 px-3 py-2 text-base font-medium transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 rounded-md"
                    >
                        Iniciar Sesión
                    </NavLink>
                    {/* Boton de registrarse */}
                    <NavLink
                        to={'/registrarse'}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-md shadow-lg transition duration-150 ease-in-out whitespace-nowrap focus:ring-2 focus:ring-white"
                    >
                        Registrarse
                    </NavLink>
                </>

            )}




        </div>
    )
}

export default DesktopNavBar
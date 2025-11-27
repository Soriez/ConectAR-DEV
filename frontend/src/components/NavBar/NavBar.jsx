import { useState } from 'react'
import links from '../../constants/item-nav'
import ItemNavBar from './ItemNavBar'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router'
import DesktopNavBar from './DesktopNavBar'
import { useAuth } from '../../context';

/**
 * @component
 * @description Barra de Navegación principal. Implementa el patrón de menú hamburguesa (mobile) y barra horizontal (desktop).
 * Utiliza el estado 'activa' para controlar la visibilidad del menú móvil y 'sticky' para fijar la navegación.
 * @returns {JSX.Element} El elemento NavBar.
 */
const NavBar = () => {

    const { isAuthenticated, user, logout } = useAuth()

    // Estado para controlar si el menú móvil está abierto o cerrado.
    const [activa, setActiva] = useState(false)


    return (
        // Contenedor principal: Sticky, con z-index alto para flotar sobre el contenido
        <nav className="bg-gray-800 text-white shadow-xl sticky top-0 z-50">

            {/* Contenedor centralizado (Desktop y Mobile Header) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center"> {/* Altura ajustada a h-20 */}

                {/* 1. Logo */}
                <div className="flex items-center space-x-4">
                    <NavLink to={'/'} className="shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm">
                        {/* Logo estilizado y responsivo */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 border border-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                            {/* Ajuste: Usar object-cover para que la imagen se vea bien */}
                            <img src="/public/imgs/logo.jpeg" alt="Logo de conectar dev" className="w-full h-full object-cover" />
                        </div>
                    </NavLink>
                </div>

                {/* 2. Links de Navegación (Solo Desktop - Centrados) */}
                <ul className="hidden md:flex gap-4 lg:gap-8 flex-1 justify-center"> {/* Gap ajustado para mejor espaciado en desktop */}
                    {links.map((link) => (
                        <ItemNavBar link={link} isMobile={false} key={link.id} setActiva={setActiva} />
                    ))}
                </ul>

                {/* 3. Botones de Acción (Solo Desktop - Derecha) */}
                <div className="hidden md:flex items-center space-x-4">
                    <DesktopNavBar
                        isLoggedIn={isAuthenticated}
                        user={user}
                        handleLogout={logout}
                    />
                </div>

                {/* 4. Botón Hamburguesa (Solo Mobile) */}
                <button
                    onClick={() => setActiva(!activa)}
                    className="md:hidden p-2 rounded hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white"
                    aria-expanded={activa}
                    aria-controls="mobile-menu"
                    aria-label={activa ? "Cerrar menú" : "Abrir menú"}
                >
                    {activa ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />} {/* Icono más grande */}
                </button>
            </div>

            {/* Menú Mobile Desplegable - Bloque que se desliza */}
            <div
                id="mobile-menu"
                className={`
                    md:hidden 
                    fixed top-0 left-0 
                    w-full max-w-xs sm:max-w-sm                        /* Ancho limitado para mejor UX en tablets pequeñas */
                    bg-gray-800 
                    transition-transform duration-300 ease-in-out 
                    transform 
                    ${activa ? "translate-x-0" : "-translate-x-full"}  /* Animación de entrada/salida lateral */
                    h-full min-h-screen overflow-y-auto                 /* Ocupa toda la altura y permite scroll */
                    shadow-2xl z-40                                    /* Sombra para que destaque */
                `}
            >
                {/* Cabecera del Menú Mobile (Logo y botón de cerrar) */}
                <div className="bg-gray-900 h-20 flex justify-between items-center px-4 sm:px-6"> {/* Altura alineada con el navbar principal */}
                    <NavLink to={'/'} className="shrink-0">
                        <div className="w-12 h-12 bg-gray-900 border border-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                            <img src="/public/imgs/logo.jpeg" alt="Logo de conectar dev" className="w-full h-full object-cover" />
                        </div>
                    </NavLink>
                    <button
                        onClick={() => setActiva(false)}
                        className="p-2 rounded hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Cerrar menú"
                    >
                        <X size={28} className="text-white" />
                    </button>
                </div>

                {/* Contenido del Menú Mobile (Enlaces y botones) */}
                <ul className="flex flex-col items-start gap-0 py-4">
                    {/* Enlaces de Navegación */}
                    {links.map((link) => (
                        <ItemNavBar
                            link={link}
                            isMobile={true}
                            setOpen={setActiva}
                            key={link.id}
                        />
                    ))}

                    {/* Botones de acción en la versión móvil (Separador visual) */}
                    <li className="w-full text-center mt-4 border-t border-gray-700 pt-4">
                        {isAuthenticated ? (
                            <>
                                {(user?.role === 'freelancer') && (
                                    <NavLink
                                        to="/perfil"
                                        className="block text-xl font-medium text-white hover:text-blue-400 py-3 px-6 text-center"
                                        onClick={() => setActiva(false)}
                                    >
                                        Mi perfil
                                    </NavLink>
                                )}
                                <NavLink
                                    to="/dashboard"
                                    className="block text-xl font-medium text-white hover:text-blue-400 py-3 px-6 text-center"
                                    onClick={() => setActiva(false)}
                                >
                                    Mi panel de control
                                </NavLink>
                                <NavLink
                                    to="/contacto"
                                    className="block text-xl font-medium text-white hover:text-blue-400 py-3 px-6 text-center"
                                    onClick={() => setActiva(false)}
                                >
                                    Preguntas frecuentes
                                </NavLink>
                                <button
                                    onClick={() => {
                                        logout()
                                        setActiva(false)
                                    }}
                                    className="block bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-3 px-6 mx-4 rounded-md shadow-lg my-4 text-center w-[90%]"
                                >
                                    Salir de mi cuenta
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to={'/iniciar-sesion'}
                                    className="block text-xl font-medium text-white hover:text-blue-400 py-3 px-6 text-center"
                                    onClick={() => setActiva(false)}
                                >
                                    Iniciar Sesión
                                </NavLink>
                                <NavLink
                                    to={'/registrarse'}
                                    className="block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 px-6 mx-4 rounded-md shadow-lg my-4 text-center"
                                    onClick={() => setActiva(false)}
                                >
                                    Registrarse
                                </NavLink>
                            </>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
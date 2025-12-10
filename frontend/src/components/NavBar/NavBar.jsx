import { useState } from 'react'
import links from '../../constants/item-nav'
import ItemNavBar from './ItemNavBar'
// Agregamos iconos nuevos para el menú mobile
import { Menu, X, User, LayoutDashboard, LogOut, HelpCircle, ChevronRight } from 'lucide-react'
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
    const [activa, setActiva] = useState(false)

    return (
        <nav className="bg-gray-800 text-white shadow-xl sticky top-0 z-50">
            {/* --- HEADER PRINCIPAL (Igual que antes) --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">

                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <NavLink
                        to={'/'}
                        className="shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center overflow-hidden bg-transparent">
                            <img
                                src="/public/imgs/logo.png"
                                alt="Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </NavLink>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-4 lg:gap-8 flex-1 justify-center">
                    {links.map((link) => (
                        <ItemNavBar link={link} isMobile={false} key={link.id} setActiva={setActiva} />
                    ))}
                </ul>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <DesktopNavBar isLoggedIn={isAuthenticated} user={user} />
                </div>

                {/* Mobile Toggle Button */}
                <button
                    onClick={() => setActiva(!activa)}
                    className="md:hidden p-2 rounded hover:bg-white/10 transition text-gray-300 hover:text-white"
                >
                    {activa ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>


            {/* --- MENÚ MOBILE PROFESIONAL --- */}

            {/* Overlay oscuro (Fondo detrás del menú) */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${activa ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setActiva(false)}
            />

            {/* Panel Deslizante */}
            <div
                className={`
                    md:hidden fixed top-0 left-0 w-[85%] max-w-[320px] h-full 
                    bg-slate-900 border-r border-slate-800
                    shadow-2xl z-50 
                    transform transition-transform duration-300 ease-out
                    flex flex-col
                    ${activa ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* 1. CABECERA DEL MENÚ (User Hero o Logo) */}
                <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            {/* Avatar del usuario */}
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg ring-2 ring-blue-500/30">
                                {user?.nombre ? user.nombre[0].toUpperCase() : <User size={24} />}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white font-semibold truncate text-lg">Hola, {user?.nombre}</p>
                                <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-blue-500 overflow-hidden">
                                <img src="/public/imgs/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-xl text-white tracking-wide">ConectAR<span className="text-blue-500">Dev</span></span>
                        </div>
                    )}

                    {/* Botón Cerrar (Absoluto para no molestar) */}
                    <button
                        onClick={() => setActiva(false)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 2. LISTA DE NAVEGACIÓN PRINCIPAL (Scrollable) */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menú Principal</p>

                    {/* Renderizamos los links existentes */}
                    <ul className="space-y-1">
                        {links.map((link) => (
                            <ItemNavBar
                                link={link}
                                isMobile={true}
                                setOpen={setActiva}
                                key={link.id}
                            />
                        ))}
                    </ul>

                    {/* SECCIÓN DE USUARIO (Si está logueado) */}
                    {isAuthenticated && (
                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mi Cuenta</p>

                            {/* Links de usuario manuales con iconos */}
                            <nav className="space-y-1">
                                {(user?.role === 'freelancer') && (
                                    <NavLink to="/perfil" onClick={() => setActiva(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all group">
                                        <User size={20} className="text-blue-500 group-hover:text-white transition-colors" />
                                        <span className="font-medium">Mi Perfil Público</span>
                                    </NavLink>
                                )}

                                <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setActiva(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all group">
                                    <LayoutDashboard size={20} className="text-blue-500 group-hover:text-white transition-colors" />
                                    <span className="font-medium">{user?.role === 'admin' ? 'Panel de Administrador' : 'Panel de Control'}</span>
                                </NavLink>

                                <NavLink to="/contacto" onClick={() => setActiva(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all group">
                                    <HelpCircle size={20} className="text-blue-500 group-hover:text-white transition-colors" />
                                    <span className="font-medium">Ayuda / FAQ</span>
                                </NavLink>
                            </nav>
                        </div>
                    )}
                </div>

                {/* 3. FOOTER DEL MENÚ (Acciones finales) */}
                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                logout()
                                setActiva(false)
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white py-3 rounded-xl transition-all duration-300 font-medium border border-red-500/20 hover:border-transparent"
                        >
                            <LogOut size={18} />
                            <span>Cerrar Sesión</span>
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <NavLink
                                to={'/iniciar-sesion'}
                                onClick={() => setActiva(false)}
                                className="w-full text-center py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 transition-all"
                            >
                                Iniciar Sesión
                            </NavLink>
                            <NavLink
                                to={'/registrarse'}
                                onClick={() => setActiva(false)}
                                className="w-full text-center py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 transition-all"
                            >
                                Crear Cuenta Gratis
                            </NavLink>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    )
}

export default NavBar
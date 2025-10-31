import { useState } from 'react'
import links from '../../constants/item-nav'
import ItemNavBar from './ItemNavBar'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router'


const NavBar = () => {

    const [activa, setActiva] = useState(false)
    // Para indicar qué página está activa

    

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                
                {/* 1. Logo (siempre visible en desktop y mobile cuando el menú está cerrado) */}
                <div className="flex items-center space-x-4">
                    <NavLink to={'/'} className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-sm flex items-center justify-center">
                            <img src="/public/imgs/logo.jpeg" alt="Logo de conectar dev" /> 
                        </div>
                    </NavLink>
                </div>

                {/* 2. Links de Navegación (Solo Desktop - Centrados) */}
                <ul className="hidden md:flex gap-8 text-lg flex-1 justify-center">
                    {links.map((link) => (
                        <ItemNavBar link={link} key={link.id} />
                    ))}
                </ul>

                {/* 3. Botones de Acción (Solo Desktop - Derecha) */}
                <div className="hidden md:flex items-center space-x-4">
                    <NavLink 
                        to={'/iniciar-sesion'} 
                        className="text-white hover:text-blue-400 px-3 py-2 text-sm font-medium transition duration-150 ease-in-out"
                    >
                        Iniciar Sesión
                    </NavLink>
                    
                    <NavLink 
                        to={'/registrar'} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
                    >
                        Registrarse
                    </NavLink>
                </div>

                {/* 4. Botón Hamburguesa (Solo Mobile - para abrir/cerrar el menú) */}
                <button
                    onClick={() => setActiva(!activa)}
                    className="md:hidden p-2 rounded hover:bg-white/10 transition"
                    aria-expanded={activa}
                    aria-controls="mobile-menu"
                >
                    {activa ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
                </button>
            </div>

            {/* Menú Mobile Desplegable - ESTE ES EL BLOQUE QUE HEMOS MEJORADO */}
            <div
                id="mobile-menu"
                className={`md:hidden absolute top-0 left-0 w-full bg-gray-800 transition-transform duration-300 ease-in-out transform ${
                    activa ? "translate-x-0" : "-translate-x-full" // Animación de entrada/salida lateral
                } h-screen overflow-y-auto`} // Permite scroll si el contenido es demasiado largo
                style={{ zIndex: 40 }} // Asegurarse de que esté por encima del contenido principal, pero debajo del navbar si es sticky
            >
                {/* Cabecera del Menú Mobile (Logo y botón de cerrar) */}
                <div className="bg-gray-900 h-16 flex justify-between items-center px-4 sm:px-6 lg:px-8">
                    <NavLink to={'/'} className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-sm flex items-center justify-center">
                            <img src="/public/imgs/logo.jpeg" alt="Logo de conectar dev" /> 
                        </div>
                    </NavLink>
                    <button
                        onClick={() => setActiva(false)}
                        className="p-2 rounded hover:bg-white/10 transition"
                        aria-label="Cerrar menú"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Contenido del Menú Mobile (Enlaces y botones) */}
                <ul className="flex flex-col items-center gap-4 py-8"> {/* Aumentado el padding vertical */}
                    {links.map((link) => (
                        <ItemNavBar link={link} isMobile={true} setActiva={setActiva} key={link.id} />
                    ))}
                    {/* Botones de acción en la versión móvil */}
                    <li className="w-full text-center mt-6 border-t border-gray-700 pt-6"> {/* Más espacio y borde superior */}
                        <NavLink 
                            to={'/iniciar-sesion'}
                            className="block text-lg font-medium text-white hover:text-blue-400 py-3" // Más padding vertical
                            onClick={() => setActiva(false)}
                        >
                            Iniciar Sesión
                        </NavLink>
                        <NavLink 
                            to={'/registrar'}
                            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 mx-8 rounded-md shadow-md my-3" // Más padding y margen horizontal
                            onClick={() => setActiva(false)}
                        >
                            Registrarse
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
  )
}

export default NavBar
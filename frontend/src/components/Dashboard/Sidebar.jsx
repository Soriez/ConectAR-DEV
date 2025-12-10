import { useNavigate, useLocation } from 'react-router';
import { User, Settings, MessageSquare, LogOut, Layers, Home, X, Crown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Obtenemos los datos reales del contexto
    const { user, logout } = useContext(AuthContext);

    // Si no ha cargado el usuario aún, evitamos errores
    if (!user) return null;

    const isFreelancer = user.role === 'freelancer';

    const menuItems = [
        { path: '/dashboard', label: 'Perfil', icon: <User size={20} />, end: true },
        { path: '/dashboard/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
        { path: '/dashboard/opiniones', label: 'Opiniones', icon: <MessageSquare size={20} /> },


        // Condicional: Condicionales basados en el rol real
        ...(isFreelancer ? [
            { path: '/dashboard/servicios', label: 'Servicios', icon: <Layers size={20} /> },
        ] : []),
    ];

    const handleLogout = () => {
        logout(); //  Ejecutamos el logout real
        navigate('/'); //navega al home
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (onClose) onClose();
    };

    const isActive = (path, end) => {
        if (end) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Overlay Móvil */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1e293b] text-white flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

                {/* Header */}
                <div className="p-6 flex flex-col items-center border-b border-slate-700 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 md:hidden"><X size={24} /></button>

                    {/* Avatar con Iniciales Reales */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-3 shadow-lg ${user.plan === 'premium' ? 'bg-slate-900 ring-2 ring-yellow-400 text-yellow-400' : 'bg-blue-600'}`}>
                        {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                    </div>

                    <span className="text-lg font-semibold tracking-wide truncate max-w-full">
                        {user.nombre} {user.apellido}
                    </span>

                    {/* Badges Dinámicos */}
                    <div className="flex gap-2 mt-2">
                        {isFreelancer && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
                                Freelancer
                            </span>
                        )}
                        {user.plan === 'premium' && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded border border-yellow-500/30 flex items-center gap-1">
                                <Crown size={10} /> Pro
                            </span>
                        )}
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(item.path, item.end) ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-slate-700 space-y-2">
                    <button onClick={() => handleNavigation('/')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Home size={20} /> <span className="font-medium">Volver al Inicio</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                        <LogOut size={20} /> <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

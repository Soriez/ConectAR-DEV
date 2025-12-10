import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, TrendingUp, LogOut, X, ShieldCheck, Home } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    // Fallback Dummy User si no hay sesion iniciada (para pruebas)
    const adminUser = user || {
        nombre: "Admin",
        apellido: "User",
        email: "admin@conectardev.com"
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (onClose) onClose();
    };

    const isActive = (path, end = false) => {
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

                    {/* Avatar Admin */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-3 shadow-lg bg-blue-600 ring-4 ring-blue-500/30">
                        {adminUser.nombre?.charAt(0)}{adminUser.apellido?.charAt(0)}
                    </div>

                    <span className="text-lg font-semibold tracking-wide truncate max-w-full">
                        {adminUser.nombre} {adminUser.apellido}
                    </span>

                    {/* Badge Admin (Ahora Azul) */}
                    <div className="mt-2">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30 flex items-center gap-1">
                            <ShieldCheck size={12} /> Administrador
                        </span>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {/* Estadísticas (Anteriormente Sitio) */}
                    <button
                        onClick={() => handleNavigation('/admin')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/admin', true) ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <TrendingUp size={20} />
                        <span className="font-medium">Estadísticas</span>
                    </button>

                    {/* Historial de Perfiles (Dashboard Admin) - COLOR AZUL */}
                    <button
                        onClick={() => handleNavigation('/admin/perfiles')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/admin/perfiles') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Historial de Perfiles</span>
                    </button>
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

export default AdminSidebar;

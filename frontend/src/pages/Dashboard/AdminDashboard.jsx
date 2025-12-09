import { useState, useEffect, useContext } from 'react';
import { UserCheck, UserX, Clock, Eye, Check, X, Calendar, Menu, Loader } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/Dashboard/AdminSidebar';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { BASE_URL } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('aprobados');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Estados para la data real
    const [loading, setLoading] = useState(true);
    const [acceptedProfiles, setAcceptedProfiles] = useState([]); // Freelancers
    const [pendingProfiles, setPendingProfiles] = useState([]);   // Clientes (o futuros pendientes)
    const [rejectedProfiles, setRejectedProfiles] = useState([]); // Sin uso por ahora

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/users`);
                const users = res.data;

                // 1. Aprobados: Todos los FREELANCERS
                // Se asume que si tiene rol freelancer, está "aprobado" en el sistema actual
                const freelancers = users.filter(u => u.role === 'freelancer').map(u => ({
                    id: u._id,
                    name: `${u.nombre} ${u.apellido}`,
                    role: u.role === 'freelancer' ? (u.isDisponible ? 'Freelancer Disponible' : 'Freelancer No Disponible') : 'Freelancer',
                    date: new Date(u.createdAt).toLocaleDateString(),
                    rawDate: new Date(u.createdAt) // Para ordenar si fuera necesario
                }));

                // 2. Pendientes: Todos los CLIENTES
                // Se asume que los clientes podrían solicitar ser freelancers
                const clients = users.filter(u => u.role === 'cliente').map(u => ({
                    id: u._id,
                    name: `${u.nombre} ${u.apellido}`,
                    role: 'Usuario / Cliente',
                    date: new Date(u.createdAt).toLocaleDateString()
                }));

                setAcceptedProfiles(freelancers);
                setPendingProfiles(clients);
                setRejectedProfiles([]); // Backend no soporta rechazados aún

            } catch (error) {
                console.error("Error fetching users for admin:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [BASE_URL]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="text-center">
                    <Loader size={48} className="animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-slate-500 font-medium">Cargando perfiles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            <AdminSidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                {/* HEADER MÓVIL */}
                <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-lg text-slate-800">Admin Dashboard</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 overflow-y-auto flex-1">
                    <div className="max-w-5xl mx-auto animate-fade-in-up">
                        {/* Título Principal */}
                        <h1 className="text-2xl font-bold text-slate-800 mb-6">Historial de Perfiles</h1>

                        {/* Sistema de Pestañas */}
                        <div className="flex gap-4 mb-6 border-b border-slate-200 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('aprobados')}
                                className={`pb-3 px-4 font-medium transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'aprobados'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <UserCheck size={18} />
                                Perfiles Aprobados ({acceptedProfiles.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('rechazados')}
                                className={`pb-3 px-4 font-medium transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'rechazados'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <UserX size={18} />
                                Perfiles Rechazados ({rejectedProfiles.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('pendientes')}
                                className={`pb-3 px-4 font-medium transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'pendientes'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Clock size={18} />
                                Perfiles Pendientes ({pendingProfiles.length})
                            </button>
                        </div>

                        {/* Contenido de las Pestañas */}

                        {/* 1. PERFILES APROBADOS (Freelancers) */}
                        {activeTab === 'aprobados' && (
                            <div className="space-y-4">
                                {acceptedProfiles.length === 0 ? (
                                    <div className="text-center py-12">
                                        <UserCheck className="mx-auto mb-4 text-slate-300" size={64} />
                                        <p className="text-slate-500">No hay freelancers registrados.</p>
                                    </div>
                                ) : (
                                    acceptedProfiles.map((profile) => (
                                        <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg shrink-0">
                                                    {profile.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg">{profile.name}</h3>
                                                    <p className="text-sm text-slate-500 font-medium">{profile.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>Registrado el {profile.date}</span>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/perfil/${profile.id}`)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver Perfil"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* 2. PERFILES RECHAZADOS */}
                        {activeTab === 'rechazados' && (
                            <div className="space-y-4">
                                {rejectedProfiles.length === 0 ? (
                                    <div className="text-center py-12">
                                        <UserX className="mx-auto mb-4 text-slate-300" size={64} />
                                        <p className="text-slate-500">No hay perfiles rechazados en el historial.</p>
                                    </div>
                                ) : (
                                    /* Aquí iría el map de rechazados si hubiera lógica en backend */
                                    <div></div>
                                )}
                            </div>
                        )}

                        {/* 3. PERFILES PENDIENTES (Clientes) */}
                        {activeTab === 'pendientes' && (
                            <div className="space-y-4">
                                {pendingProfiles.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Clock className="mx-auto mb-4 text-slate-300" size={64} />
                                        <p className="text-slate-500">No hay usuarios pendientes (clientes).</p>
                                    </div>
                                ) : (
                                    pendingProfiles.map((profile) => (
                                        <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-shadow hover:shadow-md">
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                                                {/* Info del Usuario */}
                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shrink-0">
                                                        {profile.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 text-lg">{profile.name}</h3>
                                                        <p className="text-sm text-slate-500 font-medium">{profile.role}</p>
                                                        <p className="text-xs text-slate-400 mt-1">Registrado: {profile.date}</p>
                                                    </div>
                                                </div>

                                                {/* Botones de Acción */}
                                                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                                    <button
                                                        className="px-4 py-2 text-slate-600 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
                                                        title="Ver solicitud completa"
                                                    >
                                                        <Eye size={18} />
                                                        <span className="hidden sm:inline">Ver</span>
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 text-red-600 font-medium bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-2"
                                                        title="Rechazar solicitud"
                                                    >
                                                        <X size={18} />
                                                        <span className="hidden sm:inline">Rechazar</span>
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 text-white font-medium bg-green-600 hover:bg-green-700 rounded-lg shadow-md shadow-green-200 transition-colors flex items-center gap-2"
                                                        title="Aprobar solicitud"
                                                    >
                                                        <Check size={18} />
                                                        <span className="hidden sm:inline">Aprobar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;

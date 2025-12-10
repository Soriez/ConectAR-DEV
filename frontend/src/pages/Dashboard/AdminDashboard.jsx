import { useState, useEffect, useContext } from 'react';
import { UserCheck, UserX, Clock, Eye, Check, X, Calendar, Menu, Loader, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/Dashboard/AdminSidebar';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { BASE_URL } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('aprobados');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para la data real
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState({ freelancers: [], clients: [], rejected: [] });
    const [acceptedProfiles, setAcceptedProfiles] = useState([]);
    const [pendingProfiles, setPendingProfiles] = useState([]);
    const [rejectedProfiles, setRejectedProfiles] = useState([]);

    // Estado para el Modal de Rechazo
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [userToReject, setUserToReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/users`);
                const users = res.data;

                // 1. Aprobados: Freelancers y Premium que NO están rechazados
                const freelancers = users.filter(u => (u.role === 'freelancer' || u.role === 'premium') && u.estado !== 'rechazado').map(u => ({
                    id: u._id,
                    name: `${u.nombre} ${u.apellido}`,
                    email: u.email,
                    role: u.role === 'premium' ? 'Freelancer Premium' : (u.isDisponible ? 'Freelancer Disponible' : 'Freelancer No Disponible'),
                    date: new Date(u.createdAt).toLocaleDateString(),
                    rawDate: new Date(u.createdAt)
                }));

                // 2. Pendientes: Usuarios con rol 'pendiente' (que no están rechazados)
                // Nota: Antes filtrábamos clientes, pero ahora 'pendiente' es el rol específico para freelancers esperando aprobación.
                // Si quieres incluir TAMBIÉN clientes nuevos, tendrías que ver cómo se diferencian.
                // Asumimos que 'pendiente' son los que requieren acción.
                const pendingUsers = users.filter(u => u.estado === 'pendiente' && u.estado !== 'rechazado' && u.role === 'pendiente').map(u => ({
                    id: u._id,
                    name: `${u.nombre} ${u.apellido}`,
                    email: u.email,
                    role: 'Solicitud Freelancer',
                    date: new Date(u.createdAt).toLocaleDateString()
                }));

                // 3. Rechazados: Cualquier usuario con estado 'rechazado' (independentemente de su rol anterior)
                const rejected = users.filter(u => u.estado === 'rechazado').map(u => ({
                    id: u._id,
                    name: `${u.nombre} ${u.apellido}`,
                    email: u.email,
                    role: 'Solicitud Rechazada',
                    date: new Date(u.createdAt).toLocaleDateString(),
                    reason: u.motivoRechazo || 'Sin motivo especificado'
                }));

                setAllUsers({ freelancers, clients: pendingUsers, rejected });
                setAcceptedProfiles(freelancers);
                setPendingProfiles(pendingUsers);
                setRejectedProfiles(rejected);

            } catch (error) {
                console.error("Error fetching users for admin:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [BASE_URL]);

    const handleRejectClick = (user) => {
        setUserToReject(user);
        setRejectionReason(""); // Reset reason
        setIsRejectModalOpen(true);
    };

    const confirmReject = async () => {
        if (!userToReject) return;

        try {
            await axios.put(`${BASE_URL}/api/users/${userToReject.id}/reject`,
                { motivo: rejectionReason },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );



            // Update UI
            setPendingProfiles(prev => prev.filter(p => p.id !== userToReject.id));

            const rejectedUser = { ...userToReject, role: 'Solicitud Rechazada', reason: rejectionReason };
            setRejectedProfiles(prev => [...prev, rejectedUser]);
            setAllUsers(prev => ({
                ...prev,
                clients: prev.clients.filter(p => p.id !== userToReject.id),
                rejected: [...prev.rejected, rejectedUser]
            }));

            setIsRejectModalOpen(false);
            setUserToReject(null);

        } catch (error) {
            console.error("Error rejecting user:", error);
            // alert("Error al rechazar usuario."); // Removed Alert
        }
    };

    const handleApproveClick = async (user) => {
        // if (!window.confirm(`¿Aprobar a ${user.name}?`)) return; // Removed Confirmation

        try {
            await axios.put(`${BASE_URL}/api/users/${user.id}/approve`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Update UI
            setPendingProfiles(prev => prev.filter(p => p.id !== user.id));

            const newFreelancer = {
                ...user,
                role: 'Freelancer Disponible',
                date: new Date().toLocaleDateString()
            };

            setAcceptedProfiles(prev => [newFreelancer, ...prev]);

            setAllUsers(prev => ({
                ...prev,
                clients: prev.clients.filter(p => p.id !== user.id),
                freelancers: [newFreelancer, ...prev.freelancers]
            }));

            // alert(`Usuario ${user.name} aprobado exitosamente.`); // Removed Success Alert

        } catch (error) {
            console.error("Error approving user:", error);
            // alert("Error al aprobar la solicitud."); // Removed Error Alert
        }
    };

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
        <div className="flex min-h-screen bg-slate-100 font-sans relative">
            {/* MODAL DE RECHAZO */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-800">Rechazar Solicitud</h3>
                            <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <p className="text-slate-600 mb-4">
                            Estás a punto de rechazar la solicitud de <span className="font-bold text-slate-800">{userToReject?.name}</span>.
                            El usuario no será eliminado, pero su estado cambiará a "Rechazado".
                        </p>

                        <div className="space-y-3 mb-6">
                            <label className="block text-sm font-medium text-slate-700">Motivo del rechazo</label>
                            <select
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                            >
                                <option value="" disabled>Selecciona una opción...</option>
                                <option value="Información incompleta">Información incompleta</option>
                                <option value="Contenido inapropiado">Contenido inapropiado</option>
                                <option value="Es Spam / Bot">Es Spam / Bot</option>
                                <option value="Otro motivo">Otro motivo</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={!rejectionReason}
                                className={`px-4 py-2 text-white rounded-lg font-medium shadow-md transition-all flex items-center gap-2
                                    ${!rejectionReason ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}
                                `}
                            >
                                <UserX size={18} /> Confirmar Rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <h1 className="text-2xl font-bold text-slate-800">Historial de Perfiles</h1>

                            {/* BÚSQUEDA */}
                            <div className="relative w-full md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
                                />
                            </div>
                        </div>

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
                                        <p className="text-slate-500">
                                            {searchTerm ? 'No se encontraron resultados.' : 'No hay freelancers registrados.'}
                                        </p>
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
                                        <p className="text-slate-500">
                                            {searchTerm ? 'No se encontraron resultados.' : 'No hay perfiles rechazados en el historial.'}
                                        </p>
                                    </div>
                                ) : (
                                    rejectedProfiles.map((profile) => (
                                        <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-75">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-lg shrink-0">
                                                    {profile.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg">{profile.name}</h3>
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm text-red-500 font-medium">{profile.role}</p>
                                                        <p className="text-xs text-slate-500 italic">Motivo: {profile.reason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
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

                        {/* 3. PERFILES PENDIENTES (Clientes) */}
                        {activeTab === 'pendientes' && (
                            <div className="space-y-4">
                                {pendingProfiles.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Clock className="mx-auto mb-4 text-slate-300" size={64} />
                                        <p className="text-slate-500">
                                            {searchTerm ? 'No se encontraron resultados.' : 'No hay clientes registrados.'}
                                        </p>
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
                                                        onClick={() => navigate(`/perfil/${profile.id}`)}
                                                        className="px-4 py-2 text-slate-600 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
                                                        title="Ver solicitud completa"
                                                    >
                                                        <Eye size={18} />
                                                        <span className="hidden sm:inline">Ver</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClick(profile)}
                                                        className="px-4 py-2 text-red-600 font-medium bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-2"
                                                        title="Rechazar solicitud"
                                                    >
                                                        <X size={18} />
                                                        <span className="hidden sm:inline">Rechazar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveClick(profile)}
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

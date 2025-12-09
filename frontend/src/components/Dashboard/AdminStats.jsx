import { useState, useEffect, useContext } from 'react';
import { Users, UserCheck, TrendingUp, Menu } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';

const AdminStats = () => {
    const { BASE_URL } = useContext(AuthContext);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalVisits: 0,
        totalFreelancers: 0,
        availableFreelancers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/users`);
                const users = res.data;

                // 1. Total Visitas
                const visits = users.reduce((acc, user) => acc + (user.cantVisitas || 0), 0);

                // 2. Freelancers Count
                const freelancers = users.filter(u => u.role === 'freelancer');
                const freelancersCount = freelancers.length;

                // 3. Available Freelancers
                const available = freelancers.filter(u => u.role === 'freelancer' && u.isDisponible).length;

                setStats({
                    totalVisits: visits,
                    totalFreelancers: freelancersCount,
                    availableFreelancers: available
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [BASE_URL]);

    const StatCard = ({ title, value, icon: Icon, color, subColor }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${subColor} ${color}`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800">{loading ? '...' : value}</h3>
            </div>
        </div>
    );

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
                        <span className="font-bold text-lg text-slate-800">Estadísticas</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 overflow-y-auto flex-1">
                    <div className="max-w-5xl mx-auto animate-fade-in-up">
                        <h1 className="text-2xl font-bold text-slate-800 mb-6">Panel de Estadísticas</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard
                                title="Ingresos al Sitio"
                                value={stats.totalVisits}
                                icon={TrendingUp}
                                color="text-blue-600"
                                subColor="bg-blue-100"
                            />
                            <StatCard
                                title="Freelancers Totales"
                                value={stats.totalFreelancers}
                                icon={Users}
                                color="text-indigo-600"
                                subColor="bg-indigo-100"
                            />
                            <StatCard
                                title="Disponibles Ahora"
                                value={stats.availableFreelancers}
                                icon={UserCheck}
                                color="text-green-600"
                                subColor="bg-green-100"
                            />
                        </div>

                        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Resumen General</h2>
                            <p className="text-slate-600">
                                Actualmente hay <span className="font-bold text-indigo-600">{stats.totalFreelancers}</span> freelancers registrados en la plataforma.
                                De ellos, el <span className="font-bold text-green-600">{stats.totalFreelancers > 0 ? Math.round((stats.availableFreelancers / stats.totalFreelancers) * 100) : 0}%</span> está disponible para trabajar inmediatamente.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminStats;

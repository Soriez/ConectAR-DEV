import { useState, useEffect, useContext } from 'react';
import { Users, TrendingUp, Menu, Crown } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';

const AdminStats = () => {
    const { BASE_URL } = useContext(AuthContext);
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
    const [estadisticas, setEstadisticas] = useState({
        visitasTotales: 0,
        totalFreelancers: 0,
        freelancersPremium: 0
    });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                // 1. Obtener Usuarios
                const resUsers = await axios.get(`${BASE_URL}/api/users`);
                const usuarios = resUsers.data;

                // 2. Obtener Estadísticas Globales del Sitio
                let visitasSitio = 0;
                try {
                    const resStats = await axios.get(`${BASE_URL}/api/dashboard/stats/site-global`);
                    visitasSitio = resStats.data.totalVisits;
                } catch (errorStats) {
                    console.error("Error al obtener estadísticas globales:", errorStats);
                }

                // --- Cálculos ---

                // Total de Freelancers (Standard + Premium)
                const freelancers = usuarios.filter(u => u.role === 'freelancer' || u.plan === 'premium');
                const cantidadFreelancers = freelancers.length;

                // Freelancers Premium
                const cantidadPremium = usuarios.filter(u => u.plan === 'premium').length;

                setEstadisticas({
                    visitasTotales: visitasSitio,
                    totalFreelancers: cantidadFreelancers,
                    freelancersPremium: cantidadPremium
                });
            } catch (error) {
                console.error("Error al obtener datos para admin stats:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerDatos();
    }, [BASE_URL]);

    const StatCard = ({ title, value, icon: Icon, color, subColor }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${subColor} ${color}`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800">{cargando ? '...' : value}</h3>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            <AdminSidebar
                isOpen={menuMovilAbierto}
                onClose={() => setMenuMovilAbierto(false)}
            />

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                {/* HEADER MÓVIL */}
                <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMenuMovilAbierto(true)}
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
                                value={estadisticas.visitasTotales}
                                icon={TrendingUp}
                                color="text-blue-600"
                                subColor="bg-blue-100"
                            />
                            <StatCard
                                title="Freelancers Totales"
                                value={estadisticas.totalFreelancers}
                                icon={Users}
                                color="text-indigo-600"
                                subColor="bg-indigo-100"
                            />
                            <StatCard
                                title="Freelancers Premium"
                                value={estadisticas.freelancersPremium}
                                icon={Crown}
                                color="text-amber-500"
                                subColor="bg-amber-100"
                            />
                        </div>

                        <div className="mt-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-around gap-8">

                            {/* Gráfico de Donut CSS */}
                            <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner"
                                style={{ background: `conic-gradient(#f59e0b ${estadisticas.totalFreelancers > 0 ? (estadisticas.freelancersPremium / estadisticas.totalFreelancers) * 100 : 0}%, #4f46e5 0)` }}>
                                <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-sm z-10">
                                    <span className="text-3xl font-extrabold text-slate-800">
                                        {estadisticas.totalFreelancers}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total</span>
                                </div>
                            </div>

                            {/* Leyenda y Detalles */}
                            <div className="flex-1 max-w-lg">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Balance de Suscripciones</h2>
                                <p className="text-slate-600 mb-6">
                                    Visualización de la distribución entre cuentas gratuitas y premium en la plataforma.
                                </p>

                                <div className="space-y-4">
                                    {/* Barra Premium */}
                                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm ring-2 ring-amber-200"></div>
                                            <span className="font-semibold text-slate-700">Premium</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-amber-600 text-lg">{estadisticas.freelancersPremium}</span>
                                            <span className="text-xs text-slate-500">
                                                {estadisticas.totalFreelancers > 0 ? Math.round((estadisticas.freelancersPremium / estadisticas.totalFreelancers) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Barra Free */}
                                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full bg-indigo-600 shadow-sm ring-2 ring-indigo-200"></div>
                                            <span className="font-semibold text-slate-700">Estándar (Free)</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-indigo-600 text-lg text-right">{estadisticas.totalFreelancers - estadisticas.freelancersPremium}</span>
                                            <span className="text-xs text-slate-500">
                                                {estadisticas.totalFreelancers > 0 ? Math.round(((estadisticas.totalFreelancers - estadisticas.freelancersPremium) / estadisticas.totalFreelancers) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminStats;

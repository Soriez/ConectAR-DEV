import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Crown, Briefcase, ExternalLink, Quote } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const FreelancerCard = ({ user }) => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
                const res = await axios.get(`${BASE_URL}/api/servicios/freelancer/${user._id}`);
                const servicios = res.data;
                const tiposUnicos = new Set();
                servicios.forEach(servicio => {
                    if (servicio.tipoServicio && servicio.tipoServicio.nombre) {
                        tiposUnicos.add(servicio.tipoServicio.nombre);
                    }
                });
                setServices(Array.from(tiposUnicos));
            } catch (error) {
                console.error("Error fetching services:", error);
                // Fallback to skills if fetch fails
                if (user.skills) setServices(user.skills);
            } finally {
                setLoadingServices(false);
            }
        };

        if (user._id) {
            fetchServices();
        }
    }, [user._id, user.skills]);

    const handleProfileClick = (e) => {
        e.stopPropagation();
        navigate(`/perfil/${user._id}`);
    };

    return (
        <div className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 h-full">
            <div className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Borde superior decorativo */}
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity"></div>

                {/* Badge Premium */}
                <div className="absolute top-4 right-4 bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-100 flex items-center gap-1 z-10">
                    <Crown size={10} fill="currentColor" />
                    PREMIUM
                </div>

                {/* Perfil Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=1e293b&color=fff&size=128&bold=true&rounded=true`}
                            alt={`${user.nombre} ${user.apellido}`}
                            className="w-16 h-16 rounded-2xl object-cover shadow-md bg-slate-900"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="min-w-0 pt-1 flex-1">
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 pr-14 h-14 flex items-center">
                            {user.nombre} {user.apellido}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1 truncate">
                            <Briefcase size={14} className="text-slate-400" />
                            <span className="truncate">{user.titulo || "Freelancer IT"}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-current" />
                            <span className="text-xs font-bold text-slate-700">{user.rating || "5.0"}</span>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                <div className="relative mb-5 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 h-[120px] transition-colors flex flex-col justify-center">
                    <Quote size={16} className="text-yellow-400 absolute top-3 left-3 rotate-180" />
                    <p className="text-sm text-slate-600 italic line-clamp-3 text-center px-3 py-1">
                        {user.descripcion ? user.descripcion.replace(/^["']|["']$/g, '') : 'Profesional enfocado en resultados de alta calidad.'}
                    </p>
                    <Quote size={16} className="text-yellow-400 absolute bottom-3 right-3" />
                </div>

                {/* Servicios (Tags) */}
                <div className="flex flex-wrap content-start gap-2 mb-6 h-[80px] overflow-hidden">
                    {loadingServices ? (
                        <span className="text-xs text-slate-400 animate-pulse">Cargando...</span>
                    ) : (
                        <>
                            {services.slice(0, 2).map((service, index) => (
                                <button
                                    key={index}
                                    onClick={handleProfileClick}
                                    className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer h-fit"
                                >
                                    {service}
                                </button>
                            ))}
                            {services.length > 2 && (
                                <button
                                    onClick={handleProfileClick}
                                    className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md shadow-sm hover:bg-blue-100 transition-colors cursor-pointer h-fit"
                                >
                                    +{services.length - 2}
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Botón */}
                <button
                    onClick={handleProfileClick}
                    className="mt-auto w-full py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                    Ver Perfil
                    <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
};

const FreelancersInicio = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    // NUEVO: Estado para saber cuántos se ven por pantalla
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();

    const delay = 4500;

    // 1. NUEVO: Detectar tamaño de pantalla para calcular paginación correcta
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setItemsPerPage(3);      // Desktop
            else if (window.innerWidth >= 768) setItemsPerPage(2);  // Tablet
            else setItemsPerPage(1);                                // Mobile
        };

        // Ejecutar al inicio y al cambiar tamaño
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch de datos (Igual que antes)
    useEffect(() => {
        const fetchPremium = async () => {
            try {
                const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
                const res = await axios.get(`${BASE_URL}/api/users/freelancers/premium`);
                setFreelancers(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando destacados:", error);
                setLoading(false);
            }
        };
        fetchPremium();
    }, []);

    // Calculamos el número total de páginas (vistas)
    const totalPages = Math.ceil(freelancers.length / itemsPerPage);

    // 2. CORREGIDO: Lógica de Autoplay basada en PÁGINAS, no en ítems
    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        resetTimeout();
        if (totalPages > 1) { // Solo activar si hay más de una página
            timeoutRef.current = setTimeout(() => {
                setActiveIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
            }, delay);
        }
        return () => resetTimeout();
    }, [activeIndex, totalPages]);

    // 3. CORREGIDO: Handlers de navegación
    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    };

    if (loading) return null;
    if (freelancers.length === 0) return null;
    return (
        <section className="bg-slate-50 py-12 border-b border-slate-200 overflow-hidden relative">
            {/* Fondo: Gradiente dorado sutil y profesional */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-amber-300 via-yellow-500 to-amber-300 opacity-80 shadow-sm"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        {/* Icono Crown: Fondo ámbar suave */}
                        <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 shadow-sm border border-amber-100 ring-1 ring-amber-200/50">
                            <Crown size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Talento <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-yellow-500">Premium</span>
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">
                                Profesionales verificados y altamente calificados
                            </p>
                        </div>
                    </div>

                    {/* Controles */}
                    {totalPages > 1 && (
                        <div className="hidden md:flex gap-2">
                            <button
                                onClick={handlePrev}
                                className="p-2 rounded-full border border-slate-200 text-slate-400 hover:bg-white hover:text-amber-600 hover:border-amber-200 hover:shadow-md transition-all active:scale-95 bg-white"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="p-2 rounded-full border border-slate-200 text-slate-400 hover:bg-white hover:text-amber-600 hover:border-amber-200 hover:shadow-md transition-all active:scale-95 bg-white"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>

                {/* --- CARRUSEL --- */}
                <div className="relative w-full overflow-hidden pb-6 px-1">

                    {/* Track Deslizante */}
                    <div
                        className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                        style={{ transform: `translate3d(${-activeIndex * 100}%, 0, 0)` }}
                    >
                        {freelancers.map((user) => (
                            <FreelancerCard key={user._id} user={user} />
                        ))}
                    </div>
                </div>

                {/* Puntos Indicadores (Mobile/Tablet) */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-2 md:hidden">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6 bg-amber-500' : 'w-1.5 bg-slate-300'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )

};

export default FreelancersInicio;
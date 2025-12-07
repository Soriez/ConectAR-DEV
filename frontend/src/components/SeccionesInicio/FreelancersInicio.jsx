import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Crown, Briefcase, ExternalLink, Quote } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const FreelancersInicio = ({ data, title, subtitle, showPremiumBadge = true }) => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(!data);
    const [activeIndex, setActiveIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();

    const delay = 4500;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setItemsPerPage(3);
            else if (window.innerWidth >= 768) setItemsPerPage(2);
            else setItemsPerPage(1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (data) {
            setFreelancers(data);
            setLoading(false);
            setActiveIndex(0);
        }
    }, [data]);

    useEffect(() => {
        if (data) return;
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
    }, [data]);

    const totalPages = Math.ceil(freelancers.length / itemsPerPage);

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

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    };

    if (loading) return null;
    if (freelancers.length === 0) return null;
    return (
        <section className="bg-slate-900 py-12 border-b border-slate-800 overflow-hidden relative">
            {/* Fondo: Gradiente dorado sutil y profesional */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-500/50 via-yellow-400 to-amber-500/50 opacity-60 shadow-[0_0_15px_rgba(251,191,36,0.3)]"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        {/* Icono Crown: Fondo oscuro con borde ámbar */}
                        <div className="p-3 bg-slate-800 rounded-xl text-amber-400 shadow-lg shadow-amber-900/20 border border-slate-700 ring-1 ring-amber-500/20">
                            <Crown size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                Talento <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-yellow-200">Premium</span>
                            </h2>
                            <p className="text-sm text-slate-400 font-medium">
                                Profesionales verificados y altamente calificados
                            </p>
                        </div>
                    </div>

                    {/* Controles (Dark Mode) */}
                    {totalPages > 1 && (
                        <div className="hidden md:flex gap-3">
                            <button 
                                onClick={handlePrev}
                                className="p-2.5 rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all active:scale-95 shadow-lg"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={handleNext}
                                className="p-2.5 rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all active:scale-95 shadow-lg"
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
                            <div 
                                key={user._id} 
                                className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3"
                            >
                                {/* Card: Fondo oscuro (slate-800) */}
                                <div 
                                    className="group relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                                >
                                    {/* Borde superior decorativo */}
                                    <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    {/* Badge Premium (Dark version) */}
                                    <div className="absolute top-4 right-4 bg-amber-900/30 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1 shadow-inner">
                                        <Crown size={10} fill="currentColor" />
                                        PREMIUM
                                    </div>

                                    {/* Perfil Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="relative shrink-0">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-700 overflow-hidden ring-2 ring-slate-700 group-hover:ring-amber-500/40 transition-all">
                                                <div className="w-full h-full bg-linear-to-br from-slate-600 to-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                                                    {user.nombre.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors truncate">
                                                {user.nombre} {user.apellido}
                                            </h3>
                                            <p className="text-sm text-slate-400 flex items-center gap-1.5 mb-1 truncate">
                                                <Briefcase size={14} className="text-slate-500" />
                                                <span className="truncate">{user.titulo || "Freelancer IT"}</span>
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <Star size={12} className="text-amber-400 fill-current" />
                                                <span className="text-xs font-bold text-slate-300">{user.rating || "5.0"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Descripción (Caja interna más oscura) */}
                                    <div className="relative mb-5 bg-slate-900/50 p-3 rounded-xl border border-slate-700 flex-1 group-hover:border-amber-500/20 transition-colors">
                                        <Quote size={14} className="text-slate-600 mb-1" />
                                        <p className="text-sm text-slate-300 italic line-clamp-2">
                                            "{user.descripcion || 'Profesional enfocado en resultados de alta calidad.'}"
                                        </p>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {user.skills?.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="text-[11px] font-semibold text-slate-300 bg-slate-700 border border-slate-600 px-2 py-1 rounded-md shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Botón (Azul para resaltar) */}
                                    <button 
                                        onClick={() => navigate(`/perfil/${user._id}`)}
                                        className="mt-auto w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                                    >
                                        Ver Perfil
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Puntos Indicadores (Mobile/Tablet) */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4 md:hidden">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6 bg-amber-500' : 'w-1.5 bg-slate-600'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
       
};

export default FreelancersInicio;
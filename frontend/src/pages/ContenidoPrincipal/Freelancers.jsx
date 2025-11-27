import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, ChevronLeft, ChevronRight, Check, Globe, Briefcase, DollarSign, MapPin, X } from 'lucide-react';
import { NavLink } from 'react-router';

// 🚨 RUTA DE IMPORTACIÓN CORREGIDA para el componente reutilizado del carrusel
import FreelancersInicio from '../../components/SeccionesInicio/FreelancersInicio'; 

// Importamos los datos locales desde el archivo que acabamos de crear
import dbData from '../../data/freelancers.json'; 

/* ========================================================================
   UTILS & ENRICHMENT
   ======================================================================== */

const getRating = (opinionStr) => {
    const match = opinionStr?.toString().match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
};

const getAvatarUrl = (nombre, apellido) => {
    // Genera un avatar con iniciales si no hay foto
    return `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=random&color=fff&size=128&bold=true`;
};

// Función inteligente para asignar Título y Servicios según la descripción
const enrichProfileData = (profile) => {
    const descLower = (profile.descripcion || "").toLowerCase();
    let titulo = "Freelancer Digital";
    let servicios = ["Consultoría"];
    let especialidad = "Otros";

    if (descLower.includes("web") || descLower.includes("sitios") || descLower.includes("funcionales")) {
        titulo = "Desarrollador Web";
        servicios = ["Frontend", "Backend", "Wordpress"];
        especialidad = "Desarrollo";
    } else if (descLower.includes("diseño") || descLower.includes("gráfico") || descLower.includes("creatividad")) {
        titulo = "Diseñador Gráfico";
        servicios = ["Branding", "UI/UX", "Logos"];
        especialidad = "Diseño";
    } else if (descLower.includes("redactora") || descLower.includes("textos") || descLower.includes("mensajes")) {
        titulo = "Redactor Creativo";
        servicios = ["Copywriting", "SEO", "Blogs"];
        especialidad = "Redacción";
    }

    // Asignar idiomas (simulado para la demo)
    const idiomas = profile.id % 2 === 0 ? ["Español", "Inglés"] : ["Español"];

    // Nota: Añadimos isPremium y isDisponible si el JSON no lo tiene
    const isPremium = profile.isPremium || (profile.id % 5 === 0); // Simulación
    const isDisponible = profile.isDisponible !== undefined ? profile.isDisponible : true; // Simulación

    return {
        ...profile,
        titulo,
        servicios,
        especialidad,
        idiomas,
        isPremium,
        isDisponible,
        rating: getRating(profile.opiniones)
    };
};

// Procesar la DB una sola vez al cargar
const ENRICHED_DB = Array.isArray(dbData) ? dbData.map(enrichProfileData) : [];


/* ========================================================================
   COMPONENTE TARJETA
   ======================================================================== */
const FreelancerCard = ({ data }) => {
    const avatar = getAvatarUrl(data.nombre, data.apellido);

    return (
        <div className="bg-white rounded-xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-50">
                <div className="flex items-start gap-4">
                    <img 
                        src={avatar} 
                        alt={`${data.nombre} ${data.apellido}`} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm bg-slate-50"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {data.nombre} {data.apellido}
                        </h3>
                        <div className="flex items-center gap-1 text-blue-600 text-sm font-medium mb-1">
                            <Briefcase size={14} />
                            <span className="truncate">{data.titulo}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            {/* Indicador Premium (Nuevo) */}
                            {data.isPremium && (
                                <span className="text-yellow-500 mr-1" title="Perfil Premium">⭐</span>
                            )}
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={i < data.rating ? "fill-current" : "text-slate-200"} />
                                ))}
                            </div>
                            <span className="text-xs text-slate-400 ml-1">({data.rating}.0)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cuerpo */}
            <div className="p-5 flex-1 flex flex-col gap-4">
                <p className="text-sm text-slate-600 line-clamp-3 italic leading-relaxed">
                    "{data.descripcion}"
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {data.servicios.map((srv, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded-md tracking-wide border border-slate-200">
                            {srv}
                        </span>
                    ))}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1">
                        <Globe size={14} /> {data.idiomas.join(", ")}
                    </div>
                    {data.isDisponible && (
                        <div className="flex items-center gap-1 text-emerald-600 font-medium ml-auto">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Disponible
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tarifa Hora</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(data.tarifa)}</p>
                </div>
                <NavLink 
                    to={`/perfil/${data.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                >
                    Ver Perfil
                </NavLink>
            </div>
        </div>
    );
};

/* ========================================================================
   PÁGINA PRINCIPAL
   ======================================================================== */
const Freelancers = () => {
    // --- Estados de Filtros ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEspecialidad, setFilterEspecialidad] = useState("Todas");
    const [filterIdioma, setFilterIdioma] = useState("Todos");
    const [filterRating, setFilterRating] = useState(0);
    const [filterTarifaMax, setFilterTarifaMax] = useState(200000);
    
    // Estado para filtros móviles
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // --- Paginación ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24; 

    // --- Filtrado y División ---
    const { premiumData, generalData, totalResults } = useMemo(() => {
        // 1. Filtrado
        let filtered = ENRICHED_DB.filter(item => {
            const term = searchTerm.toLowerCase();
            const matchesSearch = 
                item.nombre.toLowerCase().includes(term) || 
                item.apellido.toLowerCase().includes(term) ||
                item.descripcion.toLowerCase().includes(term) ||
                item.titulo.toLowerCase().includes(term);

            const matchesEsp = filterEspecialidad === "Todas" || item.especialidad === filterEspecialidad;
            const matchesIdioma = filterIdioma === "Todos" || item.idiomas.includes(filterIdioma);
            const matchesRating = item.rating >= filterRating;
            const matchesTarifa = item.tarifa <= filterTarifaMax;

            return matchesSearch && matchesEsp && matchesIdioma && matchesRating && matchesTarifa;
        });

        // 2. División de listas
        let premium = filtered.filter(item => item.isPremium);
        let general = filtered.filter(item => !item.isPremium); // SÓLO No-Premium
        
        // 3. Ordenamiento
        premium.sort((a, b) => b.rating - a.rating); // Premium: Rating Desc.
        general.sort((a, b) => b.rating - a.rating); // General: Default Rating Desc.

        return {
            premiumData: premium,
            generalData: general,
            totalResults: filtered.length
        };

    }, [searchTerm, filterEspecialidad, filterIdioma, filterRating, filterTarifaMax]);

    // --- Paginación Lógica ---
    const totalPages = Math.ceil(generalData.length / itemsPerPage);
    
    // Solo paginamos la lista general (no premium)
    const paginatedGeneralData = generalData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- Función para aplicar filtros en móvil ---
    const handleApplyMobileFilters = () => {
        setCurrentPage(1);
        setShowMobileFilters(false);
    }

    const especialidadesList = ["Todas", ...new Set(ENRICHED_DB.map(i => i.especialidad))];
    
    // Condición para mostrar el estado vacío
    //const showEmptyState = totalResults === 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
            
            {/* ===== HERO SEARCH (Se mantiene arriba, fuera del layout de 2 columnas) ===== */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Catálogo de Talentos</h1>
                            <p className="text-sm text-slate-500">Encuentra al profesional perfecto para tu proyecto</p>
                        </div>
                        
                        <div className="flex gap-2 w-full lg:w-auto">
                            <div className="relative w-full lg:w-96 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nombre, habilidad o rol..." 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            {/* Botón Filtros Móvil */}
                            <button 
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-200"
                            >
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ✅ INTEGRACIÓN DEL CARRUSEL (USUARIOS PREMIUM DESTACADOS) */}
            {/* Solo mostramos el carrusel si hay resultados premium que coincidan con los filtros */}
            {premiumData.length > 0 && <FreelancersInicio />} 

            {/* ===== LAYOUT PRINCIPAL: FILTROS y CATÁLOGO ===== */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* --- SIDEBAR FILTROS --- */}
                    <aside className={`
                        fixed inset-0 z-40 bg-white p-6 lg:p-0 lg:static lg:bg-transparent lg:z-auto lg:w-72 lg:shrink-0 
                        ${showMobileFilters ? 'flex flex-col overflow-y-auto' : 'hidden lg:block'}
                    `}>
                        {/* Header Móvil */}
                        <div className="lg:hidden flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Filtros</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contenido Sidebar */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit lg:sticky lg:top-28 space-y-8">
                            
                            {/* Header Desktop */}
                            <div className="hidden lg:flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                                <Filter size={18} className="text-blue-600" />
                                <h3 className="font-bold text-slate-800">Filtros</h3>
                            </div>

                            {/* Especialidad */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Especialidad</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {especialidadesList.map(esp => (
                                        <label key={esp} className="flex items-center gap-3 cursor-pointer group p-1 rounded hover:bg-slate-50">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${filterEspecialidad === esp ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                                {filterEspecialidad === esp && <Check size={10} className="text-white" />}
                                            </div>
                                            <input 
                                                type="radio" 
                                                name="especialidad" 
                                                className="hidden"
                                                checked={filterEspecialidad === esp}
                                                onChange={() => { setFilterEspecialidad(esp); setCurrentPage(1); setShowMobileFilters(false); }}
                                            />
                                            <span className={`text-sm ${filterEspecialidad === esp ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
                                                {esp}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Tarifa Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Max. $/h</label>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        ${filterTarifaMax.toLocaleString()}
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="200000" 
                                    step="5000" 
                                    value={filterTarifaMax}
                                    onChange={(e) => { setFilterTarifaMax(Number(e.target.value)); setCurrentPage(1); }}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Idioma */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Idioma</label>
                                <select 
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none cursor-pointer"
                                    value={filterIdioma}
                                    onChange={(e) => { setFilterIdioma(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="Todos">Todos los idiomas</option>
                                    <option value="Español">Español</option>
                                    <option value="Inglés">Inglés</option>
                                </select>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Calificación Mínima</label>
                                <div className="flex flex-col gap-1">
                                    {[5, 4, 3, 2, 1].map(stars => (
                                        <button 
                                            key={stars}
                                            onClick={() => { setFilterRating(filterRating === stars ? 0 : stars); setCurrentPage(1); }}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors w-full ${filterRating === stars ? 'bg-yellow-50 ring-1 ring-yellow-400 text-yellow-700' : 'hover:bg-slate-50 text-slate-600'}`}
                                        >
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < stars ? "fill-current" : "text-slate-200"} />
                                                ))}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* --- boton de aplicar filtros version mobile --- */}
                        {showMobileFilters && (
                            <div className="lg:hidden sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 mt-auto">
                                <button 
                                    onClick={handleApplyMobileFilters}
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                                >
                                    Aplicar Filtros ({totalResults})
                                </button>
                            </div>
                        )}
                    </aside>

                    {/* --- GRID RESULTADOS (SÓLO GENERAL) --- */}
                    <div className="flex-1">
                        
                        <div className="mb-6 flex justify-between items-center">
                            {/* Mostramos el conteo del catálogo general */}
                            <p className="text-slate-500 text-sm">
                                Se encontraron <span className="font-bold text-slate-900">{generalData.length}</span> resultados en el Catálogo General
                            </p>
                            
                            {/* Paginación Mini (Arriba - SÓLO para la lista general) */}
                            {generalData.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-400 mr-2 hidden sm:inline">
                                        Pág {currentPage} de {totalPages}
                                    </span>
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-1.5 rounded-md border border-slate-200 hover:bg-white disabled:opacity-30 text-slate-600 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 rounded-md border border-slate-200 hover:bg-white disabled:opacity-30 text-slate-600 transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* ===== CATÁLOGO GENERAL (PAGINADA - SÓLO NO-PREMIUM) ===== */}
                        {paginatedGeneralData.length > 0 ? (
                            <>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">
                                    Catálogo General
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {paginatedGeneralData.map((freelancer) => (
                                        <FreelancerCard key={freelancer.id} data={freelancer} />
                                    ))}
                                </div>
                            </>
                        ) : totalResults === 0 ? (
                            /* Estado Vacío si NO hay absolutamente NINGÚN resultado (Premium + General) */
                            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No encontramos resultados</h3>
                                <p className="text-slate-500 mb-6">Intenta ajustar tus filtros o busca con otros términos.</p>
                                <button 
                                    onClick={() => { setSearchTerm(""); setFilterEspecialidad("Todas"); setFilterRating(0); setFilterTarifaMax(200000); }}
                                    className="text-blue-600 font-semibold hover:underline text-sm"
                                >
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        ) : (
                            /* Si hay resultados Premium (totalResults > 0) pero no Generales, muestra un mensaje suave. */
                             <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No encontramos resultados en el Catálogo General</h3>
                                <p className="text-slate-500">Los resultados Premium que cumplen tus filtros se muestran arriba.</p>
                            </div>
                        )}

                        {/* Paginación Inferior (SÓLO si la lista general tiene más de una página) */}
                        {totalPages > 1 && paginatedGeneralData.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} /> Anterior
                                    </button>
                                    
                                    <div className="hidden sm:flex items-center px-4 text-sm font-medium text-slate-600">
                                        Página {currentPage} de {totalPages}
                                    </div>

                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Siguiente <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Freelancers;
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import axios from 'axios';

// Componente reutilizado del carrusel
import FreelancersInicio from '../../components/SeccionesInicio/FreelancersInicio';
// Componente de Tarjeta Unificado
import FreelancerCard from '../../components/Cards/FreelancerCard';

// URL Base correcta
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

/* ========================================================================
   PÁGINA PRINCIPAL
   ======================================================================== */
const Freelancers = () => {
    // --- Estados de Datos ---
    const [freelancersDB, setFreelancersDB] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Estados de Filtros ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEspecialidad, setFilterEspecialidad] = useState("Todas");
    const [filterRating, setFilterRating] = useState(0);
    const [filterTarifaMax, setFilterTarifaMax] = useState(200000);

    // Estado para filtros móviles
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // --- Paginación ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24;

    // --- FETCH DE DATOS ---
    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                // Petición al puerto correcto
                const response = await axios.get(`${BASE_URL}/api/users/freelancers`);
                setFreelancersDB(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching freelancers:", err);
                setError("Error al cargar los freelancers.");
                setLoading(false);
            }
        };

        if (BASE_URL) {
            fetchFreelancers();
        }
    }, []);

    // --- Filtrado y División ---
    const { premiumData, generalData, totalResults } = useMemo(() => {
        // 1. Filtrado
        let filtered = freelancersDB.filter(item => {
            const term = searchTerm.toLowerCase();

            // Búsqueda segura (manejo de nulls)
            const matchesSearch =
                (item.nombre || "").toLowerCase().includes(term) ||
                (item.apellido || "").toLowerCase().includes(term) ||
                (item.descripcion || "").toLowerCase().includes(term) ||
                (item.titulo || "").toLowerCase().includes(term);

            // Filtro de especialidad basado en SKILLS reales
            // Si filterEspecialidad es "Todas", pasa. Si no, revisamos si el array de skills incluye la especialidad seleccionada.
            const matchesEsp = filterEspecialidad === "Todas" || (item.skills && item.skills.includes(filterEspecialidad));

            const matchesRating = (item.rating || 5) >= filterRating;
            const matchesTarifa = (item.tarifa || 0) <= filterTarifaMax;

            return matchesSearch && matchesEsp && matchesRating && matchesTarifa;
        });

        // 2. División de listas
        let premium = filtered.filter(item => item.plan === 'premium');
        let general = filtered.filter(item => item.plan !== 'premium');

        // 3. Ordenamiento (Rating descendente por defecto)
        premium.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        general.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        return {
            premiumData: premium,
            generalData: general,
            totalResults: filtered.length
        };

    }, [freelancersDB, searchTerm, filterEspecialidad, filterRating, filterTarifaMax]);

    // --- Paginación Lógica ---
    const totalPages = Math.ceil(generalData.length / itemsPerPage);

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

    // Generar lista de especialidades dinámicamente basada en las SKILLS reales de la BD
    const especialidadesList = useMemo(() => {
        const allSkills = freelancersDB.flatMap(f => f.skills || []);
        const uniqueSkills = [...new Set(allSkills)];
        return ["Todas", ...uniqueSkills.sort()];
    }, [freelancersDB]);


    if (loading) return <div className="min-h-screen grid place-items-center">Cargando freelancers...</div>;
    if (error) return <div className="min-h-screen grid place-items-center text-red-500">{error}</div>;
    // --- Función para aplicar filtros en móvil ---
    const handleApplyMobileFilters = () => {
        setCurrentPage(1);
        setShowMobileFilters(false);
    }

    // Condición para mostrar el estado vacío
    //const showEmptyState = totalResults === 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">

            {/* ===== HERO SEARCH ===== */}
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

            {/* 2. CARRUSEL PREMIUM */}
            {<FreelancersInicio />}

            {/* ===== LAYOUT PRINCIPAL ===== */}
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

                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit lg:sticky lg:top-28 space-y-8">
                            {/* Header Desktop */}
                            <div className="hidden lg:flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                                <Filter size={18} className="text-blue-600" />
                                <h3 className="font-bold text-slate-800">Filtros</h3>
                            </div>

                            {/* Especialidad (Basado en Skills) */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Especialidad (Skills)</h3>
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

                    {/* --- GRID RESULTADOS --- */}
                    <div className="flex-1">
                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-slate-500 text-sm">
                                Se encontraron <span className="font-bold text-slate-900">{generalData.length}</span> resultados en el Catálogo General
                            </p>

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

                        {paginatedGeneralData.length > 0 ? (
                            <>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Catálogo General</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {paginatedGeneralData.map((freelancer) => (
                                        <FreelancerCard key={freelancer._id} data={freelancer} />
                                    ))}
                                </div>
                            </>
                        ) : totalResults === 0 ? (
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
                            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No encontramos resultados en el Catálogo General</h3>
                                <p className="text-slate-500">Los resultados Premium que cumplen tus filtros se muestran arriba.</p>
                            </div>
                        )}

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
import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import FreelancerCard from '../../components/Cards/FreelancerCard';
import FreelancersInicio from '../../components/SeccionesInicio/FreelancersInicio';
import { useSearchParams } from 'react-router';
import axios from 'axios';


const Freelancers = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Inicialización perezosa o directa basada en URL para evitar flash de "Todas"
    const [filterCategoriaPrincipal, setFilterCategoriaPrincipal] = useState(searchParams.get('categoria') || 'Todas');
    const [filterCategoriaEspecifica, setFilterCategoriaEspecifica] = useState('Todas');

    const [searchTerm, setSearchTerm] = useState('');

    // Sincronizar filtro con URL si cambia externamente (navegación por popstate o links)
    useEffect(() => {
        const currentCat = searchParams.get('categoria') || 'Todas';
        if (currentCat !== filterCategoriaPrincipal) {
            setFilterCategoriaPrincipal(currentCat);
            setFilterCategoriaEspecifica('Todas'); // Resetear subcategoría al cambiar categoría principal
        }
    }, [searchParams, filterCategoriaPrincipal]);

    const [filterRating, setFilterRating] = useState(0);
    const [filterTarifaMax, setFilterTarifaMax] = useState(200000);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const itemsPerPage = 12; // Ajustado a 12 según tu código

    const [freelancersDB, setFreelancersDB] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tiposServiciosDB, setTiposServiciosDB] = useState([]);

    // --- Fetch de datos (Freelancers y Tipos de Servicios) ---
    // --- Fetch de Tipos de Servicios (Solo una vez al montar) ---
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
                const res = await axios.get(`${BASE_URL}/api/types`);
                setTiposServiciosDB(res.data);
            } catch (err) {
                console.error("Error fetching types:", err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchTypes();
    }, []);

    // --- Fetch de Freelancers (Dinámico según filtros de categoría) ---
    useEffect(() => {
        const fetchFreelancers = async () => {
            setLoading(true);
            try {
                const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
                let url = `${BASE_URL}/api/users/freelancers`;

                // Lógica de Endpoints
                if (filterCategoriaEspecifica !== 'Todas') {
                    url = `${BASE_URL}/api/users/freelancers/category-specific/${encodeURIComponent(filterCategoriaEspecifica)}`;
                } else if (filterCategoriaPrincipal !== 'Todas') {
                    url = `${BASE_URL}/api/users/freelancers/category-main/${encodeURIComponent(filterCategoriaPrincipal)}`;
                }

                const res = await axios.get(url);
                setFreelancersDB(res.data);
                setLoading(false);
            } catch (err) {
                setError("Hubo un problema al cargar los freelancers. Intenta nuevamente.");
                setLoading(false);
            }
        };

        fetchFreelancers();
    }, [filterCategoriaPrincipal, filterCategoriaEspecifica]);

    // --- Extracción de Categorías Dinámicas ---
    const { categoriasPrincipales, categoriasEspecificas } = useMemo(() => {
        const principales = new Set();
        const especificas = new Set();

        // Usamos el catálogo completo de tipos de servicios
        tiposServiciosDB.forEach(tipo => {
            if (tipo.categoria_principal) {
                principales.add(tipo.categoria_principal);

                // Si hay una categoría principal seleccionada, filtramos las específicas
                if (filterCategoriaPrincipal !== 'Todas' && tipo.categoria_principal === filterCategoriaPrincipal) {
                    if (tipo.categoria) especificas.add(tipo.categoria);
                }
            }
        });

        return {
            categoriasPrincipales: ["Todas", ...Array.from(principales).sort()],
            categoriasEspecificas: ["Todas", ...Array.from(especificas).sort()]
        };
    }, [tiposServiciosDB, filterCategoriaPrincipal]);



    // --- Lógica de Filtrado ---
    const { premiumData, generalData, totalResults } = useMemo(() => {
        // 1. Filtrado
        let filtered = freelancersDB.filter(item => {
            const term = searchTerm.toLowerCase();

            // Búsqueda por texto (Nombre, Título, Descripción)
            const matchesSearch =
                (item.nombre || "").toLowerCase().includes(term) ||
                (item.apellido || "").toLowerCase().includes(term) ||
                (item.descripcion || "").toLowerCase().includes(term) ||
                (item.titulo || "").toLowerCase().includes(term);

            // Filtro por Categoría Principal y Específica (YA HECHO EN BACKEND)
            // Solo necesitamos verificar que la respuesta del backend sea consistente.
            // Eliminamos el filtrado local de categorías.
            let matchesCategoria = true;

            const ratingVal = item.rating ?? 1;
            const matchesRating = filterRating === 0 || Math.floor(ratingVal) === filterRating;
            let calculatedTariff = item.tarifa || 0;
            if (item.servicios && item.servicios.length > 0) {
                const prices = item.servicios.map(s => s.precio).filter(p => p !== undefined && p !== null);
                if (prices.length > 0) {
                    const sum = prices.reduce((acc, curr) => acc + curr, 0);
                    calculatedTariff = sum / prices.length;
                }
            }
            const matchesTarifa = calculatedTariff <= filterTarifaMax;

            return matchesSearch && matchesCategoria && matchesRating && matchesTarifa;
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

    }, [freelancersDB, searchTerm, filterCategoriaPrincipal, filterCategoriaEspecifica, filterRating, filterTarifaMax, tiposServiciosDB]);

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

    // CAMBIO: Fondo oscuro para loading/error
    if (initialLoading) return <div className="min-h-screen grid place-items-center bg-slate-950 text-white">Cargando freelancers...</div>;
    if (error) return <div className="min-h-screen grid place-items-center bg-slate-950 text-red-500">{error}</div>;

    // --- Función para aplicar filtros en móvil ---
    const handleApplyMobileFilters = () => {
        setCurrentPage(1);
        setShowMobileFilters(false);
    }

    return (
        // CAMBIO: Fondo principal oscuro (slate-950) y texto claro
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">

            {/* ===== HERO SEARCH ===== */}
            {/* CAMBIO: Header oscuro (slate-900) */}
            <div className="bg-slate-900 sticky top-0 z-30 shadow-lg shadow-black/30 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-white tracking-tight">Catálogo de Talentos</h1>
                            {/* CAMBIO: Texto subtítulo gris claro */}
                            <p className="text-sm text-slate-400">Encuentra al profesional perfecto para tu proyecto</p>
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto">
                            <div className="relative w-full lg:w-96 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                                {/* CAMBIO: Input oscuro (slate-800) */}
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, habilidad o rol..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                // CAMBIO: Botón filtro móvil oscuro
                                className="lg:hidden p-2.5 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700"
                            >
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CARRUSEL PREMIUM (Ahora recibe datos filtrados) */}
            {premiumData.length > 0 && <FreelancersInicio data={premiumData} />}

            {/* ===== LAYOUT PRINCIPAL ===== */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR FILTROS --- */}
                    {/* CAMBIO: Sidebar oscuro */}
                    <aside className={`
                        fixed inset-0 z-40 bg-slate-900 p-6 lg:p-0 lg:static lg:bg-transparent lg:z-auto lg:w-72 lg:shrink-0 
                        ${showMobileFilters ? 'flex flex-col overflow-y-auto' : 'hidden lg:block'}
                    `}>
                        {/* Header Móvil */}
                        <div className="lg:hidden flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Filtros</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-800 text-white rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* CAMBIO: Contenedor filtros oscuro */}
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md h-fit lg:sticky lg:top-28 space-y-8">
                            {/* Header Desktop */}
                            <div className="hidden lg:flex items-center gap-2 mb-5 pb-3 border-b border-slate-800">
                                <Filter size={18} className="text-blue-500" />
                                <h3 className="font-bold text-slate-200">Filtros</h3>
                            </div>

                            {/* Categoría Principal */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Categoría Principal</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {categoriasPrincipales.map(cat => (
                                        // CAMBIO: Hover oscuro
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group p-1 rounded hover:bg-slate-800/50">
                                            {/* CAMBIO: Checkbox custom oscuro */}
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${filterCategoriaPrincipal === cat ? 'bg-blue-600 border-blue-600' : 'border-slate-600 bg-slate-800'}`}>
                                                {filterCategoriaPrincipal === cat && <Check size={10} className="text-white" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="categoriaPrincipal"
                                                className="hidden"
                                                checked={filterCategoriaPrincipal === cat}
                                                onChange={() => {
                                                    setFilterCategoriaPrincipal(cat);
                                                    setFilterCategoriaEspecifica('Todas'); // Reset subcategoría
                                                    setSearchParams(cat === 'Todas' ? {} : { categoria: cat });
                                                    setCurrentPage(1);
                                                }}
                                            />
                                            {/* CAMBIO: Texto filtro (azul si activo, gris si no) */}
                                            <span className={`text-sm ${filterCategoriaPrincipal === cat ? 'text-blue-400 font-medium' : 'text-slate-400'}`}>
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Categoría Específica (Solo si hay principal seleccionada) */}
                            {filterCategoriaPrincipal !== 'Todas' && categoriasEspecificas.length > 1 && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Subcategoría</h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pl-2 border-l-2 border-slate-700"> {/* CAMBIO: Borde izquierdo oscuro */}
                                        {categoriasEspecificas.map(subCat => (
                                            <label key={subCat} className="flex items-center gap-3 cursor-pointer group p-1 rounded hover:bg-slate-800/50">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${filterCategoriaEspecifica === subCat ? 'bg-blue-600 border-blue-600' : 'border-slate-600 bg-slate-800'}`}>
                                                    {filterCategoriaEspecifica === subCat && <Check size={10} className="text-white" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="categoriaEspecifica"
                                                    className="hidden"
                                                    checked={filterCategoriaEspecifica === subCat}
                                                    onChange={() => {
                                                        setFilterCategoriaEspecifica(subCat);
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                                <span className={`text-sm ${filterCategoriaEspecifica === subCat ? 'text-blue-400 font-medium' : 'text-slate-400'}`}>
                                                    {subCat}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}



                            {/* Tarifa Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Max. $/h</label>
                                    {/* CAMBIO: Badge precio oscuro */}
                                    <span className="text-xs font-bold text-blue-400 bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded">
                                        ${filterTarifaMax.toLocaleString()}
                                    </span>
                                </div>
                                {/* CAMBIO: Slider track oscuro */}
                                <input
                                    type="range"
                                    min="0"
                                    max="200000"
                                    step="1000"
                                    value={filterTarifaMax}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setFilterTarifaMax(val === 0 ? 1 : val);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Calificación Maxima</label>
                                <div className="flex flex-col gap-1">
                                    {[5, 4, 3, 2, 1].map(stars => (
                                        <button
                                            key={stars}
                                            onClick={() => { setFilterRating(filterRating === stars ? 0 : stars); setCurrentPage(1); }}
                                            // CAMBIO: Estilos hover/active oscuros
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors w-full ${filterRating === stars ? 'bg-yellow-900/20 ring-1 ring-yellow-500/50 text-yellow-500' : 'hover:bg-slate-800 text-slate-400'}`}
                                        >
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < stars ? "fill-current" : "text-slate-700"} />
                                                ))}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* --- boton de aplicar filtros version mobile --- */}
                        {showMobileFilters && (
                            <div className="lg:hidden sticky bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 mt-auto shadow-inner">
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
                    <div className="flex-1 relative">
                        {loading && (
                            // CAMBIO: Overlay de carga oscuro semi-transparente
                            <div className="absolute inset-0 bg-slate-950/60 z-10 flex items-start justify-center pt-20 backdrop-blur-sm transition-all duration-300">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm font-medium text-blue-400">Actualizando resultados...</span>
                                </div>
                            </div>
                        )}
                        <div className={`transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
                            <div className="mb-6 flex justify-between items-center">
                                {/* CAMBIO: Texto contador claro */}
                                <p className="text-slate-400 text-sm">
                                    Se encontraron <span className="font-bold text-white">{generalData.length}</span> resultados en el Catálogo General
                                </p>

                                {generalData.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-slate-500 mr-2 hidden sm:inline">
                                            Pág {currentPage} de {totalPages}
                                        </span>
                                        {/* CAMBIO: Botones paginación oscuros */}
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-1.5 rounded-md border border-slate-700 hover:bg-slate-800 disabled:opacity-30 text-slate-400 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-1.5 rounded-md border border-slate-700 hover:bg-slate-800 disabled:opacity-30 text-slate-400 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {paginatedGeneralData.length > 0 ? (
                                <>
                                    <h2 className="text-xl font-bold text-white mb-4">Catálogo General</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                        {paginatedGeneralData.map((freelancer) => (
                                            <FreelancerCard key={freelancer._id} data={freelancer} />
                                        ))}
                                    </div>
                                </>
                            ) : totalResults === 0 ? (
                                // CAMBIO: Estado vacío oscuro
                                <div className="text-center py-24 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
                                        <Search className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">No encontramos resultados</h3>
                                    <p className="text-slate-500 mb-6">Intenta ajustar tus filtros o busca con otros términos.</p>

                                    <button
                                        onClick={() => { setSearchTerm(""); setFilterCategoriaPrincipal("Todas"); setFilterCategoriaEspecifica("Todas"); setFilterRating(0); setFilterTarifaMax(200000); }}
                                        className="text-blue-400 font-semibold hover:underline text-sm"
                                    >
                                        Limpiar todos los filtros
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
                                        <Search className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">No encontramos resultados en el Catálogo General</h3>
                                    <p className="text-slate-500">Los resultados Premium que cumplen tus filtros se muestran arriba.</p>
                                </div>
                            )}

                            {totalPages > 1 && paginatedGeneralData.length > 0 && (
                                <div className="mt-12 flex justify-center">
                                    {/* CAMBIO: Paginación inferior oscura */}
                                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl shadow-lg shadow-black/20 border border-slate-800">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={16} /> Anterior
                                        </button>

                                        <div className="hidden sm:flex items-center px-4 text-sm font-medium text-slate-400">
                                            Página {currentPage} de {totalPages}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        </div>
    );
};

export default Freelancers;
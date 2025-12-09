import { useState, useEffect } from 'react';
import { Briefcase, Star, Globe } from 'lucide-react';
import { NavLink } from 'react-router';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';

const getAvatarUrl = (nombre, apellido) => {
    return `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=random&color=fff&size=128&bold=true`;
};

const FreelancerCard = ({ data }) => {
    const { BASE_URL } = useAuth();
    const avatar = getAvatarUrl(data.nombre, data.apellido);

    // --- ESTADOS PARA DATOS ENRIQUECIDOS ---
    const [rangoPrecios, setRangoPrecios] = useState(null);
    const [etiquetasServicios, setEtiquetasServicios] = useState([]);
    const [loadingServicios, setLoadingServicios] = useState(true);

    // Datos directos del usuario
    const titulo = data.titulo || "Freelancer";
    const rating = data.rating !== undefined ? data.rating : 1;
    const isPremium = data.plan === 'premium';
    const isDisponible = data.isDisponible !== undefined ? data.isDisponible : true;
    const descripcion = data.descripcion || "Sin descripción disponible.";
    const idiomas = ["Español"];

    // --- EFECTO: Obtener Servicios ---
    useEffect(() => {
        const fetchServicios = async () => {
            if (!data._id || !BASE_URL) return;

            try {
                const response = await axios.get(`${BASE_URL}/api/servicios/freelancer/${data._id}`);
                const servicios = response.data;

                if (servicios && servicios.length > 0) {
                    // 1. Calcular PROMEDIO de Precios (CAMBIO SOLICITADO)
                    const precios = servicios.map(s => s.precio).filter(p => p !== undefined && p !== null);

                    if (precios.length > 0) {
                        // Sumar todos los precios
                        const sumaTotal = precios.reduce((acc, curr) => acc + curr, 0);
                        // Calcular promedio
                        const promedio = sumaTotal / precios.length;

                        const format = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

                        setRangoPrecios(`${format(promedio)}/h`);
                    }

                    // 2. Extraer Etiquetas (Tipos de Servicio)
                    const tiposUnicos = new Set();
                    servicios.forEach(servicio => {
                        if (servicio.tipoServicio && servicio.tipoServicio.nombre) {
                            tiposUnicos.add(servicio.tipoServicio.nombre);
                        }
                    });
                    setEtiquetasServicios(Array.from(tiposUnicos));
                } else {
                    // Fallback
                    if (data.tarifa) {
                        const format = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
                        setRangoPrecios(`${format(data.tarifa)}/h`);
                    }
                    if (data.skills) setEtiquetasServicios(data.skills);
                }
            } catch (error) {
                if (data.tarifa) {
                    const format = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
                    setRangoPrecios(`${format(data.tarifa)}/h`);
                }
                if (data.skills) setEtiquetasServicios(data.skills);
            } finally {
                setLoadingServicios(false);
            }
        };

        fetchServicios();
    }, [data._id, BASE_URL, data.tarifa, data.skills]);


    return (
        // CARD DARK MODE
        <div className="bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">

            {/* Header */}
            <div className="p-5 border-b border-slate-700/50">
                <div className="flex items-start gap-4">
                    <img
                        src={avatar}
                        alt={`${data.nombre} ${data.apellido}`}
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-600 shadow-sm bg-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-white truncate group-hover:text-blue-400 transition-colors">
                            {data.nombre} {data.apellido}
                        </h3>
                        <div className="flex items-center gap-1 text-blue-400 text-sm font-medium mb-1">
                            <Briefcase size={14} />
                            <span className="truncate">{titulo}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            {isPremium && (
                                <span className="text-yellow-500 mr-1" title="Perfil Premium">⭐</span>
                            )}
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={i < Math.floor(rating) ? "fill-current" : "text-slate-600"} />
                                ))}
                            </div>
                            <span className="text-xs text-slate-400 ml-1">({Number(rating).toFixed(1)})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cuerpo */}
            <div className="p-5 flex-1 flex flex-col gap-4">
                <p className="text-sm text-slate-300 line-clamp-3 italic leading-relaxed">
                    "{descripcion}"
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {loadingServicios ? (
                        <span className="text-xs text-slate-500 animate-pulse">Cargando...</span>
                    ) : etiquetasServicios.length > 0 ? (
                        etiquetasServicios.slice(0, 3).map((srv, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-700 text-slate-300 text-[10px] uppercase font-bold rounded-md tracking-wide border border-slate-600">
                                {srv}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-slate-500 italic">Sin etiquetas</span>
                    )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-1">
                        <Globe size={14} /> {idiomas.join(", ")}
                    </div>
                    {isDisponible && (
                        <div className="flex items-center gap-1 text-emerald-400 font-medium ml-auto">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Disponible
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-slate-900/50 border-t border-slate-700 flex items-center justify-between">
                <div>
                    {/* Texto ajustado para reflejar que es promedio */}
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tarifa Promedio</p>
                    <p className="text-lg font-bold text-white">
                        {loadingServicios ? (
                            <span className="text-sm font-normal text-slate-600">...</span>
                        ) : (
                            rangoPrecios || "$0/h"
                        )}
                    </p>
                </div>
                <NavLink
                    to={`/perfil/${data._id}`}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
                >
                    Ver Perfil
                </NavLink>
            </div>
        </div>
    );
};

export default FreelancerCard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import BotonPrincipal from "../Botones/BotonPrincipal"

/**
 * @component
 * @description Tarjeta de presentación de un Freelancer para la sección de inicio.
 * Obtiene dinámicamente los servicios para mostrar precios y etiquetas reales.
 * También obtiene las opiniones para calcular el rating promedio.
 */
const FreelancerInicioCard = ({ data }) => {
    const { BASE_URL } = useAuth();

    // Estado local para los datos enriquecidos
    const [rangoPrecios, setRangoPrecios] = useState("$0/hora");
    const [etiquetasServicios, setEtiquetasServicios] = useState([]);
    const [loadingServicios, setLoadingServicios] = useState(true);

    // Estado para el rating real
    const [ratingCalculado, setRatingCalculado] = useState(0);
    const [numReviews, setNumReviews] = useState(0);

    // 💡 MAPEO DE PROPIEDADES BÁSICAS
    const nombreCompleto = `${data.nombre || ''} ${data.apellido || ''}`.trim();
    const descripcionCompleta = data.descripcion || 'Especialista de desarrollo de software.';
    const especialidadPrincipal = descripcionCompleta.split('.')[0] + (descripcionCompleta.includes('.') ? '.' : '...');

    // EFECTO: Obtener servicios y opiniones
    useEffect(() => {
        const fetchData = async () => {
            if (!data._id || !BASE_URL) return;

            try {
                // 1. Fetch Servicios
                const serviciosRes = await axios.get(`${BASE_URL}/api/servicios/freelancer/${data._id}`);
                const servicios = serviciosRes.data;

                if (servicios && servicios.length > 0) {
                    // Calcular Rango de Precios
                    const precios = servicios.map(s => s.precio).filter(p => p !== undefined && p !== null);
                    if (precios.length > 0) {
                        const minPrecio = Math.min(...precios);
                        const maxPrecio = Math.max(...precios);
                        const format = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

                        if (minPrecio === maxPrecio) {
                            setRangoPrecios(`${format(minPrecio)}/h`);
                        } else {
                            setRangoPrecios(`${format(minPrecio)} ~ ${format(maxPrecio)}/h`);
                        }
                    }

                    // Extraer Etiquetas
                    const tiposUnicos = new Set();
                    servicios.forEach(servicio => {
                        if (servicio.tipoServicio && servicio.tipoServicio.nombre) {
                            tiposUnicos.add(servicio.tipoServicio.nombre);
                        }
                    });
                    setEtiquetasServicios(Array.from(tiposUnicos));
                } else {
                    // Fallbacks
                    if (data.tarifa) {
                        const format = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
                        setRangoPrecios(`${format(data.tarifa)}/h`);
                    }
                    if (data.skills) setEtiquetasServicios(data.skills);
                }

                // 2. Fetch Opiniones (Para el rating)
                try {
                    const opinionesRes = await axios.get(`${BASE_URL}/api/opinions/recibidas/${data._id}`);
                    const opiniones = opinionesRes.data;

                    if (opiniones && opiniones.length > 0) {
                        setNumReviews(opiniones.length);
                        // Asumimos que la opinión tiene 'calificacion' o 'puntuacion'
                        const suma = opiniones.reduce((acc, curr) => acc + (curr.calificacion || curr.puntuacion || 0), 0);
                        const promedio = suma / opiniones.length;
                        setRatingCalculado(promedio.toFixed(1));
                    } else {
                        setNumReviews(0);
                        setRatingCalculado(data.rating || 0); // Fallback a data.rating si existe, sino 0
                    }
                } catch (opErr) {
                    console.warn("Error cargando opiniones:", opErr);
                    setRatingCalculado(data.rating || 0);
                }

            } catch (error) {
                console.error("Error cargando datos de tarjeta:", error);
                // Fallbacks generales
                if (data.tarifa) {
                    const format = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
                    setRangoPrecios(`${format(data.tarifa)}/h`);
                }
                if (data.skills) setEtiquetasServicios(data.skills);
                setRatingCalculado(data.rating || 0);
            } finally {
                setLoadingServicios(false);
            }
        };

        fetchData();
    }, [data._id, BASE_URL, data.tarifa, data.skills, data.rating]);


    return (
        // Tarjeta Contenedora (<li>)
        <li className={`
            /* Estilos Base de la Tarjeta */
            bg-gray-800 
            rounded-xl 
            text-white 
            p-4 
            shadow-lg 
            text-center 
            flex-col h-full 
            flex

            /* Responsividad: Ajustes de la tarjeta */
            sm:p-6 
            md:shadow-xl 
            lg:p-8 
        `}>

            {/* Sección Superior: Imagen y Datos Personales */}
            <div className="flex items-center space-x-4 mb-4">

                {/* Foto de Perfil y Verificación */}
                <div className={`
                    relative 
                    w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                    rounded-full overflow-hidden 
                    border-2 border-blue-500
                    shrink-0
                `}>
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-3xl sm:text-4xl text-gray-400">
                        👤
                    </div>
                    <span className="absolute bottom-0 right-0 block w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-800"></span>
                </div>

                {/* Nombre y Especialidad */}
                <div className="overflow-hidden">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-left truncate">{nombreCompleto || 'Freelancer'}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 text-left truncate">{especialidadPrincipal}</p>
                </div>
            </div>

            {/* Sección de Descripción */}
            <div className="mb-4 text-xs sm:text-sm text-gray-400 text-left">
                <p className="flex items-center">
                    ⭐ <span className="text-yellow-400 mr-1 ml-1 font-semibold">{ratingCalculado > 0 ? ratingCalculado : "N/A"}</span> ({numReviews})
                </p>
            </div>

            {/* Contenedor FLEX-GROW */}
            <div className="flex flex-col grow">

                {/* Descripción: Altura fija para mantener simetría en la línea divisoria */}
                <p className="text-gray-300 leading-relaxed text-left text-sm sm:text-base mb-4 line-clamp-3 h-[4.5rem]">
                    {descripcionCompleta}
                </p>

                {/* Sección de Habilidades (Tags) */}
                {/* Quitamos mt-auto para que la línea border-t se quede fija debajo de la descripción */}
                <div className="flex flex-wrap items-center pt-2 border-t border-gray-700 mb-4 min-h-[40px]">
                    {loadingServicios ? (
                        <span className="text-xs text-gray-500 animate-pulse">Cargando etiquetas...</span>
                    ) : (
                        <>
                            {etiquetasServicios.slice(0, 3).map((etiqueta, index) => (
                                <span
                                    key={etiqueta || index}
                                    className="bg-gray-700 text-xs sm:text-sm text-blue-300 px-2 py-1 rounded-full mr-2 mb-2 truncate max-w-full"
                                >
                                    {etiqueta}
                                </span>
                            ))}

                            {etiquetasServicios.length > 3 && (
                                <span className="bg-blue-500 text-xs sm:text-sm px-2 py-1 rounded-full mr-2 mb-2">
                                    +{etiquetasServicios.length - 3}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Sección de Tarifa y Botón */}
            <div className="mt-auto pt-4 border-t border-gray-700/50">
                <p className="text-lg sm:text-xl font-extrabold text-blue-400 mb-3 truncate">
                    {loadingServicios ? (
                        <span className="text-sm text-gray-500 animate-pulse">Calculando...</span>
                    ) : (
                        rangoPrecios
                    )}
                </p>
                <BotonPrincipal text={'Ver Perfil'} />
            </div>
        </li>
    )
}

export default FreelancerInicioCard;
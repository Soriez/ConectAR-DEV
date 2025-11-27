import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';
import { useAuth } from '../../context/useAuth'; 

import TextoGray from '../Textos/TextoGray'
import TextoSubtitulo from '../Textos/TextoSubtitulo'
import FreelancerCard from '../Cards/FreelancerInicioCard' 
import BotonSecundario from '../Botones/BotonSecundario'

import { ChevronLeft, ChevronRight } from 'lucide-react'; 

// El endpoint base para obtener freelancers.
const ENDPOINT_BASE_PATH = '/api/users/freelancers'; 
// 💡 CLAVE: SOLICITAMOS SOLO A LOS PREMIUM Y DISPONIBLES
// NOTA: Asumiendo que has corregido el nombre del parámetro de 'isAvailable' a 'isDisponible'
const FILTERS_QUERY = '?isPremium=true&isDisponible=true';


const FreelancersInicio = () => {
    // 1. OBTENER BASE_URL DEL CONTEXTO
    const { BASE_URL } = useAuth(); 

    // ESTADO
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    const scrollContainerRef = useRef(null);
    const scrollAmount = 350;

    // 2. EFECTO: Obtención de datos con axios y try/catch
    useEffect(() => {
        const fetchFreelancers = async () => {
            setLoading(true);
            setError(null);
            
            if (!BASE_URL) return;

            // CONSTRUIMOS LA URL COMPLETA CON EL FILTRO
            const urlCompleta = `${BASE_URL}${ENDPOINT_BASE_PATH}${FILTERS_QUERY}`;

            try {
                const response = await axios.get(urlCompleta); 
                
                // ⭐ CORRECCIÓN APLICADA: Hacemos la verificación de la respuesta más robusta
                if (Array.isArray(response.data)) {
                    setFreelancers(response.data);
                } else if (!response.data || typeof response.data === 'object') {
                    // Si el backend devuelve null, {}, o cualquier cosa que no sea un array (pero no es un error de estado),
                    // asumimos que no hay resultados y establecemos un array vacío.
                    setFreelancers([]); 
                } 
                else {
                    // Si es un formato totalmente inesperado (ej. un string 'OK'), lanzamos el error
                    throw new Error("El backend devolvió un formato de datos inesperado o corrupto.");
                }

            } catch (err) {
                // Aquí se manejan errores de red (4xx o 5xx) o errores lanzados en el bloque 'try'
                const errorMsg = err.response?.data?.message || 'Error de conexión.';
                console.error("Error al obtener los profesionales:", err);
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        if (BASE_URL) {
            fetchFreelancers();
        } else {
            // Manejo de espera si el contexto no carga
            const timer = setTimeout(() => {
                 if(!BASE_URL) setLoading(false); 
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [BASE_URL]);
    
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ 
                left: direction * scrollAmount, 
                behavior: 'smooth' 
         });
        }
    };
    
    // --- RENDERIZADO ---
    
    if (loading) {
        return (
            <section className='py-12 sm:py-16 md:py-20 text-center'>
                <TextoSubtitulo text={'Cargando Freelancers...'}/>
                <p className="text-gray-400 mt-4">Buscando talento...</p>
            </section>
        );
    }
    
    if (error) {
        return (
            <section className='py-12 sm:py-16 md:py-20 text-center'>
                <TextoSubtitulo text={'Hubo un problema'} className="text-red-500"/>
                <p className="text-red-400 mt-4">No pudimos cargar la lista de profesionales. ({error})</p>
            </section>
        );
    }
    
    if (!loading && freelancers.length === 0) {
         return (
            <section className='py-12 sm:py-16 md:py-20 text-center'>
                <TextoSubtitulo text={'Sin Freelancers Destacados'}/>
                <TextoGray text={'Aún no hay profesionales Premium y Disponibles registrados.'} className="max-w-3xl mx-auto mt-2 text-base sm:text-lg" />
            </section>
        );
    }
    
    return (
        <section className='py-12 sm:py-16 md:py-20'>
            <div className='container mx-auto text-center'>
 
            <div className='px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12'>
                <TextoSubtitulo text={'Freelancers Destacados (Premium)'}/>
                    <TextoGray 
                        text={'Conocé algunos de los profesionales Argentinos más talentosos, Premium y Disponibles de nuestra plataforma.'}
                        className="max-w-3xl mx-auto mt-2 text-base sm:text-lg" 
                    />
                </div>

                <div className='relative overflow-hidden'>
 
                {/* Botón Izquierdo */}
                <button
                    onClick={() => scroll(-1)}
                    className={`hidden md:flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-blue-600 opacity-80 hover:opacity-100 transition-all`}
                    aria-label="Anterior"
                 >
                    <ChevronLeft size={24} />
                </button>

                {/* CONTENEDOR DE TARJETAS */}
                <div 
                    ref={scrollContainerRef}
                    className={`
                        flex 
                        overflow-x-auto 
                        scrollbar-hide
                        w-full 
                        scroll-smooth 
                        snap-x snap-mandatory 
                        gap-6 
                        pb-4
                        px-4 sm:px-6 lg:px-8 
                    `}
                >
                    {freelancers.map((freelancer) => (
                        <div 
                            key={freelancer._id} 
                            className={`
                                shrink-0
                                snap-center md:snap-start
                                w-[85vw]
                                sm:w-[350px] /* Ancho fijo para que se vean varias */
                            `}
                        >
                            <FreelancerCard data={freelancer}/>
                        </div>
                    ))}
                </div> 

                {/* Botón Derecho */}
                <button
                    onClick={() => scroll(1)}
                    className={`hidden md:flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-blue-600 opacity-80 hover:opacity-100 transition-all`}
                    aria-label="Siguiente"
                >
                    <ChevronRight size={24} />
                </button>

             </div> 

             <div className='mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8'>
                 <BotonSecundario 
                    link={'/freelancers'}
                     text={'Ver Todos los Freelancers'}/>
                </div>
             </div>
        </section>
    );
}

export default FreelancersInicio;
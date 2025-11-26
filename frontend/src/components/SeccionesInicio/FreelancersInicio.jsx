import {useState, useEffect,  useRef } from 'react'; // Importamos useRef para la navegación con botones
import axios from 'axios';
import { useAuth } from '../../context/useAuth'; // Subimos un nivel más, de 'SeccionesInicio' a 'src'

import TextoGray from '../Textos/TextoGray'
import TextoSubtitulo from '../Textos/TextoSubtitulo'
//import { freelancersDestacadosData } from '../../constants/item-freelancers-cards'
import FreelancerCard from '../Cards/FreelancerInicioCard'
import BotonSecundario from '../Botones/BotonSecundario'

import { ChevronLeft, ChevronRight } from 'lucide-react'; 

// El endpoint para obtener freelancers.
const ENDPOINT_PATH = '/api/users/freelancers'; 

/**
* @component
* @description Sección de inicio que muestra un listado de Freelancers Destacados dinámicamente.
* @returns {JSX.Element} El elemento Section.
*/

const FreelancersInicio = () => {
    // 1. OBTENER BASE_URL DEL CONTEXTO
    const { BASE_URL } = useAuth(); // Esto contendrá 'http://localhost:5000'

    // ESTADO: Almacenará los datos de la API y el estado de la carga
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
            
            // Construimos la URL completa: BASE_URL + ENDPOINT_PATH
            const urlCompleta = `${BASE_URL}${ENDPOINT_PATH}`;

            try {
                // Hacemos la llamada GET al backend
                const response = await axios.get(urlCompleta); 
                
                // Aseguramos que la respuesta es un array antes de setear el estado
                if (Array.isArray(response.data)) {
                    setFreelancers(response.data);
                } else {
                    // Si el backend no devuelve un array, forzamos un error
                    throw new Error("El backend devolvió un formato de datos inesperado.");
                }

            } catch (err) {
                // Manejo de errores de red o errores lanzados por el backend (4xx, 5xx)
                const errorMsg = err.response?.data?.message || 'Error de red o conexión con el servidor.';
                console.error("Error al obtener los profesionales:", err);
                // Si el error es 404, significa que la ruta del backend no existe
                if (err.response && err.response.status === 404) {
                    setError(`Error 404: La ruta del backend (${ENDPOINT_PATH}) no existe. Verifica con tu compañera.`);
                } else {
                    setError(`No se pudieron cargar los datos: ${errorMsg}`);
                }
                
            } finally {
                setLoading(false);
            }
        };

        // Solo intentamos la llamada si BASE_URL está disponible
        if (BASE_URL) {
            fetchFreelancers();
        } else {
            // Esto puede pasar si el contexto de auth no se ha cargado aún
            console.warn("BASE_URL no disponible. Retrasando la carga de freelancers.");
            setLoading(false);
        }
    }, [BASE_URL]); // Dependencia BASE_URL: se re-ejecuta si el contexto de Auth carga tarde
    
    // Función para el scroll del carrusel (sin cambios)
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ 
                left: direction * scrollAmount, 
                    behavior: 'smooth' 
         });
        }
    };
    
    // --- Renderizado de Carga y Errores ---
    
    if (loading) {
        return (
            <section className='py-12 sm:py-16 md:py-20 text-center'>
                <TextoSubtitulo text={'Cargando Freelancers...'}/>
                <TextoGray text={'Conectando con la base de datos de talentos...'} className="max-w-3xl mx-auto mt-2 text-base sm:text-lg" />
            </section>
        );
    }
    
    if (error) {
        return (
            <section className='py-12 sm:py-16 md:py-20 text-center'>
                <TextoSubtitulo text={'Error de Conexión'} className="text-red-600"/>
                <TextoGray text={error} className="max-w-3xl mx-auto mt-2 text-base sm:text-lg text-red-500" />
            </section>
        );
    }
    
    if (freelancers.length === 0) {
         return (
            <section className='py-12 sm:py-16 md:py-20 text-center'>
                <TextoSubtitulo text={'Sin Freelancers Destacados'}/>
                <TextoGray text={'Aún no hay profesionales registrados como Freelancer.'} className="max-w-3xl mx-auto mt-2 text-base sm:text-lg" />
            </section>
        );
    }
    
    return (
    //Contenedor principal
        <section className='py-12 sm:py-16 md:py-20'>
            <div className='container mx-auto text-center'>
 
        {/* Cabecera de la Sección, Título y Subtitulo */}
            <div className='px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12'>
                <TextoSubtitulo text={'Freelancers Destacados'}/>
                    <TextoGray 
                        text={'Conocé algunos de los profesionales Argentinos más talentosos de nuestra plataforma. Todos verificados y con experiencia comprobada.'}
                        className="max-w-3xl mx-auto mt-2 text-base sm:text-lg" 
                    />
                </div>

        {/* CONTENEDOR PRINCIPAL DEL CARRUSEL Y BOTONES (RELATIVE) */}
                <div className='relative overflow-hidden'>
 
    {/* Botón de Desplazamiento Izquierdo */}
                <button
                    onClick={() => scroll(-1)}
                    className={`
                    hidden md:flex items-center justify-center 
                    absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 md:translate-x-0
                    z-30 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg transition-all
                    hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50
                    opacity-80 hover:opacity-100
                `}
                    aria-label="Anterior"
                 >
                <ChevronLeft size={24} />
            </button>

        {/* CONTENEDOR SCROLLABLE REAL, cards de freelancers */}
                    <div 
                        ref={scrollContainerRef}
                        className={`
                            flex 
                            overflow-x-scroll overflow-y-hidden
                            scrollbar-hide
                            w-full 
                            scroll-smooth 
                            snap-x snap-mandatory 
                            gap-6 sm:gap-8 lg:gap-10
                            pb-4
                        /* Padding: Asegura que el contenido se vea bien en los bordes*/
                            px-4 sm:px-6 lg:px-8 
                        min-w-0
            `}
            >
            {
            // 3. Mapeo de los freelancers cargados dinámicamente
                        freelancers.map( (freelancer) => (
                                <div 
                                    key={freelancer._id} // Usamos _id de MongoDB
                                    className={`
                                        shrink-0
                                        snap-start
                                        /* Dimensionamiento responsivo de la tarjeta */
                                        w-[85vw]
                                        sm:w-[45vw]
                                        lg:w-[350px]
                                        max-w-xs
            `}
            >
                <FreelancerCard data={freelancer}/>
                </div>
                ))
                }
            </div> /* Fin del Contenedor Scrollable */


            {/* Botón de Desplazamiento Derecho */}
            <button
                onClick={() => scroll(1)}
                className={`
                         hidden md:flex items-center justify-center 
                            absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 md:translate-x-0
                            z-30 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg transition-all
                             hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50
                            opacity-80 hover:opacity-100
                            `}
                            aria-label="Siguiente"
        >
            <ChevronRight size={24} />
         </button>

         </div> 


                {/* Botón de ver a todos los freelancers */}
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
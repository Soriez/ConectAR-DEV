import { useRef } from 'react'; // Importamos useRef para la navegación con botones
import TextoGray from '../Textos/TextoGray'
import TextoSubtitulo from '../Textos/TextoSubtitulo'
import { freelancersDestacadosData } from '../../constants/item-freelancers-cards'
import FreelancerCard from '../Cards/FreelancerCard'
import BotonSecundario from '../Botones/BotonSecundario'
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

/**
 * @component
 * @description Sección de inicio que muestra un listado de Freelancers Destacados en un CARRUSEL horizontal responsivo.
 * Se han aplicado correcciones para evitar el error de anidación <li> y se ha habilitado la navegación con botones.
 * @returns {JSX.Element} El elemento Section.
 */
const FreelancersInicio = () => {
    // Referencia al contenedor scrollable para el control de los botones
    const scrollContainerRef = useRef(null);
    const scrollAmount = 350; // ! Ajustar este valor si el ancho de la tarjeta es diferente

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ 
                left: direction * scrollAmount, 
                behavior: 'smooth' 
            });
        }
    }; // Scroll vertical en versión desktop
    
    return (
        //Contenedor principal
        <section className='bg-gray-50 py-12 sm:py-16 md:py-20'>
            <div className='container mx-auto text-center'>
                
                {/* Cabecera de la Sección, Título y Subtitulo */}
                <div className='px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12'>
                    <TextoSubtitulo text={'Freelancers Destacados'}/>
                    <TextoGray 
                        text={'Conocé algunos de los profesionales Argentinos más talentosos de nuestra plataforma. Todos verificados y con experiencia comprobada.'}
                        className="max-w-3xl mx-auto mt-2 text-base sm:text-lg" 
                    />
                </div>

                {/* CONTENEDOR PRINCIPAL DEL CARRUSEL Y BOTONES (RELATIVE) 
                    CLAVE: overflow-x-hidden para ocultar la barra de scroll externa
                */}
                <div className='relative overflow-hidden'>
                    
                    {/* Botón de Desplazamiento Izquierdo (Visible en md+ / Desktop) */}
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
                        ref={scrollContainerRef} // CLAVE: Referencia para que las flechas funcionen
                        className={`
                            flex 
                            overflow-x-scroll overflow-y-hidden                   /* Habilita el desplazamiento horizontal */
                            scrollbar-hide                                        /* CLAVE: Oculta la barra de scroll nativa */
                            w-full 
                            scroll-smooth                                         /* Desplazamiento suave con los botones */
                            snap-x snap-mandatory 
                            gap-6 sm:gap-8 lg:gap-10
                            pb-4                                                  
                            
                            /* Padding: Asegura que el contenido se vea bien en los bordes */
                            px-4 sm:px-6 lg:px-8 
                            
                            min-w-0
                        `}
                    >
                        {
                            // Mapeo del contenido. 
                            freelancersDestacadosData.map( (freelancer) => (
                                <div 
                                    key={freelancer.id}
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
                    </div> {/* Fin del Contenedor Scrollable */}
                    
                    {/* Botón de Desplazamiento Derecho (Visible en md+ / Desktop) */}
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

                </div> {/* Fin del Contenedor Relative */}


                {/* Botón de ver a todos los freelancers */}
                <div className='mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8'>
                    <BotonSecundario text={'Ver Todos los Freelancers'}/>
                </div>
            </div>
        </section>
    )
}

export default FreelancersInicio
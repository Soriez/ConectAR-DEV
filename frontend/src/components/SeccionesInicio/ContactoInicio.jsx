import TextoGray from '../Textos/TextoGray';
import { pasosData } from '../../constants/pasos-data'; 
import PasoCard from '../PasoCard';
import BotonPrincipal from '../Botones/BotonPrincipal';

/**
 * @component
 * @description Sección de Pasos y Beneficios (Versión Dark Refinada).
 * Se eliminaron artefactos visuales (líneas blancas) y se mejoró el contraste (pop).
 */
const ContactoInicio = () => {
    return (
        <section className='py-20 md:py-28 bg-slate-900 relative overflow-hidden' id='como-funciona'>
            
            {/* Decoración de fondo suave (Glow central) para dar profundidad */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>

            <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
                
              {/* 1. Título y Descripción (Legible) */}
                <div className='mb-16 max-w-3xl mx-auto'>
                    <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight'>
                        ¿Cómo Funciona <span className="text-sky-400">ConectAR-Dev?</span>
                    </h2>
                    
                    {/* CAMBIO: Usamos <p> con color explícito para corregir la ilegibilidad de la imagen 1 */}
                    <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
                        Un proceso transparente diseñado para conectar empresas con talento IT verificado en tiempo récord.
                    </p>
                </div>

                {/* 2. Contenedor de la Cuadrícula de Pasos */}
                <div className='relative max-w-7xl mx-auto mb-20'>
                    {/* Mapeo de los pasos */}
                    <ul className={`
                        grid 
                        gap-8 sm:gap-12 
                        grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                        relative z-10 
                    `}>
                        {pasosData.map((paso) => (
                            // Nota: Asegúrate de que PasoCard tenga estilos transparentes o dark para integrarse bien
                            <div key={paso.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                                <PasoCard paso={paso} />
                            </div>
                        ))}
                    </ul>
                </div>
                
                {/* 3. Card de Beneficios/Estadísticas (Rediseñada Elegantemente) */}
                <div className='max-w-5xl mx-auto'>
                    <div className='bg-linear-to-br from-slate-800 to-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl shadow-black/50 border border-slate-700/50 relative overflow-hidden'>
                        
                        {/* Borde superior brillante decorativo */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 via-sky-400 to-blue-600"></div>

                        <h4 className='text-2xl sm:text-3xl font-bold text-white mb-10'>
                            ¿Por qué elegir ConectAR-Dev?
                        </h4>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center mb-10'>
                            
                            {/* Beneficio 1 */}
                            <div className="flex flex-col items-center group">
                                <span className='text-5xl font-black text-blue-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform duration-300'>
                                    100%
                                </span>
                                <p className='text-base text-slate-300 font-medium uppercase tracking-wide'>
                                    Talento Verificado
                                </p>
                            </div>
                            
                            {/* Beneficio 2 */}
                            <div className="flex flex-col items-center group relative">
                                {/* Separadores sutiles solo en desktop */}
                                <div className="hidden md:block absolute left-0 top-1/4 h-1/2 w-px bg-slate-700"></div>
                                <div className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-slate-700"></div>
                                
                                <span className='text-5xl font-black text-yellow-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform duration-300'>
                                    IT
                                </span>
                                <p className='text-base text-slate-300 font-medium uppercase tracking-wide'>
                                    Especialización Pura
                                </p>
                            </div>

                            {/* Beneficio 3 */}
                            <div className="flex flex-col items-center group">
                                <span className='text-5xl mb-2 drop-shadow-md grayscale-0 group-hover:scale-110 transition-transform duration-300'>
                                    ⭐⭐⭐
                                </span>
                                <p className='text-base text-slate-300 font-medium uppercase tracking-wide'>
                                    Calidad Argentina
                                </p>
                            </div>
                        </div>

                        <div className='pt-4'>
                            <BotonPrincipal 
                                link={'/contacto'}
                                text={'¿Tenés dudas? Consultanos →'}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default ContactoInicio;
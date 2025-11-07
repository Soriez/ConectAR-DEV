import TextoGray from '../Textos/TextoGray';
import { pasosData } from '../../constants/pasos-data'; // Importa la constante de datos
import PasoCard from '../PasoCard';
import BotonPrincipal from '../Botones/BotonPrincipal';


/**
 * @component
 * @description Sección de Pasos y Beneficios.
 * Muestra el proceso de trabajo en 4 pasos y destaca los valores de la plataforma.
 * @returns {JSX.Element} El elemento Section.
 */
const ContactoInicio = () => {
    return (
        // Sección principal con fondo claro y padding vertical responsivo
        <section className='py-16 sm:py-20 md:py-24' id='como-funciona'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                
                {/* 1. Título y Subtítulo centrales de la sección*/}
                <div className='mb-12 sm:mb-16 max-w-4xl mx-auto'>
                    <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2'>
                        ¿Cómo Funciona ConectAR-Dev?
                    </h2>
                    <TextoGray 
                        text={'Un proceso simple y transparente para conectar empresas con los mejores freelancers argentinos del área IT.'}
                        className="text-base sm:text-lg text-gray-600"
                    />
                </div>

                {/* 2. Contenedor de la Cuadrícula de Pasos */}
                <div className='relative max-w-7xl mx-auto'>
                    
                    {/* Líneas de Conexión (Solo visible en desktop) */}
                        {/* Líneas horizontales de conexión entre tarjetas */}
                    <div className='hidden lg:block absolute inset-0'>
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="12.5" y1="25" x2="37.5" y2="25" stroke="#D1D5DB" strokeWidth="2" />
                            <line x1="37.5" y1="25" x2="62.5" y2="25" stroke="#D1D5DB" strokeWidth="2" />
                            <line x1="62.5" y1="25" x2="87.5" y2="25" stroke="#D1D5DB" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Mapeo de los pasos */}
                    <ul className={`
                        grid 
                        gap-8 sm:gap-10 
                        
                        /* Responsividad de la Cuadrícula */
                        grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                        relative z-10 
                    `}>
                        {pasosData.map((paso) => (
                            // La función de mapeo (bucle) reside aquí
                            <PasoCard paso={paso} key={paso.id} />
                        ))}
                    </ul>

                </div>
                
                {/* 3. Bloque de Beneficios/Estadísticas (Claim Section) */}
                <div className='mt-16 sm:mt-20'>
                    <div className='max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-2xl border-t-4 border-blue-600'>
                        <h4 className='text-xl sm:text-2xl font-bold text-gray-800 mb-6'>
                            ¿Por qué elegir ConectAR-Dev?
                        </h4>
                        <div className='flex flex-col sm:flex-row justify-around items-center space-y-6 sm:space-y-0 text-center'>
                            
                            {/* Beneficio 1 */}
                            <div>
                                <p className='text-blue-600 text-3xl font-extrabold mb-1'>100%</p>
                                <p className='text-sm text-gray-600 font-medium'>Talento Argentino Verificado</p>
                            </div>
                            
                            {/* Beneficio 2 */}
                            <div>
                                <p className='text-yellow-500 text-3xl font-extrabold mb-1'>IT</p>
                                <p className='text-sm text-gray-600 font-medium'>Especialización Exclusiva en Tecnología</p>
                            </div>

                            {/* Beneficio 3 */}
                            <div>
                                <p className='text-yellow-500 text-3xl mb-1'>⭐⭐⭐</p>
                                <p className='text-sm text-gray-600 font-medium'>Calidad Mundial Argentina</p>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <BotonPrincipal 
                                link={'/contacto'}
                                text={'¿Tenés dudas? Consultanos →'}/>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default ContactoInicio;
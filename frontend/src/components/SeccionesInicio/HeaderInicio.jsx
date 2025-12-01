import { Link } from 'react-router';
import { Search, Zap, CheckCircle, ArrowRight, Star, Briefcase, UserPlus } from 'lucide-react';

/**
 * @component
 * @description Hero Section renovado con estética Dark/Premium.
 * Fusiona la lógica de navegación original con el diseño visual de alto impacto.
 */
const HeaderInicio = () => {
    return (
        <section className="relative pt-12 pb-20 lg:pt-32 lg:pb-40 overflow-hidden bg-slate-900" id='header'>
            
            {/* --- DECORACIÓN DE FONDO --- */}
            {/* Resplandor superior (Celeste patrio) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-600/10 rounded-full blur-[120px] z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* === COLUMNA IZQUIERDA: TEXTO === */}
                    <div className="text-center lg:text-left">
                        
                        {/* Badge Superior */}
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sky-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-yellow-400 mr-2 shadow-[0_0_10px_rgba(250,204,21,0.5)] animate-pulse"></span>
                            Talento 100% Argentino
                        </div>

                        {/* Título Principal */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
                            Conectá con los <br className="hidden lg:block" />
                            mejores 
                            
                            {/* --- EFECTO "SOL" DETRÁS DE DEVELOPERS --- */}
                            <span className="relative inline-block whitespace-nowrap px-2 mx-1">
                                {/* El Sol (Glow Dorado Difuso) */}
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl z-0"></span>
                                {/* El Centro del Sol (Más brillante) */}
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-400/10 rounded-full blur-lg z-0 animate-pulse"></span>
                                
                                {/* Texto Developers (Frente al sol) */}
                                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-yellow-100 to-yellow-300">
                                    Developers
                                </span>
                            </span>
                            <br className="hidden lg:block" />
                            <span className="text-sky-400">Argentinos</span>
                        </h1>
                        
                        {/* Descripción */}
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            La plataforma especializada que une Freelancers del área IT con empresas globales. Gestión segura, misma zona horaria y pasión por el código.
                        </p>

                        {/* Botones de Acción (Lógica Original con Estilo Nuevo) */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            
                            {/* Botón 1: Para Empresas (Busca Freelancers) */}
                            <Link 
                                to={'/freelancers'}
                                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-slate-900 transition-all duration-200 bg-sky-400 border border-transparent rounded-xl hover:bg-sky-300 shadow-lg shadow-sky-500/20 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-sky-400 group"
                            >
                                <span className="mr-2">Soy Empresa</span>
                                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </Link>
                            
                            {/* Botón 2: Para Freelancers (Registrarse) */}
                            <Link 
                                to={'/registrarse'}
                                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-sky-400 transition-all hover:-translate-y-1 gap-2 group"
                            >
                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-yellow-400 group-hover:bg-slate-600 transition-colors">
                                    <Zap size={14} fill="currentColor"/>
                                </div>
                                Soy Freelancer
                            </Link>
                        </div>
                        
                        {/* Social Proof (Estético) */}
                        <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-center lg:justify-start gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 shadow-sm overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="user" className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-white text-lg">4.9</span>
                                    <div className="flex text-yellow-400">
                                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">Calidad Garantizada</p>
                            </div>
                        </div>
                    </div>

                    {/* === COLUMNA DERECHA: MOCKUP CSS (Sin Imágenes Externas) === */}
                    <div className="relative mt-16 lg:mt-0 perspective-1000 hidden lg:block">
                        {/* Glow detrás del mockup */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sky-500/10 rounded-full blur-3xl -z-10"></div>
                        
                        {/* VENTANA DARK MODE */}
                        <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform rotate-y-6 rotate-x-[4deg] hover:rotate-0 transition-transform duration-700 ease-out z-10 group">
                            
                            {/* Barra de título */}
                            <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                </div>
                                <div className="flex-1 bg-slate-800 border border-slate-700 rounded-md h-6 mx-2"></div>
                            </div>
                            
                            {/* Contenido Simulado Dark */}
                            <div className="p-6 bg-slate-900 min-h-[400px]">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <div className="w-32 h-6 bg-slate-700 rounded-lg mb-2 animate-pulse"></div>
                                        <div className="w-48 h-3 bg-slate-800 rounded-md"></div>
                                    </div>
                                    <div className="w-10 h-10 bg-linear-to-br from-sky-500 to-blue-600 rounded-full shadow-lg shadow-sky-500/20 flex items-center justify-center text-white font-bold">
                                        AR
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 group-hover:border-sky-500/50 transition-colors">
                                        <div className="w-8 h-8 bg-sky-900/50 text-sky-400 rounded-lg mb-2 flex items-center justify-center font-bold">
                                            <Briefcase size={16} />
                                        </div>
                                        <div className="w-12 h-6 bg-slate-600 rounded mb-1"></div>
                                        <div className="text-xs text-slate-500">Proyectos</div>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 group-hover:border-yellow-500/50 transition-colors">
                                        <div className="w-8 h-8 bg-yellow-900/30 text-yellow-400 rounded-lg mb-2 flex items-center justify-center font-bold">$</div>
                                        <div className="w-16 h-6 bg-slate-600 rounded mb-1"></div>
                                        <div className="text-xs text-slate-500">Ahorro</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-750 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="dev" className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="w-24 h-3 bg-slate-600 rounded-full mb-1.5"></div>
                                                <div className="w-16 h-2 bg-slate-700 rounded-full"></div>
                                            </div>
                                            <div className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-bold rounded-md border border-green-900/50 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                                Disponible
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta Flotante "Verificado" */}
                        <div className="absolute top-24 -right-12 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-4 animate-bounce-slow z-20 hidden xl:block max-w-[200px]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-sky-900/50 flex items-center justify-center text-sky-400 ring-2 ring-sky-500/20">
                                    <CheckCircle size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Verificado</p>
                                    <p className="text-xs text-yellow-400">Usuario Premium</p>
                                </div>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-1">
                                <div className="w-full h-full bg-sky-400 rounded-full"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeaderInicio;
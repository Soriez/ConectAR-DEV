import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * @component
 * @description Sección principal (Hero) de la página de inicio. Muestra un título impactante, descripción y dos tarjetas de llamada a la acción.
 * Es responsivo, apilando el contenido en móvil y dividiéndolo en dos columnas en desktop (md+).
 * @returns {JSX.Element} El elemento Div principal.
 */
const HeaderInicio = () => {
  return (
    // Contenedor principal: Utiliza flex-col en móvil y grid-cols-2 en md+. Padding y centrado responsivo.
    <div className='md:grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-4 container mx-auto py-8 sm:py-16'>
        
        {/* Sección 1 / de la izquierda: Título, Descripción y CTA Cards */}
        <div className='mb-8 md:mb-0 flex flex-col justify-center items-center md:items-start text-center md:text-left'>
            
            {/* Título Principal */}
            <div className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold'>
                <p className='text-white py-1 sm:py-2 leading-tight'>Conecta con los</p>
                <span className='text-blue-500 py-1 sm:py-2 leading-tight'>mejores </span>
                <span className='text-yellow-400 py-1 sm:py-2 leading-tight'>developers</span>
                <p className='text-white py-1 sm:py-2 leading-tight'>Argentinos</p>
            </div>
            
            {/* Descripción */}
            <p className='text-gray-400 mt-4 mb-8 text-base sm:text-lg max-w-xl mx-auto md:mx-0'>
                La plataforma especializada que une Freelancers Argentinos del área IT con empresas que buscan talento nacional de calidad. Desde desarrollo web hasta inteligencia artificial.
            </p>
            
            {/* Sección de las cards con los botones de "Buscar freelancers" y "Registrate gratis" */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-lg md:max-w-none'>
                
                {/* Card 1: Para Empresas (Busca Freelancers) */}
                <div className='bg-blue-600 py-3 rounded-xl px-4 grow shadow-xl'>
                    <div className="flex text-white gap-3 items-center mb-4">
                        <FontAwesomeIcon 
                            icon={'suitcase'} 
                            className="text-yellow-200 bg-yellow-600 bg-opacity-70 p-3 rounded-lg text-xl sm:text-2xl"
                        />
                        <div className="min-w-0">
                            <h2 className="font-bold text-base sm:text-lg whitespace-nowrap overflow-hidden text-ellipsis">Empresas</h2>
                            <h3 className="text-sm">Encontrá talento IT</h3>
                        </div>
                    </div>
                    <div className="grid">
                        <button className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 transition-colors text-gray-900 font-bold rounded-lg py-2 text-base">
                            Buscar Freelancers
                        </button>
                    </div>
                </div>
                
                {/* Card 2: Para Freelancers (Registrarse) */}
                <div className='bg-yellow-300 py-3 rounded-xl px-4 grow shadow-xl'> {/* Fondo más oscuro para contraste */}
                    <div className="flex gap-3 items-center mb-4">
                        <FontAwesomeIcon 
                            icon={'users'} 
                            className="text-blue-200 bg-blue-600 bg-opacity-70 p-3 rounded-lg text-xl sm:text-2xl"
                        />
                        <div className="min-w-0">
                            <h2 className="font-bold text-base sm:text-lg whitespace-nowrap overflow-hidden text-ellipsis">Freelancers</h2>
                            <h3 className="text-sm">Ofrecé tus servicios</h3>
                        </div>
                    </div>
                    <div className="grid">
                        <button className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 transition-colors font-bold rounded-lg py-2 text-base">
                            Registrate Gratis
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
        
        {/* Sección 2 / de la derecha: Imagen */}
        <div className='hidden md:flex justify-center items-center'> {/* La imagen solo es visible en md+ */}
            {/* // TODO hacemos que en celular la imágen se vea al fondo o abajo o se deja así? */}
            <img 
                src="/public/imgs/logo.jpeg" 
                alt="Ilustración de desarrolladores argentinos" 
                className="w-full h-auto max-w-xl rounded-xl shadow-2xl"
            />
        </div>
    </div>
  )
}

export default HeaderInicio
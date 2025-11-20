import { FOOTER_DATA } from '../../constants/item-footer';

/**
 * @component
 * @description Componente de pie de página completo y responsivo, dividido en 4 columnas.
 * Ajusta su diseño de cuadrícula de 2 columnas en móviles a 4 columnas en dispositivos medianos (md).
 * @returns {JSX.Element} El elemento footer.
 */
const Footer = () => {
    // Desestructurar las columnas que tienen enlaces para mapear
    const { servicios, empresa } = FOOTER_DATA;
    // Desestructurar la info principal y contacto
    const { principal, contacto,legales } = FOOTER_DATA;

    return (
        // Contenedor principal del footer
        <footer className="bg-gray-900 text-white pt-10 pb-4 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* SECCIÓN PRINCIPAL: Múltiples Columnas */}
                <div className={`
                    /* Responsividad del Grid */
                    grid 
                    grid-cols-2                       /* Dos columnas en dispositivos pequeños y medianos */
                    md:grid-cols-4                    /* Cuatro columnas en dispositivos medianos y grandes */
                    gap-8 sm:gap-10                   /* Espacio entre columnas responsivo */
                    border-b border-gray-700 
                    pb-8 sm:pb-10                     /* Padding inferior responsivo */
                `}>
                    
                    {/* COLUMNA 1: Información Principal y Redes Sociales */}
                    <div className="col-span-2 md:col-span-1"> {/* Permite que esta columna ocupe 2 espacios en móviles para mejor legibilidad */}
                        <h3 className="text-xl sm:text-2xl font-bold mb-3">{principal.titulo}</h3>
                        <p className="text-sm sm:text-base text-blue-400 mb-3 sm:mb-4">{principal.subtitulo}</p>
                        <p className="text-sm text-gray-400 mb-4 sm:mb-6">{principal.descripcion}</p>
                        {/* Aquí iría el mapeo de principal.redes para los íconos */}
                    </div>

                    {/* COLUMNA 2: Servicios */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-4">{servicios.titulo}</h4>
                        <ul className="space-y-2">
                            {servicios.enlaces.map(link => (
                                <li key={link.id}>
                                    <a href={link.url} className="text-sm text-gray-400 hover:text-white transition-colors">
                                        {link.texto}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMNA 3: Empresa */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-4">{empresa.titulo}</h4>
                        <ul className="space-y-2">
                            {empresa.enlaces.map(link => (
                                <li key={link.id}>
                                    <a href={link.url} className="text-sm text-gray-400 hover:text-white transition-colors">
                                        {link.texto}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMNA 4: Contacto */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-4">{contacto.titulo}</h4>
                        <ul className="space-y-2 mb-4">
                            {contacto.datos.map((dato, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                                    {/* Ajuste: Aseguramos que el contenedor del dato sea clickable/visible */}
                                    <a href={dato.url || '#'} className="ml-0 hover:text-white transition-colors"> 
                                        {/* Si usas íconos, irían aquí */}
                                        {dato.valor}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {/* Bloque de Claim/Badge */}
                        <div className="p-3 sm:p-4 bg-blue-900/50 rounded-lg text-center">
                            <p className="text-yellow-400 text-lg sm:text-xl">⭐⭐⭐</p>
                            <p className="text-xs sm:text-sm font-semibold">{contacto.claim}</p>
                        </div>
                    </div>

                </div>

                {/* SECCIÓN DE COPYRIGHT Y LEGAL */}
                <div className={`
                    mt-6 sm:mt-8                       /* Margen superior responsivo */
                    flex flex-col sm:flex-row          /* Apilado en móvil, en fila en sm+ */
                    justify-between 
                    items-center 
                    text-xs sm:text-sm                 /* Tamaño de texto responsivo */
                    text-gray-500 
                    space-y-2 sm:space-y-0             /* Espacio vertical en móviles */
                `}>
                    <p className="order-2 sm:order-1">© 2025 ConectAR-Dev. Todos los derechos reservados.</p>
                    <div className="space-x-4 order-1 sm:order-2">
                        {/* Se mantiene el tamaño de texto pequeño, ideal para esta sección */}
                        <ul>
                            {legales.enlaces.map(link => (
                                <li key={link.id}>
                                    <a href={link.url} className="hover:text-white transition-colors">
                                        {link.texto}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {/* <a href="/terminos" className="hover:text-white transition-colors">Términos de Servicio</a>
                        <a href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</a>
                        <a href="/cookies" className="hover:text-white transition-colors">Cookies</a> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
// Footer.jsx
import React from 'react';
import { FOOTER_DATA } from '../../constants/item-footer';
 // Importa el archivo de constantes

const Footer = () => {
    // Desestructurar las columnas que tienen enlaces para mapear
    const { servicios, empresa } = FOOTER_DATA;
    // Desestructurar la info principal y contacto
    const { principal, contacto } = FOOTER_DATA;

    return (
        <footer className="bg-gray-800 text-white pt-10 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-10">
                    
                    {/* COLUMNA 1: Información Principal y Redes Sociales */}
                    <div>
                        <h3 className="text-xl font-bold mb-3">{principal.titulo}</h3>
                        <p className="text-sm text-blue-400 mb-4">{principal.subtitulo}</p>
                        <p className="text-sm text-gray-400 mb-4">{principal.descripcion}</p>
                        {/* Aquí iría el mapeo de principal.redes para los íconos */}
                    </div>

                    {/* COLUMNA 2: Servicios (Usa el mapeo para renderizar los enlaces) */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">{servicios.titulo}</h4>
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

                    {/* COLUMNA 3: Empresa (Usa el mapeo para renderizar los enlaces) */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">{empresa.titulo}</h4>
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
                        <h4 className="text-lg font-semibold mb-4">{contacto.titulo}</h4>
                        <ul className="space-y-2 mb-4">
                            {contacto.datos.map((dato, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-400">
                                    {/* Aquí iría el ícono si lo usas (ej. <Mail />) */}
                                    <a href={dato.url || '#'} className="ml-2 hover:text-white transition-colors">
                                        {dato.valor}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {/* Bloque de Claim/Badge */}
                        <div className="p-4 bg-blue-900/50 rounded-lg text-center">
                            <p className="text-yellow-400 text-xl">⭐⭐⭐</p>
                            <p className="text-sm font-semibold">{contacto.claim}</p>
                        </div>
                    </div>

                </div>

                {/* Sección de Copyright y Legal */}
                <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <p>© 2024 ConectAR-Dev. Todos los derechos reservados.</p>
                    <div className="space-x-4">
                        <a href="/terminos" className="hover:text-white">Términos de Servicio</a>
                        <a href="/privacidad" className="hover:text-white">Política de Privacidad</a>
                        <a href="/cookies" className="hover:text-white">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * @component
 * @description Fuerza el scroll al top (0,0) al cambiar de ruta (pathname).
 */
const ScrollToTop = () => {
    // Captura el objeto de ubicación de React Router.
    const { pathname } = useLocation();

    // Este efecto se ejecuta cada vez que 'pathname' cambia (cada navegación).
    useEffect(() => {
        // Mueve la ventana al tope de la página (0, 0)
        window.scrollTo(0, 0);
    }, [pathname]); // Dependencia: se ejecuta al cambiar de ruta.

    return null; // Este componente no renderiza nada visible.
};

export default ScrollToTop;
import { NavLink } from "react-router"

/**
 * @component
 * @description Ítem individual de navegación para la barra. También maneja la lógica de cerrar el menú en móvil.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.link - Objeto con 'href' y 'name' del enlace.
 * @param {boolean} props.isMobile - Indica si el componente está renderizado en el layout móvil (true) o desktop (false).
 * @param {function} props.setOpen - Función para cerrar el menú móvil al hacer clic.
 * @returns {JSX.Element} El elemento <li> que contiene el NavLink.
 */
const ItemNavBar = ( { link, isMobile, setOpen } ) => {

    // Clases base para el texto y la interacción, comunes a ambos modos.
    const commonClasses = "text-white hover:text-blue-400 transition-colors duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";

    /**
     * @function handleClick
     * @description Cierra el menú móvil si el componente está en modo móvil.
     */
    const handleClick = () => {
        if (isMobile && setOpen) {
            setOpen(false);
        }
    };

    // Estilos específicos para NavLink (usando una función para manejar el estado 'isActive')
    const navLinkClass = ({ isActive }) => {
        // Estilos base de interacción y responsividad
        let finalClasses = `${commonClasses} font-medium`;

        if (isMobile) {
            // Estilos específicos para el MODO MÓVIL (Menú completo)
            finalClasses += ` block w-full text-xl py-3 border-b border-gray-700/50`;
        } else {
            // Estilos específicos para el MODO DESKTOP (Barra horizontal)
            finalClasses += ` text-sm px-3 py-2 rounded-md hover:bg-gray-700/50`;
        }

        // Estilo cuando el enlace está activo
        if (isActive) {
            if (isMobile) {
                 // Ítem activo en móvil: Fondo azul más oscuro para contraste total
                finalClasses += ` !text-blue-400 !font-bold bg-gray-900/50`;
            } else {
                // Ítem activo en desktop: Resaltado con color azul
                finalClasses += ` !text-blue-400 bg-gray-700/70`; 
            }
        }
        
        return finalClasses;
    };
    
  return (
    // El <li> sólo necesita un manejo de ancho y padding en móvil si no está ya en la clase navLink
    <li className={isMobile ? "w-full" : "flex items-center"}>
        <NavLink
            to={link.href}
            // Utilizamos la función navLinkClass para aplicar estilos basados en el estado 'isActive'
            className={navLinkClass} 
            onClick={ handleClick }
        >
            {link.name}
        </NavLink>
    </li>
  )
}

export default ItemNavBar
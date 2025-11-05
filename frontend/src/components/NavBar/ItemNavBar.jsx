import { NavLink, useLocation, useNavigate } from "react-router"

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
    // Clases CSS comunes para todos los enlaces
    const commonClasses = "text-white hover:text-blue-400 transition-colors duration-150 ease-in-out cursor-pointer";
    // Hook para obtener la ubicación actual (pathname)
    const location = useLocation();
    // Hook para navegar programáticamente
    const navigate = useNavigate();

      
     //Función que maneja el click en cada enlace del navbar
    // Si tiene scrollTo Y estamos en la home (/): hace scroll
    // Si tiene scrollTo Y NO estamos en home: navega a home y luego hace scroll
    // Si NO tiene scrollTo: navega normalmente
     //@param {Event} e - Evento del click
     
     //cambios para agregar scrol hasta las secciones 
    const handleClick = (e) => {
        // Verificamos si el link tiene la propiedad scrollTo
        // Si la tiene, significa que queremos hacer scroll en lugar de navegar
        if(link.scrollTo){
            e.preventDefault();// Prevenimos la navegación por defecto de React Router

             //Caso 1: Ya estamos en la home, solo hacemos scroll
             if(location.pathname === '/'){
                // Buscamos el elemento HTML con el ID especificado en scrollTo
                const elemento = document.getElementById(link.scrollTo)
                //si encontramos el elemento, hacemos el scroll suave hacia él
                if(elemento){
                    elemento.scrollIntoView({
                        behavior: 'smooth',// Animación suave del scroll
                        block: 'start' // El elemento se posiciona al inicio del viewport
                        }
                    )
                }
            // Si estamos EN OTRA PÁGINA (/contacto, /freelancers, etc)
            }else{
                 // 1. Navega primero a la home
                navigate('/#servicios');
                // 2. Espera 100ms a que cargue
                // 3. Luego hace scroll al elemento
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);// 100ms de delay para asegurar que el DOM esté listo
            }
        }
        // Si estamos en mobile y el menú está abierto, lo cerramos después del click
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
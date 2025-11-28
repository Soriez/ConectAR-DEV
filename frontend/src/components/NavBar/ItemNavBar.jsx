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
            // 1. Navega primero a la home, usando el ID de scroll de forma dinámica
            navigate('/');
            
            // 2. Espera 100ms para dar tiempo a que la página Home se monte.
            // 3. Luego busca el elemento (¡Ahora sí estará en el DOM!) y hace scroll.
            setTimeout(() => {
                // 👇 BUSCAMOS EL ELEMENTO AQUÍ, después de la navegación
                const elementoDestino = document.getElementById(link.scrollTo); 
                
                if (elementoDestino) {
                    elementoDestino.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start' 
                    });
                } else {
                    // console.error(`No se encontró el elemento con ID: ${link.scrollTo}`);
                }
            }, 100);// 100ms de delay para asegurar que el DOM esté listo
        }
        }
        // Si estamos en mobile y el menú está abierto, lo cerramos después del click
        if (isMobile && setOpen) {
            setOpen(false);
        }
    };

    // --- AQUÍ ESTÁ EL CAMBIO DE ESTILO ---
    const navLinkClass = ({ isActive }) => {
        // Base
        let finalClasses = "flex items-center gap-3 transition-all duration-300 ";

        if (isMobile) {
            // Mobile: Estilo de "botón ancho" con bordes redondeados
            finalClasses += " w-full px-4 py-3 rounded-xl text-base ";
        } else {
            // Desktop: Estilo original
            finalClasses += " text-sm px-3 py-2 rounded-md hover:bg-gray-700/50 font-medium ";
        }

        // Estado Activo vs Inactivo
        if (isActive && !link.scrollTo) {
            if (isMobile) {
                // Mobile Activo: Fondo azul oscuro sutil + texto azul brillante + negrita
                finalClasses += " bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20";
            } else {
                // Desktop Activo
                finalClasses += " !text-blue-400 bg-gray-700/70"; 
            }
        } else {
            // Inactivo
            if (isMobile) {
                finalClasses += " text-slate-300 hover:bg-slate-800 hover:text-white font-medium";
            } else {
                finalClasses += " text-white hover:text-blue-400";
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
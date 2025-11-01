import { NavLink } from "react-router"


const ItemNavBar = ( { link, isMobile, setOpen } ) => {
    // Clases CSS comunes para todos los enlaces
    const commonClasses = "text-white hover:text-blue-400 transition-colors duration-150 ease-in-out cursor-pointer";

      
     //Función que maneja el click en cada enlace del navbar
     //@param {Event} e - Evento del click
     
     //cambios para agregar scrol hasta las secciones 
    const handleClick = (e) => {
        // Verificamos si el link tiene la propiedad scrollTo
        // Si la tiene, significa que queremos hacer scroll en lugar de navegar
        if(link.scrollTo){
            e.preventDefault();// Prevenimos la navegación por defecto de React Router
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
        }
        // Si estamos en mobile y el menú está abierto, lo cerramos después del click
        if (isMobile && setOpen) {
            setOpen(false);
        }
    };

    
  return (
    <li className={isMobile ? "w-full text-center py-2" : ""}>
        <NavLink
            to={link.href}
            className={`${commonClasses} ${isMobile ? "block text-lg " : "text-sm  px-3 py-2 rounded-md"}`}
            onClick={ handleClick }//Agregamos el manejador de click personalizado
        >
            {link.name}
        </NavLink>
    </li>
  )
}

export default ItemNavBar
import { NavLink } from "react-router"


const ItemNavBar = ( { link, isMobile, setOpen } ) => {

    const commonClasses = "text-white hover:text-blue-400 transition-colors duration-150 ease-in-out cursor-pointer";

    const handleClick = () => {
        if (isMobile && setOpen) {
            setOpen(false);
        }
    };

    
  return (
    <li className={isMobile ? "w-full text-center py-2" : ""}>
        <NavLink
            to={link.href}
            className={`${commonClasses} ${isMobile ? "block text-lg " : "text-sm  px-3 py-2 rounded-md"}`}
            onClick={ handleClick }
        >
            {link.name}
        </NavLink>
    </li>
  )
}

export default ItemNavBar
import Footer from "./components/Footer/Footer"
import NavBar from "./components/NavBar/NavBar"
import ScrollToTop from "./components/ScrollToTop"
import Rutas from "./routes/Rutas"
import { useLocation } from "react-router";


const App = () => {

    //Variable para cambiar de vista de visitante a vista usuario
    const isLoggedIn = true
    // true = usuario
    // false = visitante

    // Obtenemos la ruta actual
    const location = useLocation();

    // Verificamos si estamos dentro del dashboard (Usuario o Admin)
    // Si la ruta empieza con "/dashboard" o "/admin", ocultamos Nav y Footer.
    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

    return (
        <div className="flex flex-col min-h-screen">
            {/* Solo mostramos NavBar si NO es dashboard */}
            {!isDashboard && <NavBar isLoggedIn={isLoggedIn} />}
            <ScrollToTop />

            <main className={isDashboard ? "" : "flex-1"}>
                {/* Si es dashboard, quitamos flex-1 del main principal para que no choque con el layout interno */}
                <Rutas />
            </main>

            {/* Solo mostramos Footer si NO es dashboard */}
            {!isDashboard && (
                <footer>
                    <Footer />
                </footer>
            )}
        </div>
    )
}

export default App

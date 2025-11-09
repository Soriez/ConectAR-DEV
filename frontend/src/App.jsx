import Footer from "./components/Footer/Footer"
import NavBar from "./components/NavBar/NavBar"
import ScrollToTop from "./components/ScrollToTop"
import Rutas from "./routes/Rutas"


const App = () => {

    //Variable para cambiar de vista de visitante a vista usuario
    const isLoggedIn = false
    // true = usuario
    // false = visitante

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar isLoggedIn={isLoggedIn}/>
            <ScrollToTop />

            <main>
                <Rutas/>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}

export default App

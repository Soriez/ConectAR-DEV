import Footer from "./components/Footer/Footer"
import NavBar from "./components/NavBar/NavBar"
import ScrollToTop from "./components/ScrollToTop"
import Rutas from "./routes/Rutas"


const App = () => {
    return (
        <>
            <NavBar />
            <ScrollToTop />

            <main>
                <Rutas />
            </main>

            <footer>
                <Footer />
            </footer>
        </>
    )
}

export default App

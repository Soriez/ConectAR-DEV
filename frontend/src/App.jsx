import Footer from "./components/Footer/Footer"
import NavBar from "./components/NavBar/NavBar"
import Rutas from "./routes/Rutas"


const App = () => {
    return (
        <>
            <header>
                <NavBar />
            </header>

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

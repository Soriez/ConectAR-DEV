
import { useRoutes, Navigate } from 'react-router'

// --- Imports de Páginas ---
import Inicio from '../pages/ContenidoPrincipal/Inicio'
import Freelancers from '../pages/ContenidoPrincipal/Freelancers'
import Contacto from '../pages/ContenidoPrincipal/Contacto'
import IniciarSesion from '../pages/LoginYRegister/IniciarSesion'
import Registrarse from '../pages/LoginYRegister/Registrarse'
import NoEncontrado from '../pages/ContenidoPrincipal/NoEncontrado'
import Perfil from '../pages/ContenidoPrincipal/Perfil'
import SobreNosotros from '../pages/Footer/SobreNosotros'
import TerminosServicios from '../pages/Footer/TerminosServicios'
import TerminosPrivacidad from '../pages/Footer/TerminosPrivacidad'
import PoliticaCookies from '../pages/Footer/PoliticaCookies'
import CambiarEmail from '../components/CambiarDatos/CambiarEmail'
import CambiarPassword from '../components/CambiarDatos/CambiarPassword'

// --- Imports Dashboard ---
import DashboardLayout from '../layouts/DashboardLayout'
import PerfilDashboard from '../pages/Dashboard/PerfilDashboard'
import ServiciosDashboard from '../pages/Dashboard/ServiciosDashboard'
import ConfiguracionDashboard from '../components/Dashboard/ConfiguracionDashboard'
import OpinionesDashboard from '../components/Dashboard/OpinionesDashboard'
import UserToFreelancer from '../pages/Formulario/UserToFreelancer'
import FreeToPremium from '../pages/Formulario/FreeToPremium'
import AdminDashboard from '../pages/Dashboard/AdminDashboard'
import AdminStats from '../components/Dashboard/AdminStats'

// --- Imports de Guards ---
import { OnlyNonFreelancers, OnlyStandardFreelancers, RequireFreelancer } from './RutasPrivadas';

// ==========================================
// DEFINICIÓN DE RUTAS
// ==========================================

const Rutas = () => {
    return useRoutes([
        // --- RUTAS PÚBLICAS ---
        { path: '/', element: <Inicio /> },
        { path: '/freelancers', element: <Freelancers /> },
        { path: '/contacto', element: <Contacto /> },
        { path: '/iniciar-sesion', element: <IniciarSesion /> },
        { path: '/registrarse', element: <Registrarse /> },
        { path: '/perfil/:id', element: <Perfil /> },

        // --- PAGINAS LEGALES / FOOTER ---
        { path: '/sobre-nosotros', element: <SobreNosotros /> },
        { path: '/terminos-y-servicios', element: <TerminosServicios /> },
        { path: '/politicas-de-privacidad', element: <TerminosPrivacidad /> },
        { path: '/politicas-de-cookies', element: <PoliticaCookies /> },

        // --- ACTUALIZACIÓN DE CUENTA ---
        { path: '/cambiar-email', element: <CambiarEmail /> },
        { path: '/cambiar-password', element: <CambiarPassword /> },

        // --- RUTAS PROTEGIDAS ESPECÍFICAS ---

        // 🔒 Bloqueo para Hacerse Freelancer
        {
            element: <OnlyNonFreelancers />, // El guard envolvente
            children: [
                { path: '/hacerse-freelancer', element: <UserToFreelancer /> }
            ]
        },

        // 🔒 Bloqueo para Hacerse Premium
        {
            element: <OnlyStandardFreelancers />, // El guard envolvente
            children: [
                { path: '/hacerse-premium', element: <FreeToPremium /> }
            ]
        },

        // --- DASHBOARD (ZONA DE USUARIOS LOGUEADOS) ---
        {
            path: '/dashboard',
            element: <DashboardLayout />,
            children: [
                // Rutas accesibles para TODOS (Clientes y Freelancers)
                { index: true, element: <PerfilDashboard /> },
                { path: 'configuracion', element: <ConfiguracionDashboard /> },
                { path: 'opiniones', element: <OpinionesDashboard /> },

                // 🔒 Rutas EXCLUSIVAS para Freelancers
                {
                    element: <RequireFreelancer />,
                    children: [
                        { path: 'servicios', element: <ServiciosDashboard /> }
                    ]
                }
            ]
        },

        // --- ADMIN DASHBOARD ---
        { path: '/admin', element: <AdminStats /> },
        { path: '/admin/estadisticas', element: <Navigate to="/admin" replace /> }, // Redirección de compatibilidad
        { path: '/admin/perfiles', element: <AdminDashboard /> },

        // --- 404 NO ENCONTRADO ---
        { path: '*', element: <NoEncontrado /> },
    ])
}

export default Rutas
import React, { useContext } from 'react'
import { useRoutes, Navigate, Outlet } from 'react-router' // Importamos Navigate y Outlet
import { AuthContext } from '../context/AuthContext' // Importamos el contexto

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
import RecuperarCuenta from '../pages/LoginYRegister/RecuperarCuenta'
import CambiarEmail from '../components/CambiarDatos/CambiarEmail'
import CambiarPassword from '../components/CambiarDatos/CambiarPassword'

// --- Imports Dashboard ---
import DashboardLayout from '../layouts/DashboardLayout'
import PerfilDashboard from '../pages/Dashboard/PerfilDashboard'
import ServiciosDashboard from '../pages/Dashboard/ServiciosDashboard'
import ConfiguracionDashboard from '../components/Dashboard/ConfiguracionDashboard'
import OpinionesDashboard from '../components/Dashboard/OpinionesDashboard'

// --- COMPONENTE PROTECTOR DE RUTAS ---
// Este componente verifica si el usuario tiene permiso de freelancer.
// Si no lo tiene, lo devuelve al inicio del dashboard.
const RequireFreelancer = () => {
    const { user, isLoading } = useContext(AuthContext);

    // 1. Mientras carga, mostramos nada o un spinner (opcional)
    if (isLoading) return null; 

    // 2. Si el usuario existe pero NO es freelancer, lo redirigimos
    if (user && !user.isFreelancer) {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Si todo está bien, mostramos la ruta solicitada
    return <Outlet />;
};


const Rutas = () => {
    return useRoutes(
        [
            // --- RUTAS PÚBLICAS ---
            {
                path: '/',
                element: <Inicio />
            },
            {
                path: '/freelancers',
                element: <Freelancers />
            },
            {
                path: '/contacto',
                element: <Contacto />
            },
            {
                path: '/iniciar-sesion',
                element: <IniciarSesion />
            },
            {
                path: '/registrarse',
                element: <Registrarse />
            },
            {
                path: '/perfil/:id',
                element: <Perfil />
            },
            
            // --- PAGINAS LEGALES / FOOTER ---
            {
                path: '/sobre-nosotros',
                element: <SobreNosotros />
            },
            {
                path: '/terminos-y-servicios',
                element: <TerminosServicios />
            },
            {
                path: '/politicas-de-privacidad',
                element: <TerminosPrivacidad />
            },
            {
                path: '/politicas-de-cookies',
                element: <PoliticaCookies />
            },
            
            // --- RECUPERACIÓN DE CUENTA ---
            {
                path: '/recuperar-cuenta',
                element: <RecuperarCuenta />
            },
            {
                path: '/cambiar-email',
                element: <CambiarEmail />
            },
            {
                path: '/cambiar-password',
                element: <CambiarPassword />
            },

            // --- DASHBOARD (ZONA DE USUARIOS LOGUEADOS) ---
            {
                path: '/dashboard',
                element: <DashboardLayout />,
                children: [
                    // Rutas accesibles para TODOS (Clientes y Freelancers)
                    {
                        index: true,
                        element: <PerfilDashboard />
                    },
                    {
                        path: 'configuracion',
                        element: <ConfiguracionDashboard />
                    },

                    // 🔒 Rutas EXCLUSIVAS para Freelancers
                    // Envolvemos estas rutas con nuestro componente de seguridad
                    {
                        element: <RequireFreelancer />,
                        children: [
                            {
                                path: 'servicios',
                                element: <ServiciosDashboard />
                            },
                            {
                                path: 'opiniones',
                                element: <OpinionesDashboard />
                            }
                        ]
                    }
                ]
            },

            // --- 404 NO ENCONTRADO ---
            {
                path: '*',
                element: <NoEncontrado />
            },
        ]
    )
}

export default Rutas
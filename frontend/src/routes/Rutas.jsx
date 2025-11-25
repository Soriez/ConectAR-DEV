import React from 'react'
import { useRoutes } from 'react-router'
import Inicio from '../pages/ContenidoPrincipal/Inicio'
import Freelancers from '../pages/ContenidoPrincipal/Freelancers'
import Contacto from '../pages/ContenidoPrincipal/Contacto'
import IniciarSesion from '../pages/LoginYRegister/IniciarSesion'
import Registrarse from '../pages/LoginYRegister/Registrarse'
import NoEncontrado from '../pages/ContenidoPrincipal/NoEncontrado'
import Perfil from '../pages/ContenidoPrincipal/Perfil'
import ServiciosInicio from '../components/SeccionesInicio/ServiciosInicio'
import ContactoInicio from '../components/SeccionesInicio/ContactoInicio'
import SobreNosotros from '../pages/Footer/SobreNosotros'
import TerminosServicios from '../pages/Footer/TerminosServicios'
import TerminosPrivacidad from '../pages/Footer/TerminosPrivacidad'
import PoliticaCookies from '../pages/Footer/PoliticaCookies'
import RecuperarCuenta from '../pages/LoginYRegister/RecuperarCuenta'
import CambiarEmail from '../components/CambiarDatos/CambiarEmail'
import CambiarPassword from '../components/CambiarDatos/CambiarPassword'
import PerfilDashboard from '../pages/Dashboard/PerfilDashboard'
import ServiciosDashboard from '../pages/Dashboard/ServiciosDashboard'
import DashboardLayout from '../layouts/DashboardLayout'
import ConfiguracionDashboard from '../components/Dashboard/ConfiguracionDashboard'
import OpinionesDashboard from '../components/Dashboard/OpinionesDashboard'
import FreelancerPremium from '../pages/Formulario/FreelancerPremium'

const Rutas = () => {
    return useRoutes(
        [
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
            {
                path: '*',
                element: <NoEncontrado />
            },
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
            {
                path: '/hacerse-freelancer',
                element: <FreelancerPremium />
            },
            {
                path: '/dashboard',
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <PerfilDashboard />
                    },
                    {
                        path: 'servicios',
                        element: <ServiciosDashboard />
                    },
                    {
                        path: 'configuracion',
                        element: <ConfiguracionDashboard />
                    },
                    {
                        path: 'opiniones',
                        element: <OpinionesDashboard />
                    }
                ]
            }
        ]
    )
}

export default Rutas
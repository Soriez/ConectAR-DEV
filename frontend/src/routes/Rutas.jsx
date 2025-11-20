import React from 'react'
import { useRoutes } from 'react-router'
import Inicio from '../pages/Inicio'
import Freelancers from '../pages/Freelancers'
import Contacto from '../pages/Contacto'
import IniciarSesion from '../pages/IniciarSesion'
import Registrarse from '../pages/Registrarse'
import NoEncontrado from '../pages/NoEncontrado'
import Perfil from '../pages/Perfil'
import ServiciosInicio from '../components/SeccionesInicio/ServiciosInicio'
import ContactoInicio from '../components/SeccionesInicio/ContactoInicio'
import SobreNosotros from '../pages/SobreNosotros'
import TerminosServicios from '../pages/TerminosServicios'
import TerminosPrivacidad from '../pages/TerminosPrivacidad'
import PoliticaCookies from '../pages/PoliticaCookies'
import RecuperarCuenta from '../pages/RecuperarCuenta'
import CambiarEmail from '../components/CambiarDatos/CambiarEmail'
import CambiarPassword from '../components/CambiarDatos/CambiarPassword'
import PerfilDashboard from '../pages/PerfilDashboard'
import ServiciosDashboard from '../pages/ServiciosDashboard'
import DashboardLayout from '../layouts/DashboardLayout'
import ConfiguracionDashboard from '../components/Dashboard/ConfiguracionDashboard'
import OpinionesDashboard from '../components/Dashboard/OpinionesDashboard'

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
            path: '/perfil',
            element: <Perfil />
        },
        {
            path:'/sobre-nosotros',
            element: <SobreNosotros/>
        },
        {
            path:'/terminos-y-servicios',
            element:<TerminosServicios/>
        },
        {
            path:'/politicas-de-privacidad',
            element:<TerminosPrivacidad/>
        },
        {
            path:'/politicas-de-cookies',
            element:<PoliticaCookies/>
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
      path: '/dashboard',
      element: <DashboardLayout />, // Esto carga el Sidebar + Outlet
      children: [
        { 
           index: true, // Esto significa que /dashboard carga el Perfil
           element: <PerfilDashboard/> 
        },
        { 
           path: 'servicios', // /dashboard/servicios
           element: <ServiciosDashboard /> 
        },
        {
           path: 'configuracion', 
           element: <ConfiguracionDashboard/>
        },
        {
            path: 'opiniones',
            element: <OpinionesDashboard/>
        }
      ]
    }
    ]
  )
}

export default Rutas
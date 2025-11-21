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
            path: '*',
            element: <NoEncontrado />
        },
        {
            path: '/perfil/:id',
            element: <Perfil />
        }
    ]
  )
}

export default Rutas
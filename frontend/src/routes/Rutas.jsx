import React from 'react'
import { useRoutes } from 'react-router'
import Inicio from '../pages/Inicio'
import Servicios from '../pages/Servicios'
import Freelancers from '../pages/Freelancers'
import ComoFunciona from '../pages/ComoFunciona'
import Contacto from '../pages/Contacto'
import IniciarSesion from '../pages/IniciarSesion'
import Registrar from '../pages/Registrar'
import NoEncontrado from '../pages/NoEncontrado'
import Perfil from '../pages/Perfil'

const Rutas = () => {
  return useRoutes(
    [
        {
            path: '/',
            element: <Inicio />
        },
        {
            path: '/servicios',
            element: <Servicios />
        },
        {
            path: '/freelancers',
            element: <Freelancers />
        },
        {
            path: '/como-funciona',
            element: <ComoFunciona />
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
            element: <Registrar />
        },
        {
            path: '*',
            element: <NoEncontrado />
        },
        {
            path: '/perfil',
            element: <Perfil />
        }
    ]
  )
}

export default Rutas
import React from 'react'
import { useRoutes } from 'react-router'
import Inicio from '../pages/Inicio'
import Freelancers from '../pages/Freelancers'
import ComoFunciona from '../pages/ComoFunciona'
import Contacto from '../pages/Contacto'
import IniciarSesion from '../pages/IniciarSesion'
import Registrarse from '../pages/Registrarse'
import NoEncontrado from '../pages/NoEncontrado'

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
            path: '/registrar',
            element: <Registrar />
        },
        {
            path: '*',
            element: <NoEncontrado />
        },
    ]
  )
}

export default Rutas
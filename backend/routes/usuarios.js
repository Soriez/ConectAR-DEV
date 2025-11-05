
// Este archivo define qué sucede cuando el frondent hace una solicitud (GET, POST, etc) 

const express = require('express')
const router = express.Router()
const Usuario = require('../models/Usuario')

// @route   POST /api/usuarios
// @desc    Crear un nuevo usuario

router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body)
        const usuarioGuardado = await nuevoUsuario.save()
        res.status(201).json(usuarioGuardado)
    } catch (error) {
        res.status(400).json( { msg: error.message } )
        console.log('Error al crear un nuevo usuario');
        
    }
})

// @route   GET /api/usuarios
// @desc    Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find({})
        res.json(usuarios)
    } catch (error) {
        res.status(500).json( { msg: 'Error al obtener todos los usuarios' } )
    }
})


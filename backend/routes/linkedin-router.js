import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import userModel from '../models/user.model.js';

const { User } = userModel;
const router = express.Router();

// Helper para parsear cookies manualmente
const parseCookies = (request) => {
    const list = {};
    const rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
};

// Variables de entorno
const getEnv = () => ({
    CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || process.env.VITE_LINKEDIN_CLIENT_ID,
    CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET || process.env.VITE_LINKEDIN_CLIENT_SECRET,
    REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI || process.env.VITE_LINKEDIN_REDIRECT_URI,
    FRONTEND_FORM_URL: process.env.VITE_FRONTEND_FREELANCER_FORM_URL || 'http://localhost:5173/hacerse-freelancer',
    JWT_SECRET: process.env.VITE_JWT_SECRET
});

// A. Inicio de la Vinculación
router.get('/connect', (req, res) => {
    const { CLIENT_ID, REDIRECT_URI, JWT_SECRET } = getEnv();
    const { token } = req.query;

    if (!CLIENT_ID || !REDIRECT_URI) {
        return res.status(500).send('Error de configuración: Faltan variables de entorno de LinkedIn.');
    }

    if (!token) {
        return res.status(401).send('No autorizado: Token no proporcionado.');
    }

    try {
        // Verificar el token para obtener el ID del usuario
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Generar estado aleatorio
        const state = crypto.randomBytes(16).toString('hex');
        const scopes = 'openid profile email';

        // Guardar estado y userId en cookies httpOnly (segura, expira en 5 min)
        res.cookie('linkedin_auth_state', state, { httpOnly: true, maxAge: 5 * 60 * 1000 });
        res.cookie('linkedin_auth_user', userId, { httpOnly: true, maxAge: 5 * 60 * 1000 });

        // Construir URL de autorización
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${encodeURIComponent(scopes)}`;

        // Redireccionar a LinkedIn
        res.redirect(authUrl);

    } catch (error) {
        console.error('Error verificando token:', error);
        return res.status(401).send('No autorizado: Token inválido.');
    }
});

// B. Callback (Manejar la Respuesta de LinkedIn)
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, FRONTEND_FORM_URL } = getEnv();

    // 1. Verificar estado y obtener usuario
    const cookies = parseCookies(req);
    const storedState = cookies['linkedin_auth_state'];
    const userId = cookies['linkedin_auth_user'];

    if (!state || !storedState || state !== storedState) {
        console.error('Error de seguridad: El estado (state) no coincide.');
        return res.status(400).send('Error de seguridad: Intento de vinculación inválido.');
    }

    if (!userId) {
        console.error('Error: No se encontró la sesión del usuario.');
        return res.status(401).send('Sesión expirada. Por favor intente nuevamente.');
    }

    // Limpiar cookies
    res.clearCookie('linkedin_auth_state');
    res.clearCookie('linkedin_auth_user');

    try {
        // 2. Intercambiar code por Access Token
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        });

        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token } = tokenResponse.data;

        // 3. Obtener datos del usuario
        const userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        const userData = userInfoResponse.data;

        // 4. Actualizar Usuario en Base de Datos
        // Nota: La API actual de LinkedIn (v2/userinfo) no devuelve la URL pública (vanityName) sin permisos especiales (r_basicprofile).
        // Usamos el ID (sub) para construir una URL funcional o guardamos lo que llegue.
        const profileURL = userData.profile || `https://www.linkedin.com/in/${userData.sub}`;

        const updatedUser = await User.findByIdAndUpdate(userId, {
            linkedin: profileURL
            // No cambiamos el role a 'freelancer' aquí, se hará en el formulario final si corresponde.
        }, { new: true });

        console.log('--------------------------------------------------');
        console.log('✅ VINCULACIÓN EXITOSA Y GUARDADA');
        console.log(`👤 Usuario: ${updatedUser.email}`);
        console.log(`� LinkedIn: ${updatedUser.linkedin}`);
        console.log('--------------------------------------------------');

        // 5. Redireccionar
        // El usuario pidió "redirigir al dashboard". 
        // Si tenemos una variable para el dashboard, la usamos. Si no, la raíz.
        const dashboardUrl = process.env.VITE_FRONTEND_PROFILE_URL || 'http://localhost:5173/dashboard';
        res.redirect(dashboardUrl);

    } catch (error) {
        console.error('❌ Error en LinkedIn Callback:', error.response?.data || error.message);
        res.status(500).send('Error al vincular cuenta de LinkedIn.');
    }
});

export default router;

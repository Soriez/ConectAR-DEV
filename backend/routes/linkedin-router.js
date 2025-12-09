import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/user.model.js'; // Importar modelo de usuario
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
    CLIENT_ID: process.env.VITE_LINKEDIN_CLIENT_ID,
    CLIENT_SECRET: process.env.VITE_LINKEDIN_CLIENT_SECRET,
    REDIRECT_URI: process.env.VITE_LINKEDIN_REDIRECT_URI,
    FRONTEND_FORM_URL: process.env.VITE_FRONTEND_FREELANCER_FORM_URL,
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
        return res.status(400).send('Error de seguridad: Intento de vinculación inválido.');
    }

    if (!userId) {
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

        // 3. Obtener datos del usuario de LinkedIn
        const userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        const userData = userInfoResponse.data;
        const profileURL = userData.profile || `https://www.linkedin.com/in/${userData.sub}`; // Obtener URL de perfil

        // 4. Buscar usuario en base de datos
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado.');
        }

        // 5. Lógica condicional
        // Si YA tiene portfolio y descripción, lo convertimos directamente
        if (user.portfolio && user.descripcion) {

            user.linkedin = profileURL;    // Guardamos LinkedIn
            user.role = 'freelancer';      // Convertimos a freelancer
            user.isDisponible = true;      // Nos aseguramos que esté disponible (opcional)

            await user.save();

            // Redireccionar al Dashboard o Perfil (Asumimos base URL desde el FRONTEND_FORM_URL)
            // Si FRONTEND_FORM_URL es "http://localhost:5173/hacerse-freelancer", obtenemos "http://localhost:5173"
            const frontendBaseUrl = new URL(FRONTEND_FORM_URL).origin;
            return res.redirect(`${frontendBaseUrl}/dashboard?status=success_auto_freelancer`);
        }

        // 6. Si NO tiene los datos completos, flujo normal (redirigir al formulario)

        // Añadimos parámetros para que el frontend sepa que fue exitoso
        const redirectUrl = `${FRONTEND_FORM_URL}?status=success&linkedin=${encodeURIComponent(profileURL)}`;
        res.redirect(redirectUrl);

    } catch (error) {
        console.error("Error en callback de LinkedIn:", error);
        res.status(500).send('Error al vincular cuenta de LinkedIn.');
    }
});

export default router;

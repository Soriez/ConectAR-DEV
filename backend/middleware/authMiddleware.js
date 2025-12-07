import jwt from 'jsonwebtoken';
import userService from '../services/user.service.js';

// Middleware PRINCIPAL: Protege las rutas y carga req.user si hay token
export const protect = async (req, res, next) => {
  let token;

  // 1. Buscamos el token en las cabeceras de la petición
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extraer el token (eliminar 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token usando el secreto
      // Asegúrate de que process.env.VITE_JWT_SECRET está configurado
      const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);

      // 4. Buscar el usuario asociado al ID dentro del token (sin el password)
      req.user = await userService.buscarUsuarioSinPassword(decoded);

      // 4.5 Verificar que el usuario siga existiendo
      if (!req.user) {
        // 🔴 BLOQUEO 1: Token válido, pero usuario ya no existe en la DB
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      // 5. ¡Todo bien! Pasar al siguiente middleware o controlador
      next();

    } catch (error) {
      // Si el token es inválido o ha expirado
      console.error('Error de autenticación:', error.message);
      // 🔴 BLOQUEO 2: Token inválido (expirado, modificado, etc.)
      return res.status(401).json({ message: 'No autorizado, token fallido o expirado' }); // <--- CORRECCIÓN CLAVE
    }
  }

  // 🔴 BLOQUEO 3: Si no se encuentra el token en el header (es decir, el bloque 'if' nunca se ejecutó con éxito)
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró token' }); // <--- CORRECCIÓN CLAVE
  }

  // Nota: Si el token existe pero no es válido, el `catch` ya devolvió un 401. 
  // Si el `if` se ejecutó sin errores, `next()` ya se llamó.
  // El `if (!token)` final solo es estrictamente necesario si `token` nunca se asignó.
};
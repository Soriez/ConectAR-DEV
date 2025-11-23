import jwt from 'jsonwebtoken';
import pkg from '../models/user.model.js';
const { User, buscarUsuarioSinPassword } = pkg;

// Middleware que protege las rutas
export const protect = async (req, res, next) => {
  let token;

  // 1. Buscamos el token en las cabeceras de la petición
  // El formato estándar es: Authorization: Bearer <TOKEN>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extraer el token (eliminar 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token usando el secreto
      const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);

      // 4. Buscar el usuario asociado al ID dentro del token (sin el password)
      // Guardamos el usuario en la request para que el controlador lo pueda usar
      req.user = await buscarUsuarioSinPassword(decoded);

      // 4.5 Verificar que el usuario siga existiendo
      if (!req.user) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      // 5. ¡Todo bien! Pasar al siguiente middleware o controlador
      next();

    } catch (error) {
      // Si el token es inválido o ha expirado
      console.error('Error de autenticación:', error.message);
      return res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
    }
  }

  // Si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró ningún token' });
  }
};
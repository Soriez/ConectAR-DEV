import User from '../models/User.js'; // Importamos el modelo
import bcrypt from 'bcrypt';         // Importamos el paquete
import jwt from 'jsonwebtoken';


// --- Función Auxiliar para Generar JWT ---
// Usa el JWT_SECRET que debes poner en tu .env
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.VITE_JWT_SECRET, {
    expiresIn: '1d', // El token es válido por 1 día
  });
};


// ! POST /api/users/register
// ? Registrar a un usuario (Con token de JWT implementado)

// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, isFreelancer } = req.body;

    // 1. Verificar si el usuario ya existe (opcional, pero buena práctica)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    // 2. ¡IMPORTANTE! Hashear la contraseña (como vimos antes)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      nombre, apellido, email, 
      password: hashedPassword, // ¡Guardamos el hash!
      isFreelancer
    });

    const savedUser = await newUser.save();
    
    // 3. Generar y enviar el token después del registro exitoso
    const token = generateToken(savedUser._id);

    // 4. Respondemos al frontend con el token y datos
    res.status(201).json({
      message: "¡Usuario registrado exitosamente!",
      _id: savedUser._id,
      nombre: savedUser.nombre,
      email: savedUser.email,
      isFreelancer: savedUser.isFreelancer,
      token: token // ¡CLAVE: Enviamos el JWT!
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }
    res.status(500).json({ message: "Error al registrar el usuario", error: error.message });
  }
};

// ! POST /api/users/login

// ? Loguear a un usuario y generar JWT (token)

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar el usuario. Usamos .select('+password') para que Mongoose 
        // incluya el hash de la contraseña, que por defecto está excluido.
        const user = await User.findOne({ email }).select('+password');

        // 2. Verificar si el usuario existe y si la contraseña es correcta
        // Usamos bcrypt.compare para comparar el texto plano con el hash
        if (user && (await bcrypt.compare(password, user.password))) {
            
            // 3. Generar el token
            const token = generateToken(user._id);

            // 4. Respuesta exitosa
            res.status(200).json({
                message: "Login exitoso",
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                isFreelancer: user.isFreelancer,
                token: token // ¡CLAVE: Enviamos el JWT!
            });
        } else {
            // Error de credenciales
            res.status(401).json({ message: "Credenciales inválidas (Email o Contraseña incorrectos)" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error en el login", error: error.message });
    }
};


// ! GET /api/users
// ? Trae TODOS los usuarios

export const getAllUsers = async (req, res) => {
  try {
    // .find() sin argumentos trae todo
    // Gracias a `select: false` en tu schema, ¡el password no vendrá!
    const users = await User.find();

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

// ! GET /api/users/:id

// ? Trae UN usuario mediante el ID

export const getUserById = async (req, res) => {
  try {
    // 1. Obtenemos el ID de los parámetros de la URL (req.params)
    const { id } = req.params;

    const user = await User.findById(id);

    // 2. Verificamos si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 3. Respondemos con el usuario
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// ! GET /api/users/freelancers

// ? Obtener todos los freelancers

export const getAllFreelancers = async (req, res) => {
  try {
    // 🔍 Filtro: Buscamos documentos donde isFreelancer sea explícitamente true
    const freelancers = await User.find({ isFreelancer: true });

    res.status(200).json(freelancers);

  } catch (error) {
    console.error('Error al obtener freelancers:', error);
    res.status(500).json({ 
      message: "Error interno del servidor al obtener la lista de freelancers", 
      error: error.message 
    });
  }
};


// ! PUT /api/users/:id o PATCH /api/users/:id

// ? actualizar información de un usuario


export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id; // ID del perfil que se intenta actualizar (de la URL)
    
    // El middleware 'protect' adjunta los datos del usuario logueado en req.user
    // El ID del usuario logueado lo obtenemos de aquí:
    // Convertimos a string por seguridad en la comparación
    const authenticatedUserId = req.user._id.toString(); 

    // -----------------------------------------------------------------
    // !!! 1. VERIFICACIÓN DE AUTORIZACIÓN (SEGURIDAD) !!!
    // Se asegura que el usuario logueado solo pueda modificar su propio perfil
    // -----------------------------------------------------------------
    if (userIdToUpdate !== authenticatedUserId) {
      // 403 Forbidden: No tienes los permisos para acceder a este recurso.
      return res.status(403).json({ 
        message: "Acceso denegado. Solo puedes actualizar tu propia cuenta." 
      });
    }

    // Obtenemos los campos a actualizar del cuerpo de la petición
    const updates = req.body;

    // -----------------------------------------------------------------
    // 2. HASH DE CONTRASEÑA (si se está actualizando)
    // Es NECESARIO porque findByIdAndUpdate omite el middleware pre('save')
    // -----------------------------------------------------------------
    if (updates.password) {
      // Usar el mismo número de saltRounds que en el registro (ej: 10)
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // 3. Buscamos y actualizamos
    const updatedUser = await User.findByIdAndUpdate(
      userIdToUpdate, 
      updates,
      { 
        new: true,               // Devuelve el documento actualizado
        runValidators: true,     // Ejecuta las validaciones del esquema (ej: 'required', formato email)
        omitUndefined: true      // Ignora campos undefined si los pasas
      } 
    ).select('-password'); // Excluimos la contraseña del objeto retornado

    // 4. Verificamos si el usuario fue encontrado (aunque la verificación de arriba ya lo haría, es buena práctica)
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 5. Respuesta exitosa
    res.status(200).json({
      message: "Usuario actualizado exitosamente.",
      user: updatedUser
    });

  } catch (error) {
    // Si falla la validación o cualquier otro error de DB
    res.status(500).json({ 
      message: "Error al actualizar el usuario", 
      error: error.message 
    });
  }
};

// ! DELETE /api/users/:id

// ? NO existe la eliminación de usuarios mediante la plataforma
import { actualizarUsuario, buscarUsuarioConPassword, generateToken, guardarUsuario, obtenerFreelancers, obtenerTodosLosUsuarios, usuarioExiste, verificarPasword } from '../models/user.model.js';


// ! POST /api/users/register
// ? Registrar a un usuario (Con token de JWT implementado)

// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, isFreelancer } = req.body;

    // 1. Verificar si el usuario ya existe (opcional, pero buena práctica)
    const userExists = await usuarioExiste(email)
    if (userExists) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    // 1. saltRounds se usa para hashear la contraseña
    const saltRounds = 10;

    // le pido al modelo que guarde el usuario
    const savedUser = await guardarUsuario( nombre, apellido, email, password, isFreelancer, saltRounds)
    
    // 3. Generar y enviar el token después del registro exitoso
    const token = await generateToken(savedUser._id);

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
// ? Obtengo UN usuario mediante el EMAIL

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar el usuario. Usamos .select('+password') para que Mongoose 
        // incluya el hash de la contraseña, que por defecto está excluido.
        const user = await buscarUsuarioConPassword( email )
        if( !user ) {
          res.status(404).json({ mensaje: 'No existe un usuario registrado con el email ingresado'})
        }
        // 2. Verificar si el usuario existe y si la contraseña es correcta
        // Usamos bcrypt.compare para comparar el texto plano con el hash
        const verificacion = await verificarPasword( password, user )
        if (user && verificacion) {
            
            // 3. Generar el token
            const token = await generateToken(user._id);

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
    const users = await obtenerTodosLosUsuarios()

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

// ! GET /api/users/:id

// ? Trae UN usuario mediante el ID

// export const getUserById = async (req, res) => {
//   try {
//     // 1. Obtenemos el ID de los parámetros de la URL (req.params)
//     const { id } = req.params;

//     const user = await User.findById(id);

//     // 2. Verificamos si el usuario existe
//     if (!user) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

//     // 3. Respondemos con el usuario
//     res.status(200).json(user);

//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
//   }
// };

// ! GET /api/users/freelancers

// ? Obtener todos los freelancers

export const getAllFreelancers = async (req, res) => {
  try {
    // 🔍 Filtro: Buscamos documentos donde isFreelancer sea explícitamente true
    const freelancers = await obtenerFreelancers()

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
    // ⭐ USAR EL ID DEL USUARIO AUTENTICADO DIRECTAMENTE ⭐
    // Esto elimina la necesidad de comparar req.params.id con req.user._id.
    // Si el token es válido, solo permitimos modificar el ID asociado al token.
    const authenticatedUserId = req.user._id; 
    console.log(authenticatedUserId);
    // Obtenemos los campos a actualizar del cuerpo de la petición
    const updates = req.body;

    // -----------------------------------------------------------------
    // 1. NO ES NECESARIA LA VERIFICACIÓN DE AUTORIZACIÓN:
    //    Si el usuario tiene un token válido, solo actualizaremos SU cuenta.
    // -----------------------------------------------------------------
    /* // Código anterior que causaba error de comparación:
    const userIdToUpdate = req.params.id; 
    if (userIdToUpdate !== authenticatedUserId.toString()) {
       return res.status(403).json({ 
         message: "Acceso denegado. Solo puedes actualizar tu propia cuenta." 
       });
    }
    */
    // -----------------------------------------------------------------

    // 2. HASH DE CONTRASEÑA (si se está actualizando)
    if (updates.password) {
      // Importa 'bcrypt' si aún no lo has hecho
      updates.password = await bcrypt.hash(updates.password, 10); 
    }

    // 3. Buscamos y actualizamos usando el ID del usuario logueado
    const updatedUser = await actualizarUsuario(authenticatedUserId, updates)

    // 4. Verificamos si el usuario fue encontrado (aunque el token sea válido, es buena práctica)
    if (!updatedUser) {
      // Este caso es muy raro, solo si el usuario fue borrado entre el token y la petición
      console.log(updateUser);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 5. Respuesta exitosa
    res.status(200).json({
      message: "Usuario actualizado exitosamente.",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar el usuario", 
      error: error.message 
    });
  }
};

// ! DELETE /api/users/:id

// ? NO existe la eliminación de usuarios mediante la plataforma
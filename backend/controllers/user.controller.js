import userService from '../services/user.service.js';

// ! POST /api/users/register
// ? Registrar a un usuario (Con token de JWT implementado)

// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, role } = req.body;

    // 1. Verificar si el usuario ya existe (opcional, pero buena práctica)
    const userExists = await userService.usuarioExiste(email)
    if (userExists) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    // 1. saltRounds se usa para hashear la contraseña
    const saltRounds = 10;

    // le pido al modelo que guarde el usuario
    const savedUser = await userService.guardarUsuario(nombre, apellido, email, password, role, saltRounds)

    // 3. Generar y enviar el token después del registro exitoso
    const token = await userService.generateToken(savedUser._id);

    // 4. Respondemos al frontend con el token y datos
    res.status(201).json({
      message: "¡Usuario registrado exitosamente!",
      _id: savedUser._id,
      nombre: savedUser.nombre,
      email: savedUser.email,
      role: savedUser.role,
      plan: savedUser.plan,
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
    const user = await userService.buscarUsuarioConPassword(email)
    if (!user) {
      return res.status(404).json({ mensaje: 'No existe un usuario registrado con el email ingresado' })
    }
    // 2. Verificar si el usuario existe y si la contraseña es correcta
    // Usamos bcrypt.compare para comparar el texto plano con el hash
    const verificacion = await userService.verificarPasword(password, user)
    if (user && verificacion) {

      // 3. Generar el token
      const token = await userService.generateToken(user._id);

      // 4. Respuesta exitosa
      res.status(200).json({
        message: "Login exitoso",
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        plan: user.plan,
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
    const users = await userService.obtenerTodosLosUsuarios()
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

// ! GET /api/users/freelancers
// ? Obtener todos los freelancers (¡CON FILTROS!)
export const getAllFreelancers = async (req, res) => {
  try {
    const { isPremium, isDisponible, isAvailable } = req.query;

    // 1. Filtro base
    const filter = {};
    if (isPremium === 'true') filter.plan = 'premium';

    const availabilityQuery = isDisponible || isAvailable;
    if (availabilityQuery === 'true') filter.isDisponible = true;

    const baseFilter = { role: 'freelancer', ...filter };

    // 2. Traemos freelancers + servicios + tipoServicio
    //    (NO tocamos skills, las dejamos como vengan del schema)
    const freelancersRaw = await userService.obtenerFreelancers(baseFilter)

    // 3. Normalizamos la data para que el front trabaje cómodo
    const freelancers = freelancersRaw.map((f) => {
      const obj = f.toObject();

      // A) Normalizar skills a array de strings, sin hacer populate
      obj.skills = (obj.skills || []).map((skill) => {
        if (typeof skill === 'string') return skill;
        if (skill && typeof skill === 'object') {
          return skill.name || skill.nombre || '';
        }
        return '';
      });

      // B) Asegurarnos que cada servicio tenga tipoServicio con la estructura esperada
      obj.servicios = (obj.servicios || []).map((s) => {
        if (!s.tipoServicio || typeof s.tipoServicio !== 'object') {
          return s;
        }

        return {
          ...s,
          tipoServicio: {
            _id: s.tipoServicio._id,
            nombre: s.tipoServicio.nombre,
            categoria: s.tipoServicio.categoria,
            categoria_principal: s.tipoServicio.categoria_principal,
          },
        };
      });

      // C) Calcular Rating Promedio
      let avgRating = 1;
      if (obj.opiniones && obj.opiniones.length > 0) {
        const sum = obj.opiniones.reduce((acc, op) => acc + (op.calificacion || op.puntuacion || 0), 0);
        avgRating = sum / obj.opiniones.length;
      }
      obj.rating = avgRating;

      return obj;
    });

    // Debug opcional eliminado


    res.status(200).json(freelancers || []);
  } catch (error) {
    console.error('Error REAL en getAllFreelancers:', error);
    res.status(500).json({
      message:
        'Error interno del servidor al obtener la lista de profesionales.',
      details: error.message,
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



    // 3. Buscamos y actualizamos usando el ID del usuario logueado
    const updatedUser = await userService.actualizarUsuario(authenticatedUserId, updates)

    // 4. Verificamos si el usuario fue encontrado (aunque el token sea válido, es buena práctica)
    if (!updatedUser) {
      // Este caso es muy raro, solo si el usuario fue borrado entre el token y la petición
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

// --- NUEVAS FUNCIONALIDADES ---

// ! POST /api/users/become-freelancer
// ? Convertir usuario normal en Freelancer
export const becomeFreelancer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { linkedin, portfolio, descripcion, role } = req.body;

    if (!linkedin || !portfolio || !descripcion) {
      return res.status(400).json({ message: "Todos los campos son obligatorios para ser freelancer" });
    }

    const updatedUser = await userService.convertirAFreelancer(userId, linkedin, portfolio, descripcion, role);

    res.status(200).json(updatedUser);


  } catch (error) {
    res.status(500).json({ message: "Error al convertir a freelancer", error: error.message });
  }
};

// ! PUT /api/users/availability
// ? Cambiar disponibilidad (Disponible / Ocupado)
export const toggleAvailability = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isDisponible } = req.body; // Esperamos un booleano true/false

    if (typeof isDisponible !== 'boolean') {
      return res.status(400).json({ message: "El estado debe ser booleano (true/false)" });
    }

    const updatedUser = await userService.cambiarDisponibilidad(userId, isDisponible);

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: "Error al cambiar disponibilidad", error: error.message });
  }
};

// ! POST /api/users/upgrade-premium
// ? Convertir a Premium (Simulación de pago exitoso)
export const upgradeToPremium = async (req, res) => {
  try {
    const userId = req.user._id;
    const { plan } = req.body;

    // Aquí iría la lógica de verificación de pago si fuera real
    // Por ahora asumimos que si llaman a este endpoint es porque pagaron

    const updatedUser = await userService.convertirAPremium(userId, plan);

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: "Error al procesar la suscripción Premium", error: error.message });
  }
};
// ! GET /api/users/:id
// ? Trae UN usuario mediante el ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.buscarUsuarioSinPassword({ id });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// ! PUT /api/users/:id/skills
// ? actualiza las skills del usuario 
export const actualizarSkillsUser = async (req, res) => {
  // 🚨 USAMOS req.user._id: El ID seguro y autenticado que viene del token.
  const userId = req.user._id;
  const { skills } = req.body; // Esperamos que el frontend envíe { skills: [...] }

  // Validación básica: El campo 'skills' debe existir y ser un array
  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ message: 'El campo skills es obligatorio y debe ser un array.' });
  }

  // Si tienes el chequeo de req.params.id en la ruta, puedes omitir esto.
  // Si quieres un chequeo de seguridad adicional:
  if (req.params.id !== userId.toString()) {
    return res.status(403).json({ message: 'Acceso denegado: No puedes actualizar otro usuario.' });
  }

  try {
    const updatedUser = await userService.actualizarSkillsUser(userId, skills);

    // Si por alguna razón el modelo no encontró el usuario, lanzará un error (si lo implementamos)
    // o devolverá null. Es bueno chequear esto.
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 🟢 RESPUESTA FINAL DE ÉXITO
    // El problema es que esta línea falla silenciosamente.
    // Si el .toJSON() en el modelo no resolvió el problema, 
    // aquí aseguramos que la respuesta se envía correctamente.
    return res.status(200).json(updatedUser);

  } catch (error) {
    // Manejo de error de validación de Mongoose (límite de 5 skills, etc.)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    // Este es el error "desconocido" que ve el frontend
    return res.status(500).json({ message: 'Error interno del servidor al guardar skills.' });
  }
};

// ! PUT /api/users/:id/visitas
export const incrementVisit = async (req, res) => {
  try {
    const { id } = req.params;
    // Obtener IP del cliente (considerando proxies)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

    await userService.incrementarVisitas(id, ip);
    res.status(200).json({ message: "Visita registrada" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar visita", error: error.message });
  }
};

// ! PUT /api/users/:id/linkedin
export const incrementLinkedinAccess = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.incrementarLinkedin(id);
    res.status(200).json({ message: "Acceso a LinkedIn registrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar acceso a LinkedIn", error: error.message });
  }
};

// ! PUT /api/users/:id/portfolio
export const incrementPortfolioAccess = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.incrementarPortfolio(id);
    res.status(200).json({ message: "Acceso a Portfolio registrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar acceso a Portfolio", error: error.message });
  }
};
// ! GET /api/users/freelancers/premium
// ? Obtener SOLO freelancers PREMIUM y DISPONIBLES, ordenados por CALIFICACIÓN
export const getPremiumFreelancers = async (req, res) => {
  try {
    // 1. Buscar freelancers premium y disponibles
    // Usamos el servicio para obtener los datos
    const freelancers = await userService.obtenerFreelancersPremium();

    // 2. Calcular el rating promedio para cada freelancer
    const freelancersWithRating = freelancers.map(f => {
      // Convertimos a objeto plano para poder agregar propiedades
      const freelancerObj = f.toObject();

      let avgRating = 1;
      if (f.opiniones && f.opiniones.length > 0) {
        const sum = f.opiniones.reduce((acc, op) => acc + (op.calificacion || op.puntuacion || 0), 0);
        avgRating = sum / f.opiniones.length;
      }

      // Agregamos el rating calculado al objeto
      freelancerObj.calculatedRating = avgRating;
      // También aseguramos que el campo 'rating' (si se usa en el front) tenga este valor
      freelancerObj.rating = avgRating;

      return freelancerObj;
    });

    // 3. Ordenar por rating descendente (Mayor a menor)
    freelancersWithRating.sort((a, b) => b.calculatedRating - a.calculatedRating);

    res.status(200).json(freelancersWithRating);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener freelancers premium", error: error.message });
  }
};

// ! GET /api/users/freelancers/category-main/:category
// ? Obtener freelancers por Categoría Principal
export const getFreelancersByMainCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const freelancers = await userService.obtenerFreelancersPorCategoria(category);

    // Calcular rating para cada freelancer
    const freelancersWithRating = freelancers.map(f => {
      const obj = f.toObject();
      let avgRating = 1;
      if (obj.opiniones && obj.opiniones.length > 0) {
        const sum = obj.opiniones.reduce((acc, op) => acc + (op.calificacion || op.puntuacion || 0), 0);
        avgRating = sum / obj.opiniones.length;
      }
      obj.rating = avgRating;
      return obj;
    });

    res.status(200).json(freelancersWithRating);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar por categoría principal", error: error.message });
  }
};

// ! GET /api/users/freelancers/category-specific/:category
// ? Obtener freelancers por Categoría Específica (Subcategoría)
export const getFreelancersBySpecificCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const freelancers = await userService.obtenerFreelancersPorSubCategoria(category);

    // Calcular rating para cada freelancer
    const freelancersWithRating = freelancers.map(f => {
      const obj = f.toObject();
      let avgRating = 1;
      if (obj.opiniones && obj.opiniones.length > 0) {
        const sum = obj.opiniones.reduce((acc, op) => acc + (op.calificacion || op.puntuacion || 0), 0);
        avgRating = sum / obj.opiniones.length;
      }
      obj.rating = avgRating;
      return obj;
    });

    res.status(200).json(freelancersWithRating);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar por subcategoría", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.eliminarUsuario(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
};
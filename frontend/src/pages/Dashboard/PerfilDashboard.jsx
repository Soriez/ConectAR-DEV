import { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Star,
  X,
  BadgeCheck,
  Code2,
  User as UserIcon,
  Crown,
  Lock,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import axios from "axios";
import LinkedinModal from "../../components/Modals/ModalsConfiguracion/LinkedinModal"; // Importar Modal
import ConfirmationModal from "../../components/Modals/ConfirmationModal";

// Lista preestablecida de tecnologías (si fallara la carga del backend)
const FALLBACK_TECHS = ["React", "NodeJS", "MongoDB", "JavaScript"];

// --- COMPONENTE AUXILIAR PARA LOS CONTADORES ---
const PremiumCounterItem = ({ label, value, isPremium }) => {
  // Si no es premium, usamos un valor falso visual o el real oculto
  const displayValue = value || 0;

  return (
    <li className="flex justify-between items-center text-sm py-2 border-b border-slate-50 last:border-0">
      <span className="text-slate-600 font-medium">{label}</span>

      <div className="relative flex items-center">
        {isPremium ? (
          // CASO PREMIUM: Muestra el número real claro y fuerte
          <span className="font-bold text-slate-800 text-base">{displayValue}</span>
        ) : (
          // CASO NO PREMIUM: Efecto degradado/blur y candado
          <div className="flex items-center gap-2" title="Disponible solo para Premium">
            <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-400 to-slate-200 blur-sm select-none">
              999
            </span>
            <Lock size={14} className="text-slate-400" />
          </div>
        )}
      </div>
    </li>
  );
};

const PerfilDashboard = () => {
  // 1. TODOS LOS HOOKS DEBEN IR AQUÍ, ANTES DE CUALQUIER RETURN CONDICIONAL

  // Hook 1: Obtener el contexto de autenticación
  const { user, isLoading, BASE_URL, setUser, token } = useContext(AuthContext); // Agregamos token
  const { showErrorModal, showSuccess } = useNotification();
  const navigate = useNavigate();

  // Hook 2: Lista de tecnologías disponibles (del backend)
  const [availableTechs, setAvailableTechs] = useState([]);

  // Hook 3: Estado del input del selector
  const [inputValue, setInputValue] = useState("");

  // Hook 4: Estado de las tecnologías seleccionadas por el usuario.
  // Lo inicializamos con un array vacío. La sincronización se hace en el useEffect.
  const [technologies, setTechnologies] = useState([]);

  //Hook 5: Estado para el boton freelancer premium
  const [isUpgrading, setIsUpgrading] = useState(false); // Estado para loading del botón

  // Hook 6: Estado para el modal de LinkedIn
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [showCancelRequestModal, setShowCancelRequestModal] = useState(false);
  const [isReapplyModalOpen, setIsReapplyModalOpen] = useState(false); // Hook 7: Estado para el modal de reenvío

  // 4. Cancelar Solicitud de Freelancer
  const handleCancelRequest = async () => {
    try {
      const { data } = await axios.put(`${BASE_URL}/api/users/cancelar-solicitud/${user._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Respuesta Cancelar:", data);

      // Asegurar que usamos el objeto de usuario correcto
      const updatedUser = data.user || data;
      console.log("Usuario Actualizado:", updatedUser);

      setUser(updatedUser);
      showSuccess("Solicitud cancelada correctamente");
      setShowCancelRequestModal(false);
    } catch (error) {
      console.error(error);
      showErrorModal("Error al cancelar la solicitud");
    }
  };

  // 2. EFECTO: Sincronizar 'technologies' con 'user.skills' cuando el usuario carga
  useEffect(() => {
    // Solo actualizamos si el usuario existe y es freelancer con skills
    if (user && user.role === 'freelancer' && user.skills) {
      setTechnologies(user.skills);
    } else {
      // Si no es freelancer o no tiene skills, aseguramos que el estado esté vacío.
      setTechnologies([]);
    }
  }, [user]); // Se ejecuta cada vez que el objeto 'user' cambia.

  // 3. EFECTO: Cargar las tecnologías disponibles del backend (solo se ejecuta una vez al montar)
  useEffect(() => {
    const fetchAvailableTechs = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/technologies/available`
        );
        setAvailableTechs(response.data);
      } catch (error) {
        setAvailableTechs(FALLBACK_TECHS);
      }
    };
    fetchAvailableTechs();
  }, [BASE_URL]);

  // 4. Lógica de Filtrado (Hook 5: useMemo)
  const filteredTechs = useMemo(() => {
    if (!inputValue) return []; // No mostrar nada si el input está vacío

    return (
      availableTechs
        // Filtra por el texto que escribe el usuario (ignorando mayúsculas/minúsculas)
        .filter((tech) =>
          tech.toUpperCase().includes(inputValue.trim().toUpperCase())
        )
        // Excluye las que ya están seleccionadas
        .filter(
          (tech) =>
            !technologies
              .map((t) => t.toUpperCase())
              .includes(tech.toUpperCase())
        )
        .slice(0, 10)
    ); // Muestra un máximo de 10 sugerencias
  }, [inputValue, availableTechs, technologies]);

  // 5. SALIDA TEMPRANA CONDICIONAL (DEBE IR DESPUÉS DE TODOS LOS HOOKS)
  if (isLoading || !user) {
    return (
      <div className="p-8 text-center text-slate-500">Cargando perfil...</div>
    );
  }

  // Variables de conveniencia (AHORA es seguro acceder a user.*)
  const isFreelancer = user.role === 'freelancer' || user.role === 'premium';
  const isPremium = user.plan === 'premium';
  const handleSelectTech = (tech) => {
    if (technologies.length < 5) {
      setTechnologies([...technologies, tech]);
      setInputValue(""); // Limpia el input después de seleccionar
    }
  };
  // Lógica para agregar tecnologías
  const handleAddTech = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTech = inputValue.trim().toUpperCase();

      // Verifica si la skill ya existe y si no se supera el límite de 5
      if (technologies.length < 5 && !technologies.includes(newTech)) {
        setTechnologies([...technologies, newTech]);
        setInputValue("");
      }
    }
  };

  // Lógica para borrar tecnologías
  const handleRemoveTech = (techToRemove) => {
    setTechnologies(technologies.filter((t) => t !== techToRemove)); // 👈 USAR setTechnologies
  };

  // Función para guardar las skills en el backend(tecnologias)
  const handleSaveSkills = async () => {
    // 1. Validar el límite antes de guardar (ya está en el modelo, pero es bueno en el front)
    if (technologies.length > 5) {
      // En un caso real, esto no debería pasar por la validación del input,
      // pero es una seguridad extra.
      return showErrorModal("Error: No puedes tener más de 5 habilidades.");
    }

    try {
      const skillsToSave = technologies; // Usamos el estado local 'technologies'

      // 2. Petición PUT al backend
      // La URL debe coincidir con tu userRoutes.js: PUT /api/users/:id/skills
      const response = await axios.put(
        `${BASE_URL}/api/users/${user._id}/skills`,
        { skills: skillsToSave } // El backend espera un objeto { skills: [...] }
      );

      // 3. ACTUALIZACIÓN DEL ESTADO GLOBAL (¡CRÍTICO!)
      // Si el backend responde con 200 OK y el JSON del usuario actualizado,
      // actualizamos el usuario en el contexto.
      setUser(response.data);

      showSuccess("Habilidades actualizadas con éxito.");
    } catch (error) {
      // 5. Manejo de Errores
      // El error de validación del límite de 5 viene con status 400.
      const errorMessage =
        error.response?.data?.message ||
        "Error desconocido al intentar guardar las habilidades.";

      // Este mensaje te dirá si el problema es de validación (Mongoose) o interno.
      showErrorModal(`Fallo al guardar: ${errorMessage}`);
    }
  };
  // --- Handler para hacerse Premium ---
  const handleUpgradeClick = () => {
    navigate('/hacerse-premium');
  };

  const handleDisconnectLinkedin = async () => {
    try {
      // No eliminamos el link de LinkedIn, solo cambiamos el rol a 'cliente'
      const response = await axios.put(
        `${BASE_URL}/api/users/${user._id}`,
        { role: "cliente" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data.user ? response.data.user : response.data;
      setUser(updatedUser);

    } catch (error) {
      throw error;
    }
  };

  const renderStars = () => {
    const rating = user.rating || 1;
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={18}
        className={`${index < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
          }`}
      />
    ));
  };



  const handleReapply = () => {
    navigate('/hacerse-freelancer');
    setIsReapplyModalOpen(false);
  };

  return (
    <div className="animate-fade-in-up relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mi Perfil</h1>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE REENVÍO */}
      {isReapplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Corregir Solicitud</h3>
            <p className="text-slate-600 mb-6">
              Para reenviar tu solicitud, necesitas revisar y corregir los datos ingresados en el formulario.
              <br /><br />
              <span className="text-sm text-slate-500 italic">Serás redirigido al formulario de registro de freelancer.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsReapplyModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleReapply}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Ir al Formulario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTO DEL CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Tarjeta de Identidad */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
            {isPremium && (
              <div className="absolute top-0 right-0 p-3 bg-yellow-400/10 rounded-bl-2xl">
                <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 uppercase tracking-wider">
                  <Crown size={14} className="fill-yellow-600" /> Premium
                </span>
              </div>
            )}

            {/* Avatar */}
            <div
              className={`
                w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 
                ${isPremium
                  ? "bg-slate-900 ring-yellow-400/50"
                  : "bg-blue-600 ring-blue-50"
                }
            `}
            >
              {user.nombre?.charAt(0)}
              {user.apellido?.charAt(0)}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800 capitalize">
                  {user.nombre} {user.apellido}
                </h2>

                {isFreelancer ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                    <BadgeCheck size={14} /> Freelancer
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                    <UserIcon size={14} /> Cliente
                  </span>
                )}
              </div>

              <p className="text-slate-500">{user.email}</p>

              {isFreelancer && (
                <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
                  <div
                    className="flex items-center gap-1"
                    title="Rating promedio"
                  >
                    <span className="font-bold text-slate-700 text-lg">
                      {Number(user.rating || 1).toFixed(1)}
                    </span>
                    <div className="flex gap-0.5">{renderStars()}</div>
                  </div>
                  {user.tarifa > 0 && (
                    <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100 font-semibold">
                      ${user.tarifa}/hora
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AVISO DE RECHAZO */}
          {user.estado === 'rechazado' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-red-100 rounded-full h-fit text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-red-700 text-lg mb-1">Solicitud Rechazada</h3>
                  <p className="text-red-600 text-sm mb-2">
                    Tu solicitud para ser freelancer no fue aprobada.
                  </p>
                  {user.motivoRechazo && (
                    <p className="text-red-800 text-sm italic bg-red-100/50 p-2 rounded-lg border border-red-100">
                      "Motivo: {user.motivoRechazo}"
                    </p>
                  )}
                  <p className="text-slate-600 text-sm mt-2">
                    Por favor, completa correctamente todos tus datos y vuelve a intentarlo.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {/* Botón para abrir modal de reenvío */}
                <button
                  onClick={() => setIsReapplyModalOpen(true)}
                  className="whitespace-nowrap px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm"
                >
                  Revisar Solicitud
                </button>
                {/* Link auxiliar para ir contactate con nosotros */}
                <button
                  onClick={() => navigate('/contacto')}
                  className="text-xs text-red-600 hover:underline"
                >
                  Contactate con nosotros
                </button>
              </div>
            </div>
          )}


          {/* 2. Sección de Descripción y Links (Solo Freelancers) */}
          {isFreelancer && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-3">
                Sobre mí
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {user.descripcion ||
                  "Aún no has agregado una descripción. ¡Edita tu perfil para que los clientes te conozcan mejor!"}
              </p>
              <div className="flex gap-4 mt-6">
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Ver LinkedIn
                  </a>
                )}
                {user.portfolio && (
                  <a
                    href={user.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-pink-600 font-medium hover:underline"
                  >
                    Ver Portfolio
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 3. Sección de Tecnologías (Solo Freelancers) */}
          {isFreelancer && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="text-blue-600" size={20} />
                <h3 className="font-bold text-slate-800 text-lg">
                  Skills & Tecnologías
                </h3>
              </div>

              {/* Tags Chips seleccionados */}
              <div className="flex flex-wrap gap-2 mb-4">
                {technologies.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    Agrega hasta 5 tecnologías a tu perfil.
                  </p>
                ) : (
                  technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 group hover:bg-blue-200 transition"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemoveTech(tech)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Selector de Tags */}
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleAddTech} // Llama a la lógica de 'Enter'
                  disabled={technologies.length >= 5}
                  placeholder={
                    technologies.length >= 5
                      ? "Límite alcanzado"
                      : "Ej: HTML, Python..."
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
                <span className="absolute right-3 top-3.5 text-xs text-slate-400">
                  {technologies.length}/5
                </span>

                {/* Sugerencias de búsqueda */}
                {filteredTechs.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-slate-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {filteredTechs.map((tech) => (
                      <div
                        key={tech}
                        onClick={() => handleSelectTech(tech)}
                        className="px-4 py-2 cursor-pointer hover:bg-slate-100 transition text-sm"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveSkills}
                disabled={
                  !isFreelancer || technologies.length === user.skills.length
                }
                className={`mt-4 w-full px-4 py-3 font-bold rounded-lg transition ${technologies.length === user.skills.length
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                Guardar Skills ({technologies.length}/5)
              </button>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Stats o CTA */}
        <div className="space-y-6">
          {!isFreelancer && (
            <div className={`bg-linear-to-br transition-all duration-300 rounded-xl p-6 text-white shadow-lg ${user.role === 'pendiente' ? 'from-orange-500 to-orange-600' : 'from-blue-600 to-indigo-700'
              }`}>
              {user.role === 'pendiente' ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={24} className="text-white animate-pulse" />
                    <h3 className="font-bold text-xl">Solicitud Pendiente</h3>
                  </div>
                  <p className="text-orange-100 text-sm mb-4">
                    Estamos revisando tu perfil. Pronto recibirás una notificación sobre el estado de tu solicitud.
                  </p>
                  <button
                    onClick={() => setShowCancelRequestModal(true)}
                    className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-lg transition shadow-sm border border-white/40"
                  >
                    Cancelar Petición
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-xl mb-2">¿Eres Desarrollador?</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Convierte tu cuenta a perfil Freelancer y comienza a ofrecer tus
                    servicios hoy mismo.
                  </p>
                  <button
                    onClick={() => setShowLinkedinModal(true)}
                    className="w-full bg-white text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-50 transition shadow-sm"
                  >
                    Convertirme en Freelancer
                  </button>
                </>
              )}
            </div>
          )}
          {/* Stats simples */}
          {/* 🎯 SECCIÓN ESTADÍSTICAS MODIFICADA */}
          {isFreelancer && (
            <div className={`bg-white rounded-xl shadow-sm border ${isPremium ? 'border-yellow-200 ring-1 ring-yellow-100' : 'border-slate-200'} p-6 transition-all duration-300`}>

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Estadísticas</h3>
                {isPremium && <Crown size={18} className="text-yellow-500 fill-yellow-500" />}
              </div>

              <ul className="space-y-1 mb-6">
                {/* Usamos el componente auxiliar para cada estadística */}
                <PremiumCounterItem
                  label="Visitas al perfil"
                  value={user.cantVisitas}
                  isPremium={isPremium}
                />

                {isFreelancer && (
                  <>
                    <PremiumCounterItem
                      label="Clics en LinkedIn"
                      value={user.cantAccesosLinkedin}
                      isPremium={isPremium}
                    />
                    <PremiumCounterItem
                      label="Clics en Portfolio"
                      value={user.cantAccesosPortfolio}
                      isPremium={isPremium}
                    />
                  </>
                )}
              </ul>

              {/* BOTÓN PARA HACERSE PREMIUM (Solo si es freelancer y NO es premium) */}
              {isFreelancer && !isPremium && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-3 text-center">
                    Desbloquea las métricas y obtén mayor visibilidad.
                  </p>
                  <button
                    onClick={handleUpgradeClick}
                    disabled={isUpgrading}
                    className="w-full bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 rounded-lg shadow-md shadow-yellow-200/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {isUpgrading ? (
                      <span className="text-sm">Procesando...</span>
                    ) : (
                      <>
                        <Crown size={18} />
                        <span>Hacerme Premium</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Mensaje para usuarios Premium */}
              {isPremium && (
                <div className="mt-4 pt-4 border-t border-yellow-100 text-center">
                  <p className="text-xs font-semibold text-yellow-700 bg-yellow-50 py-2 rounded-lg">
                    ✨ Tienes acceso total a tus métricas
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE LINKEDIN */}
      <LinkedinModal
        show={showLinkedinModal}
        onClose={() => setShowLinkedinModal(false)}
        isConnected={!!user.linkedin}
        baseUrl={BASE_URL}
        token={token}
        onDisconnect={handleDisconnectLinkedin}
      />

      {/* Modal de confirmación para cancelar solicitud */}
      <ConfirmationModal
        isOpen={showCancelRequestModal}
        onClose={() => setShowCancelRequestModal(false)}
        onConfirm={handleCancelRequest}
        title="¿Cancelar solicitud de Freelancer?"
        message="Si cancelas la solicitud, tu perfil volverá a ser de cliente y se borrarán los datos de freelancer ingresados. Podrás volver a enviar la solicitud cuando quieras."
        confirmText="Sí, cancelar solicitud"
        cancelText="No, mantener"
      />
    </div>
  );
};

export default PerfilDashboard;

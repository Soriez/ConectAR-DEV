import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

import CardPerfil from "../../components/Cards/CardPerfil";
import FreelancersInicio from "../../components/SeccionesInicio/FreelancersInicio";

/* ============================
   Utils
   ============================ */
const formatARS = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n || 0);

const getAvatarUrl = (nombreCompleto) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nombreCompleto
  )}&background=random&color=fff&size=220&bold=true`;

/* ============================
   Componente de página Perfil
   ============================ */
const Perfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { BASE_URL, user: currentUser } = useAuth();

  // Estados de datos
  const [freelancer, setFreelancer] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [suggested, setSuggested] = useState([]);

  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados de Modales
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Estado formulario opinión
  const [newReview, setNewReview] = useState({ score: 5, description: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Filtro de opiniones
  const [starFilter, setStarFilter] = useState(0); // 0 = todas

  // --- EFECTO: Cargar Datos REALES ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Obtener datos del Freelancer
        const userRes = await axios.get(`${BASE_URL}/api/users/${id}`);
        setFreelancer(userRes.data);

        // 2. Obtener Servicios del Freelancer
        try {
          const servicesRes = await axios.get(`${BASE_URL}/api/servicios/freelancer/${id}`);
          setServices(servicesRes.data);
        } catch (srvErr) {
          console.warn("No se pudieron cargar servicios o no tiene:", srvErr);
          setServices([]);
        }

        // 3. Obtener Opiniones Recibidas
        try {
          const reviewsRes = await axios.get(`${BASE_URL}/api/opinions/recibidas/${id}`);
          setReviews(reviewsRes.data);
        } catch (revErr) {
          console.warn("No se pudieron cargar opiniones:", revErr);
          setReviews([]);
        }

        // 4. Cargar Sugeridos (Basado en Skills)
        try {
          const suggestedRes = await axios.get(`${BASE_URL}/api/users/freelancers`);
          const allFreelancers = suggestedRes.data;

          // Filtrar:
          // 1. No es el mismo usuario
          // 2. "Cualquier perfil" -> Incluimos todos (premium o no) y sin filtro estricto de skills
          const relatedFreelancers = allFreelancers.filter(f => f._id !== id);

          // Mezclar y tomar hasta 6
          const shuffled = relatedFreelancers.sort(() => 0.5 - Math.random());
          setSuggested(shuffled.slice(0, 8));

        } catch (sugErr) {
          console.warn("Error cargando sugeridos:", sugErr);
          setSuggested([]);
        }

      } catch (err) {
        console.error("Error cargando perfil:", err);
        setError("No se pudo cargar la información del freelancer.");
      } finally {
        setLoading(false);
      }
    };

    if (id && BASE_URL) {
      fetchProfileData();
    }
  }, [id, BASE_URL]);

  // --- EFECTO: Registrar Visita (Controlado por IP en Backend) ---
  useEffect(() => {
    const trackVisit = async () => {
      if (!id || !BASE_URL) return;

      // No contar visitas propias si el usuario está logueado
      if (currentUser?._id === id) return;

      try {
        await axios.put(`${BASE_URL}/api/users/${id}/visitas`);
      } catch (error) {
        console.error("Error registrando visita:", error);
      }
    };

    trackVisit();
  }, [id, BASE_URL, currentUser]);

  // --- HANDLERS: Tracking ---
  const handleLinkedinClick = async () => {
    if (!freelancer?.linkedin) return;

    // Tracking con debounce (1 hora)
    const storageKey = `linkedin_click_${id}`;
    const lastClick = localStorage.getItem(storageKey);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    if (!lastClick || (now - parseInt(lastClick) > ONE_HOUR)) {
      try {
        // Ejecutamos la petición sin await para no bloquear la apertura de la ventana
        axios.put(`${BASE_URL}/api/users/${id}/linkedin`)
          .then(() => localStorage.setItem(storageKey, now.toString()))
          .catch(e => console.error("Error tracking linkedin", e));
      } catch (e) { console.error("Error initiating tracking", e); }
    }

    window.open(freelancer.linkedin, "_blank");
  };

  const handlePortfolioClick = async () => {
    if (!freelancer?.portfolio) return;

    // Tracking con debounce (1 hora)
    const storageKey = `portfolio_click_${id}`;
    const lastClick = localStorage.getItem(storageKey);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    if (!lastClick || (now - parseInt(lastClick) > ONE_HOUR)) {
      try {
        axios.put(`${BASE_URL}/api/users/${id}/portfolio`)
          .then(() => localStorage.setItem(storageKey, now.toString()))
          .catch(e => console.error("Error tracking portfolio", e));
      } catch (e) { console.error("Error initiating tracking", e); }
    }

    window.open(freelancer.portfolio, "_blank");
  };

  // --- HANDLERS: Opiniones ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Debes iniciar sesión para dejar una opinión.");
      navigate('/iniciar-sesion');
      return;
    }

    setReviewSubmitting(true);

    try {
      // Endpoint para crear opinión: POST /api/opinions
      const reviewData = {
        destinatarioId: id,
        puntuacion: newReview.score,
        opinion: newReview.description
      };

      await axios.post(`${BASE_URL}/api/opinions`, reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Recargar opiniones para evitar errores de renderizado y mostrar la data actualizada
      const reviewsRes = await axios.get(`${BASE_URL}/api/opinions/recibidas/${id}`);
      setReviews(reviewsRes.data);

      setShowReviewModal(false);
      setNewReview({ score: 5, description: "" });
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error publicando opinión:", error);
      alert(error.response?.data?.message || "Error al publicar la opinión.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // --- RENDER HELPERS ---
  const filteredReviews = starFilter === 0
    ? reviews
    : reviews.filter(r => r.puntuacion === starFilter);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + (curr.puntuacion || curr.calificacion || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 grid place-items-center">
        <div className="animate-pulse text-gray-500 font-medium">Cargando perfil...</div>
      </main>
    );
  }

  if (error || !freelancer) {
    return (
      <main className="min-h-screen bg-gray-50 grid place-items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Freelancer no encontrado"}</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Volver</button>
        </div>
      </main>
    );
  }

  const fullName = `${freelancer.nombre} ${freelancer.apellido}`;
  const avatar = getAvatarUrl(fullName);

  // Calcular promedio de tarifas
  let tariffDisplay = formatARS(freelancer.tarifa);
  if (services.length > 0) {
    const prices = services.map(s => s.precio).filter(p => p !== undefined && p !== null);
    if (prices.length > 0) {
      const total = prices.reduce((acc, curr) => acc + curr, 0);
      const average = total / prices.length;
      tariffDisplay = `${formatARS(average)}/h`;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Contenedor principal */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-10">

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          ← Volver al listado
        </button>

        {/* ===== GRID PERFIL ===== */}
        <section className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* -------- Columna Izquierda (Info Principal) -------- */}
          <div className="space-y-10">

            {/* Header Perfil */}
            <header className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {freelancer.plan === 'premium' && (
                  <span className="px-3 py-1 rounded-full bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                    ⭐ Premium
                  </span>
                )}
                {freelancer.skills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                    {skill}
                  </span>
                ))}
                {(!freelancer.skills || freelancer.skills.length === 0) && (
                  <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wide">
                    Freelancer
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {freelancer.descripcion ? freelancer.descripcion.split('.')[0] : "Freelancer Digital"}
              </h1>

              {/* Info Mobile (Visible solo en mobile) */}
              <div className="lg:hidden bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <img src={avatar} alt={fullName} className="w-20 h-20 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="text-xl font-bold">{fullName}</h3>
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      <span>★ {averageRating}</span>
                      <span className="text-gray-400 font-normal ml-1">({reviews.length} opiniones)</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Tarifa Promedio</p>
                    <p className="font-semibold">{tariffDisplay}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Disponibilidad</p>
                    <p className={`font-semibold ${freelancer.isDisponible ? 'text-green-600' : 'text-red-500'}`}>
                      {freelancer.isDisponible ? 'Disponible' : 'Ocupado'}
                    </p>
                  </div>
                </div>
                {/* Botones de Acción Mobile */}
                <div className="flex gap-2">
                  {freelancer.linkedin && (
                    <button onClick={handleLinkedinClick} className="flex-1 bg-[#0077b5] text-white py-2 rounded-lg font-medium text-sm hover:opacity-90 transition">
                      LinkedIn
                    </button>
                  )}
                  {freelancer.portfolio && (
                    <button onClick={handlePortfolioClick} className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-medium text-sm hover:opacity-90 transition">
                      Portfolio
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Sobre Mí */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Sobre {freelancer.nombre}</h2>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {freelancer.descripcion || "Este freelancer aún no ha agregado una descripción."}
              </p>
            </section>

            {/* Servicios Ofrecidos */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Servicios</h2>
              {services.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    <div key={service._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                          {service.tipoServicio?.nombre || service.nombre}
                        </h3>
                        <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100 whitespace-nowrap ml-2">
                          {service.tiempoEstimado || service.duracionEstimada || 'N/A'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                        {service.descripcionPersonalizada || service.descripcion}
                      </p>
                      <div className="pt-3 border-t border-gray-50 flex items-center justify-between mt-auto">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Precio</span>
                        <span className="font-bold text-xl text-gray-900">{formatARS(service.precio)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay servicios publicados.</p>
              )}
            </section>

            {/* Opiniones */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Opiniones <span className="text-lg text-gray-500 font-medium ml-1">({reviews.length})</span>
                </h2>
                <div className="flex gap-2">
                  {currentUser && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      + Agregar opinión
                    </button>
                  )}
                  {reviews.length > 0 && (
                    <button
                      onClick={() => setShowAllReviewsModal(true)}
                      className="text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver todas
                    </button>
                  )}
                </div>
              </div>

              {/* Resumen de Opiniones (Primeras 3) */}
              {reviews.length > 0 ? (
                <div className="grid gap-4">
                  {reviews.slice(0, 3).map((op) => (
                    <div key={op._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                            {op.autor?.nombre ? op.autor.nombre.charAt(0) : 'A'}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {op.autor?.nombre} {op.autor?.apellido || ""}
                          </span>
                        </div>
                        <div className="flex text-amber-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < (op.puntuacion || op.calificacion) ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{op.opinion || op.comentario}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-300">
                  <p className="text-gray-500">Aún no hay opiniones. ¡Sé el primero en comentar!</p>
                </div>
              )}
            </section>

          </div>

          {/* -------- Columna Derecha (Sticky Card) -------- */}
          <CardPerfil
            freelancer={freelancer}
            averageRating={averageRating}
            reviewsCount={reviews.length}
            handleLinkedinClick={handleLinkedinClick}
            handlePortfolioClick={handlePortfolioClick}
            tariffDisplay={tariffDisplay}
          />

        </section>

        {/* ===== PERFILES SUGERIDOS (Reutilizando componente) ===== */}
        {suggested.length > 0 && (
          <div className="mt-10">
            <FreelancersInicio
              data={suggested}
              title="Perfiles Sugeridos"
              subtitle="Profesionales con habilidades similares que podrían interesarte"
              showPremiumBadge={false}
            />
          </div>
        )}

        {/* ===== MODAL: AGREGAR OPINIÓN ===== */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Escribir opinión</h3>
                <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, score: star })}
                        className={`text-2xl transition-transform hover:scale-110 ${star <= newReview.score ? 'text-amber-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tu experiencia</label>
                  <textarea
                    required
                    value={newReview.description}
                    onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px] p-3 text-sm"
                    placeholder="Describe tu experiencia trabajando con este freelancer..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {reviewSubmitting ? "Publicando..." : "Publicar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== MODAL: TODAS LAS OPINIONES ===== */}
        {showAllReviewsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Opiniones ({reviews.length})</h3>
                  <p className="text-sm text-gray-500">Promedio general: {averageRating} ★</p>
                </div>
                <button onClick={() => setShowAllReviewsModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>

              {/* Filtros */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex gap-2 overflow-x-auto shrink-0">
                <button
                  onClick={() => setStarFilter(0)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${starFilter === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  Todas
                </button>
                {[5, 4, 3, 2, 1].map(star => (
                  <button
                    key={star}
                    onClick={() => setStarFilter(star)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${starFilter === star ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {star} ★
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto">
                {filteredReviews.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredReviews.map((op) => (
                      <div key={op._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                              {op.autor?.nombre ? op.autor.nombre.charAt(0) : '?'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{op.autor?.nombre || "Usuario"} {op.autor?.apellido || ""}</p>
                              <p className="text-xs text-gray-400">{new Date(op.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < (op.puntuacion || op.calificacion) ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mt-2">{op.opinion || op.comentario}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No hay opiniones con esta calificación.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL: ÉXITO ===== */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Opinión enviada!</h3>
              <p className="text-gray-600 mb-6">Gracias por compartir tu experiencia. Tu opinión ha sido publicada correctamente.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default Perfil;
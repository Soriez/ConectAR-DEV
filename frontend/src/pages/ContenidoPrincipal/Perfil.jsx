import { useState, useEffect } from "react";
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
   Componente de página Perfil (Dark Mode)
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
          setServices([]);
        }

        // 3. Obtener Opiniones Recibidas
        try {
          const reviewsRes = await axios.get(`${BASE_URL}/api/opinions/recibidas/${id}`);
          setReviews(reviewsRes.data);
        } catch (revErr) {
          setReviews([]);
        }

        // 4. Cargar Sugeridos (Basado en Skills)
        try {
          const suggestedRes = await axios.get(`${BASE_URL}/api/users/freelancers`);
          const allFreelancers = suggestedRes.data;
          const relatedFreelancers = allFreelancers.filter(f => f._id !== id);
          const shuffled = relatedFreelancers.sort(() => 0.5 - Math.random());
          setSuggested(shuffled.slice(0, 8));

        } catch (sugErr) {
          setSuggested([]);
        }

      } catch (err) {
        setError("No se pudo cargar la información del freelancer.");
      } finally {
        setLoading(false);
      }
    };

    if (id && BASE_URL) {
      fetchProfileData();
    }
  }, [id, BASE_URL]);

  // --- EFECTO: Registrar Visita ---
  useEffect(() => {
    const trackVisit = async () => {
      if (!id || !BASE_URL) return;
      if (currentUser?._id === id) return;
      try {
        await axios.put(`${BASE_URL}/api/users/${id}/visitas`);
      } catch (error) {
        throw error;
      }
    };
    trackVisit();
  }, [id, BASE_URL, currentUser]);

  // --- HANDLERS: Tracking ---
  const handleLinkedinClick = async () => {
    if (!freelancer?.linkedin) return;
    const storageKey = `linkedin_click_${id}`;
    const lastClick = localStorage.getItem(storageKey);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    if (!lastClick || (now - parseInt(lastClick) > ONE_HOUR)) {
      try {
        axios.put(`${BASE_URL}/api/users/${id}/linkedin`)
          .then(() => localStorage.setItem(storageKey, now.toString()))
          .catch(e => { throw new Error(e) });
      } catch (e) { throw e; }
    }
    window.open(freelancer.linkedin, "_blank");
  };

  const handlePortfolioClick = async () => {
    if (!freelancer?.portfolio) return;
    const storageKey = `portfolio_click_${id}`;
    const lastClick = localStorage.getItem(storageKey);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    if (!lastClick || (now - parseInt(lastClick) > ONE_HOUR)) {
      try {
        axios.put(`${BASE_URL}/api/users/${id}/portfolio`)
          .then(() => localStorage.setItem(storageKey, now.toString()))
          .catch(e => { throw new Error(e) });
      } catch (e) { throw e; }
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
      const reviewData = {
        destinatarioId: id,
        puntuacion: newReview.score,
        opinion: newReview.description
      };
      await axios.post(`${BASE_URL}/api/opinions`, reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const reviewsRes = await axios.get(`${BASE_URL}/api/opinions/recibidas/${id}`);
      setReviews(reviewsRes.data);
      setShowReviewModal(false);
      setNewReview({ score: 5, description: "" });
      setShowSuccessModal(true);
    } catch (error) {
      throw new Error(error);
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
    : "1.0";

  // CAMBIO: Loading oscuro
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 grid place-items-center">
        <div className="animate-pulse text-slate-400 font-medium">Cargando perfil...</div>
      </main>
    );
  }

  if (error || !freelancer) {
    return (
      <main className="min-h-screen bg-slate-950 grid place-items-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Freelancer no encontrado"}</p>
          <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline">Volver</button>
        </div>
      </main>
    );
  }

  const fullName = `${freelancer.nombre} ${freelancer.apellido}`;
  const avatar = getAvatarUrl(fullName);

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
    // CAMBIO: Fondo oscuro general
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">

      {/* Contenedor principal */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-10">

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
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
                  <span className="px-3 py-1 rounded-full bg-linear-to-r from-amber-500 to-orange-600 text-white text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg shadow-amber-900/20">
                    ⭐ Premium
                  </span>
                )}
                {freelancer.skills?.map((skill, idx) => (
                  // CAMBIO: Tags oscuros
                  <span key={idx} className="px-3 py-1 rounded-full bg-slate-800 text-blue-400 border border-slate-700 text-xs font-bold uppercase tracking-wide">
                    {skill}
                  </span>
                ))}
                {(!freelancer.skills || freelancer.skills.length === 0) && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wide">
                    Freelancer
                  </span>
                )}
              </div>

              {/* CAMBIO: Título blanco */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                {freelancer.descripcion ? freelancer.descripcion.split('.')[0] : "Freelancer Digital"}
              </h1>

              {/* Info Mobile (Visible solo en mobile) - Diseño Dark */}
              <div className="lg:hidden bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800">
                <div className="flex items-center gap-4 mb-4">
                  <img src={avatar} alt={fullName} className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-slate-700" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{fullName}</h3>
                    <div className="flex items-center text-amber-400 font-bold text-sm">
                      <span>★ {averageRating}</span>
                      <span className="text-slate-500 font-normal ml-1">({reviews.length} opiniones)</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-slate-500">Tarifa Promedio</p>
                    <p className="font-semibold text-white">{tariffDisplay}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Disponibilidad</p>
                    <p className={`font-semibold ${freelancer.isDisponible ? 'text-emerald-400' : 'text-red-400'}`}>
                      {freelancer.isDisponible ? 'Disponible' : 'Ocupado'}
                    </p>
                  </div>
                </div>
                {/* Botones de Acción Mobile */}
                <div className="flex gap-2">
                  {freelancer.linkedin && (
                    <button onClick={handleLinkedinClick} className="flex-1 bg-[#0077b5] text-white py-2 rounded-lg font-medium text-sm hover:opacity-90 transition shadow-lg">
                      LinkedIn
                    </button>
                  )}
                  {freelancer.portfolio && (
                    <button onClick={handlePortfolioClick} className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-medium text-sm hover:bg-slate-600 transition shadow-lg">
                      Portfolio
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Sobre Mí */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Sobre {freelancer.nombre}</h2>
              {/* CAMBIO: Texto gris claro */}
              <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
                {freelancer.descripcion || "Este freelancer aún no ha agregado una descripción."}
              </p>
            </section>

            {/* Servicios Ofrecidos */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Servicios</h2>
              {services.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    // CAMBIO: Card de servicio oscura
                    <div key={service._id} className="bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-800 hover:border-blue-500/30 transition-all group flex flex-col hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                          {service.tipoServicio?.nombre || service.nombre}
                        </h3>
                        <span className="text-xs font-bold bg-slate-800 text-blue-400 px-2 py-1 rounded-lg border border-slate-700 whitespace-nowrap ml-2">
                          {service.tiempoEstimado || service.duracionEstimada || 'N/A'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                        {service.descripcionPersonalizada || service.descripcion}
                      </p>
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between mt-auto">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Precio</span>
                        <span className="font-bold text-xl text-white">{formatARS(service.precio)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No hay servicios publicados.</p>
              )}
            </section>

            {/* Opiniones */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Opiniones <span className="text-lg text-slate-500 font-medium ml-1">({reviews.length})</span>
                </h2>
                <div className="flex gap-2">
                  {currentUser && currentUser._id !== id && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="text-sm font-medium text-blue-400 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                    >
                      Agregar opinión
                    </button>
                  )}
                  {reviews.length > 0 && (
                    <button
                      onClick={() => setShowAllReviewsModal(true)}
                      className="text-sm font-medium text-slate-400 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                    >
                      Ver todas
                    </button>
                  )}
                </div>
              </div>

              {/* Resumen de Opiniones (Primeras 3) - Dark Mode */}
              {reviews.length > 0 ? (
                <div className="grid gap-4">
                  {reviews.slice(0, 3).map((op) => (
                    <div key={op._id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-xs border border-slate-600">
                            {op.autor?.nombre ? op.autor.nombre.charAt(0) : 'A'}
                          </div>
                          <span className="font-semibold text-white">
                            {op.autor?.nombre} {op.autor?.apellido || ""}
                          </span>
                        </div>
                        <div className="flex text-amber-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < (op.puntuacion || op.calificacion) ? '★' : <span className="text-slate-700">★</span>}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{op.opinion || op.comentario}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/50 p-6 rounded-xl text-center border border-dashed border-slate-800">
                  <p className="text-slate-500">Aún no hay opiniones. ¡Sé el primero en comentar!</p>
                </div>
              )}
            </section>

          </div>

          {/* -------- Columna Derecha (Sticky Card) -------- */}
          {/* Se asume que CardPerfil internamente manejará su estilo o recibirá props, 
              pero al ser un componente externo, su contenedor aquí no afecta. */}
          <CardPerfil
            freelancer={freelancer}
            averageRating={averageRating}
            reviewsCount={reviews.length}
            handleLinkedinClick={handleLinkedinClick}
            handlePortfolioClick={handlePortfolioClick}
            tariffDisplay={tariffDisplay}
          />

        </section>

        {/* ===== PERFILES SUGERIDOS ===== */}
        {suggested.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-800">
            <FreelancersInicio
              data={suggested}
              title="Perfiles Sugeridos"
              subtitle="Profesionales con habilidades similares que podrían interesarte"
              showPremiumBadge={false}
            />
          </div>
        )}

        {/* ===== MODAL: AGREGAR OPINIÓN (DARK) ===== */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Escribir opinión</h3>
                <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Calificación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, score: star })}
                        className={`text-2xl transition-transform hover:scale-110 ${star <= newReview.score ? 'text-amber-400' : 'text-slate-700'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tu experiencia</label>
                  <textarea
                    required
                    value={newReview.description}
                    onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                    className="w-full rounded-lg bg-slate-800 border-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px] p-3 text-sm placeholder-slate-500"
                    placeholder="Describe tu experiencia trabajando con este freelancer..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 font-medium"
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

        {/* ===== MODAL: TODAS LAS OPINIONES (DARK) ===== */}
        {showAllReviewsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-800 animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-white">Opiniones ({reviews.length})</h3>
                  <p className="text-sm text-slate-400">Promedio general: {averageRating} ★</p>
                </div>
                <button onClick={() => setShowAllReviewsModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>

              {/* Filtros Modal */}
              <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex gap-2 overflow-x-auto shrink-0">
                <button
                  onClick={() => setStarFilter(0)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${starFilter === 0 ? 'bg-slate-700 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                >
                  Todas
                </button>
                {[5, 4, 3, 2, 1].map(star => (
                  <button
                    key={star}
                    onClick={() => setStarFilter(star)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${starFilter === star ? 'bg-amber-900/40 text-amber-400 border border-amber-500/30' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                  >
                    {star} ★
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto">
                {filteredReviews.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredReviews.map((op) => (
                      <div key={op._id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border border-slate-600">
                              {op.autor?.nombre ? op.autor.nombre.charAt(0) : '?'}
                            </div>
                            <div>
                              <p className="font-bold text-white">{op.autor?.nombre || "Usuario"} {op.autor?.apellido || ""}</p>
                              <p className="text-xs text-slate-500">{new Date(op.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < (op.puntuacion || op.calificacion) ? '★' : <span className="text-slate-700">★</span>}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed mt-2">{op.opinion || op.comentario}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    No hay opiniones con esta calificación.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL: ÉXITO (DARK) ===== */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-slate-800 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Opinión enviada!</h3>
              <p className="text-slate-400 mb-6">Gracias por compartir tu experiencia. Tu opinión ha sido publicada correctamente.</p>
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
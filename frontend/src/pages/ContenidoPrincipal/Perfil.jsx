import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

import CardPerfil from "../../components/Cards/CardPerfil";

/* ============================
   Utils
   ============================ */
const formatARS = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const formatMonthYearEs = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-AR", { year: "numeric", month: "long" });
  } catch {
    return iso;
  }
};

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

  // Estado formulario opinión
  const [newReview, setNewReview] = useState({ score: 5, description: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Filtro de opiniones
  const [starFilter, setStarFilter] = useState(0); // 0 = todas

  // --- EFECTO: Cargar Datos Iniciales (MOCK) ---
  useEffect(() => {
    // Simulación de carga
    setLoading(true);
    setTimeout(() => {
      // 1. Mock Freelancer
      setFreelancer({
        _id: "1",
        nombre: "Juan",
        apellido: "Pérez",
        descripcion: "Desarrollador Full Stack con más de 5 años de experiencia en MERN Stack. Apasionado por crear experiencias web únicas y performantes.",
        tarifa: 25000,
        isDisponible: true,
        linkedin: "https://linkedin.com",
        portfolio: "https://github.com",
        skills: ["React", "Node.js", "MongoDB", "Tailwind", "TypeScript"],
        createdAt: "2023-01-15T00:00:00.000Z"
      });

      // 2. Mock Servicios
      setServices([
        { _id: "s1", nombre: "Desarrollo Web Completo", descripcion: "Sitio web desde cero, responsive y optimizado.", precio: 150000, duracionEstimada: "2 semanas" },
        { _id: "s2", nombre: "Auditoría de Código", descripcion: "Revisión y optimización de tu código existente.", precio: 50000, duracionEstimada: "3 días" },
        { _id: "s3", nombre: "Consultoría Técnica", descripcion: "Asesoramiento sobre arquitectura y tecnologías.", precio: 20000, duracionEstimada: "1 hora" }
      ]);

      // 3. Mock Opiniones
      setReviews([
        { _id: "r1", calificacion: 5, comentario: "Excelente profesional, entregó todo a tiempo.", emisor: { nombre: "María Garcia" }, createdAt: "2023-10-10" },
        { _id: "r2", calificacion: 4, comentario: "Muy buen trabajo, aunque hubo un pequeño retraso.", emisor: { nombre: "Carlos Lopez" }, createdAt: "2023-09-25" },
        { _id: "r3", calificacion: 5, comentario: "Increíble calidad de código. Recomendado.", emisor: { nombre: "Ana Torres" }, createdAt: "2023-11-05" }
      ]);

      // 4. Mock Sugeridos
      setSuggested([
        { _id: "2", nombre: "Laura", apellido: "Gomez", descripcion: "Diseñadora UX/UI", tarifa: 18000 },
        { _id: "3", nombre: "Pedro", apellido: "Martinez", descripcion: "DevOps Engineer", tarifa: 30000 },
        { _id: "4", nombre: "Sofia", apellido: "Rodriguez", descripcion: "Marketing Digital", tarifa: 15000 },
        { _id: "5", nombre: "Lucas", apellido: "Fernandez", descripcion: "Redactor SEO", tarifa: 10000 }
      ]);

      setLoading(false);
    }, 800); // Simular un pequeño delay de red
  }, [id]);

  // --- HANDLERS: Tracking (MOCK) ---
  const handleLinkedinClick = async () => {
    if (!freelancer?.linkedin) return;
    console.log("MOCK: Tracking LinkedIn click for user", id);
    window.open(freelancer.linkedin, "_blank");
  };

  const handlePortfolioClick = async () => {
    if (!freelancer?.portfolio) return;
    console.log("MOCK: Tracking Portfolio click for user", id);
    window.open(freelancer.portfolio, "_blank");
  };

  // --- HANDLERS: Opiniones (MOCK) ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    /* 
    if (!currentUser) {
      alert("Debes iniciar sesión para dejar una opinión.");
      return;
    } 
    */
    setReviewSubmitting(true);

    // Simular petición
    setTimeout(() => {
      const newReviewMock = {
        _id: Date.now().toString(),
        calificacion: newReview.score,
        comentario: newReview.description,
        emisor: { nombre: currentUser?.nombre || "Usuario Test" },
        createdAt: new Date().toISOString()
      };

      setReviews([newReviewMock, ...reviews]);
      setShowReviewModal(false);
      setNewReview({ score: 5, description: "" });
      setReviewSubmitting(false);
      alert("¡Opinión publicada con éxito! (Simulado)");
    }, 1000);
  };

  // --- RENDER HELPERS ---
  const filteredReviews = starFilter === 0
    ? reviews
    : reviews.filter(r => r.calificacion === starFilter);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.calificacion, 0) / reviews.length).toFixed(1)
    : "5.0";

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
                    <p className="text-gray-500">Tarifa</p>
                    <p className="font-semibold">{formatARS(freelancer.tarifa)}/h</p>
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
                    <div key={service._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{service.nombre}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{service.descripcion}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-600">{formatARS(service.precio)}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{service.duracionEstimada || 'N/A'}</span>
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
                <h2 className="text-2xl font-bold text-gray-900">Opiniones</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Agregar opinión
                  </button>
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
                            {op.emisor?.nombre ? op.emisor.nombre.charAt(0) : 'A'}
                          </div>
                          <span className="font-semibold text-gray-900">{op.emisor?.nombre || "Anónimo"}</span>
                        </div>
                        <div className="flex text-amber-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < op.calificacion ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{op.comentario}</p>
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
          />

        </section>

        {/* ===== PERFILES SUGERIDOS ===== */}
        {suggested.length > 0 && (
          <section className="mt-20 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Perfiles sugeridos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {suggested.map((sug) => (
                <div key={sug._id} onClick={() => navigate(`/perfil/${sug._id}`)} className="group cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="h-24 bg-linear-to-r from-blue-500 to-purple-600"></div>
                  <div className="px-5 pb-5">
                    <div className="relative -mt-10 mb-3">
                      <img src={getAvatarUrl(`${sug.nombre} ${sug.apellido}`)} alt={sug.nombre} className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{sug.nombre} {sug.apellido}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{sug.descripcion || "Freelancer digital"}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-900">{formatARS(sug.tarifa)}/h</span>
                      <span className="text-blue-600 font-medium">Ver perfil →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
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
                              {op.emisor?.nombre ? op.emisor.nombre.charAt(0) : '?'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{op.emisor?.nombre || "Usuario"}</p>
                              <p className="text-xs text-gray-400">{new Date(op.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < op.calificacion ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mt-2">{op.comentario}</p>
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

      </div>
    </main>
  );
};

export default Perfil;

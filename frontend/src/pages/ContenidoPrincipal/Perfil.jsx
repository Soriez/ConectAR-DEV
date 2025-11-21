import React from "react";
import { useParams, useNavigate } from "react-router";
import dbFreelancers from "../../data/freelancers.json";

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

// Mapea el registro del JSON crudo a la estructura que usa el diseño del perfil
const mapFreelancerFromJson = (raw) => {
  const name = `${raw.nombre} ${raw.apellido}`;
  const about = raw.descripcion || "";
  const hourlyRate = raw.tarifa || 0;

  // Tags según la descripción (muy simple, podés mejorarlo luego)
  const descLower = about.toLowerCase();
  const tags = [];
  if (descLower.includes("web") || descLower.includes("sitios")) {
    tags.push("Desarrollo Web");
  }
  if (descLower.includes("diseño") || descLower.includes("gráfico")) {
    tags.push("Diseño");
  }
  if (tags.length === 0) tags.push("Freelancer");

  // Opiniones de demo usando el campo "opiniones" del JSON
  const opinions = raw.opiniones
    ? [
        {
          name: "Cliente",
          score: 5,
          text: raw.opiniones,
        },
      ]
    : [];

  return {
    name,
    title: "Freelancer digital", // si querés, podés derivar esto de la descripción
    avatar: getAvatarUrl(name),
    location: "Argentina",
    modality: "Remoto",
    hourlyRate,
    responseTime: "24h",
    students: "—",
    rating: 5.0,
    reviewsCount: opinions.length || 1,
    lastUpdatedISO: "2025-11-01",
    about,
    tags,
    opinions,
    similar: [], // lo podés llenar después si querés
  };
};

/* ============================
   Componente de página Perfil
   ============================ */
const Perfil = () => {
  const { id } = useParams(); // viene de /perfil/:id
  const navigate = useNavigate();

  const [data, setData] = React.useState(null);
  const [status, setStatus] = React.useState("loading"); // loading | ready | error
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setStatus("loading");
    setError("");

    // Buscar en el JSON por id
    const raw = dbFreelancers.find((f) => String(f.id) === String(id));

    if (!raw) {
      setError("Freelancer no encontrado");
      setStatus("error");
      return;
    }

    const mapped = mapFreelancerFromJson(raw);
    setData(mapped);
    setStatus("ready");
  }, [id]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-linear-to-b from-gray-700 to-gray-900 pb-0 text-slate-50 grid place-items-center">
        <div className="animate-pulse text-slate-200/80">Cargando perfil…</div>
      </main>
    );
  }

  if (status === "error" || !data) {
    return (
      <main className="min-h-screen bg-linear-to-b from-gray-700 to-gray-900 pb-0 text-slate-50 grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-red-400/40 bg-red-900/20 px-4 py-3 text-red-100">
            {error || "No se pudo cargar el perfil"}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-50 border border-slate-600 hover:bg-slate-700 text-sm"
          >
            Volver
          </button>
        </div>
      </main>
    );
  }

  const {
    name,
    title,
    avatar,
    modality,
    hourlyRate,
    responseTime,
    students,
    rating,
    reviewsCount,
    lastUpdatedISO,
    about,
    tags,
    opinions,
    similar,
  } = data;

  return (
    <main className="min-h-screen bg-white  text-black-50
    ">
      {/* Contenedor principal */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-10">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-sm text-black hover:text-black"
        >
          ← Volver al listado
        </button>

        {/* ===== GRID PERFIL ===== */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_380px]">
          {/* -------- Columna izquierda -------- */}
          <div className="space-y-10">
            {/* Chips / materias */}
            <div className="flex flex-wrap gap-3">
              {tags?.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rounded-full border border-slate-600/60 bg-slate-800/70 px-4 py-1.5 text-sm font-medium text-black hover:bg-slate-700/70"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Título / oferta */}
            <header className="space-y-6">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>

              {/* 👇 Tarjeta visible SOLO en móviles */}
              <div className="block md:hidden mt-8">
                <div className="rounded-2xl border border-slate-600/60 bg-slate-800/70 p-6 shadow-2xl">
                  <div className="mx-auto flex w-full max-w-[220px] items-center justify-center">
                    <img
                      src={avatar}
                      alt={`Foto de ${name}`}
                      className="h-44 w-44 rounded-2xl object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-center text-2xl font-extrabold">
                    {name}
                  </h3>
                  <p className="mt-1 text-center text-black">
                    <span className="text-amber-300">★</span>{" "}
                    {rating.toFixed(1)}{" "}
                    <span className="opacity-80">
                      ({reviewsCount} opiniones)
                    </span>
                  </p>
                  <hr className="my-6 border-slate-600/60" />
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt>Tarifa</dt>
                      <dd className="font-semibold">
                        {formatARS(hourlyRate)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Respuesta</dt>
                      <dd className="font-semibold">{responseTime}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Alumnos</dt>
                      <dd className="font-semibold">{students}</dd>
                    </div>
                  </dl>
                  <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Contactar al profe
                  </button>
                  <p className="mt-2 text-center font-semibold text-amber-300">
                    1ª clase gratis
                  </p>
                </div>
              </div>

              {/* Modalidad */}
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  Modalidad del trabajo
                </h2>
                <div className="mt-3">
                  <button className="rounded-full border border-slate-600/60 bg-slate-800/70 px-4 py-1.5 text-sm font-medium hover:bg-slate-700/70">
                    {modality}
                  </button>
                </div>
              </div>
            </header>

            {/* ===== Sobre ===== */}
            <section id="sobre" className="space-y-3">
              <h2 className="text-2xl font-extrabold">
                Sobre <span className="text-blue-300">{name}</span>
              </h2>
              <p className="max-w-[68ch] text-slate-100/90">{about}</p>
              <p className="text-slate-200/90">
                Tarifa actual:{" "}
                <span className="font-semibold text-blue-300">
                  {formatARS(hourlyRate)}/h
                </span>
              </p>
              <p className="text-slate-200/90">
                Última actualización:{" "}
                <time dateTime={lastUpdatedISO}>
                  {formatMonthYearEs(lastUpdatedISO)}
                </time>
                .
              </p>
            </section>

            {/* ===== Opiniones ===== */}
            <section id="opiniones" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold">Opiniones</h2>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-800/70 px-3 py-1.5 text-sm font-semibold">
                  <span className="text-amber-300">★</span>{" "}
                  {rating.toFixed(1)}{" "}
                  <span className="text-slate-300/80">
                    ({reviewsCount} opiniones)
                  </span>
                </div>
              </div>

              {opinions && opinions.length > 0 ? (
                <ul className="grid gap-4">
                  {opinions.map((op) => (
                    <li
                      key={op.name + op.text.slice(0, 8)}
                      className="rounded-2xl border border-slate-600/60 bg-slate-800/70 p-4"
                    >
                      <article className="space-y-2">
                        <header className="flex items-center justify-between">
                          <h3 className="font-bold">{op.name}</h3>
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-200/80 font-bold text-slate-900">
                            {op.score ?? 5}
                          </span>
                        </header>
                        <p className="text-slate-100/90">{op.text}</p>
                      </article>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm">
                  Aún no hay opiniones cargadas.
                </p>
              )}
            </section>
          </div>

          {/* -------- Columna derecha (tarjeta sticky) -------- */}
          <aside className="hidden md:block self-start md:sticky md:top-6">
            <div className="rounded-2xl border border-slate-600/60 bg-slate-800/70 p-6 shadow-2xl">
              <div className="mx-auto flex w-full max-w-[220px] items-center justify-center">
                <img
                  src={avatar}
                  alt={`Foto de ${name}`}
                  className="h-44 w-44 rounded-2xl object-cover"
                />
              </div>
              <h3 className="mt-4 text-center text-2xl font-extrabold">
                {name}
              </h3>
              <p className="mt-1 text-center text-slate-300/90">
                <span className="text-amber-300">★</span>{" "}
                {rating.toFixed(1)}{" "}
                <span className="opacity-80">
                  ({reviewsCount} opiniones)
                </span>
              </p>
              <hr className="my-6 border-slate-600/60" />
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt>Tarifa</dt>
                  <dd className="font-semibold">{formatARS(hourlyRate)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Respuesta</dt>
                  <dd className="font-semibold">{responseTime}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Alumnos</dt>
                  <dd className="font-semibold">{students}</dd>
                </div>
              </dl>
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Contactar al profe
              </button>
              <p className="mt-2 text-center font-semibold text-amber-300">
                1ª clase gratis
              </p>
            </div>
          </aside>
        </section>

        {/* ===== Carrusel de similares (vacío por ahora) ===== */}
        {similar && similar.length > 0 && (
          <section id="similares" className="mt-12">
            <h2 className="text-2xl font-extrabold mb-4">
              Freelancers similares
            </h2>

            <div className="-mx-4 overflow-x-auto px-4">
              <ul className="grid snap-x snap-mandatory grid-flow-col auto-cols-[85%] gap-4 md:auto-cols-[32%] lg:auto-cols-[24%]">
                {similar.map((f) => (
                  <li key={f.name} className="snap-start">
                    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-600/60 bg-slate-800/70 shadow-xl">
                      <figure className="relative">
                        <img
                          src={f.img}
                          alt={`Foto de ${f.name}`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                          <h3 className="text-2xl font-extrabold text-white drop-shadow">
                            {f.name}
                          </h3>
                          <p className="font-semibold text-white/90 drop-shadow">
                            {f.specialty}
                          </p>
                        </figcaption>
                      </figure>
                      <div className="space-y-3 p-4">
                        <p className="font-semibold text-slate-100">
                          <span className="text-amber-300">
                            {f.ratingText}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {f.chips?.map((c) => (
                            <span
                              key={c}
                              className="rounded-full border border-slate-600/60 bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Perfil;

const PoliticaCookies = () => {
  return (
    // CAMBIO: Fondo degradado oscuro
    <section className="bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 py-20 px-6 min-h-screen text-slate-300">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">
          Política de Cookies de ConectAR-DEV
        </h2>

        <p className="text-slate-400 mb-12">
          <span className="text-sm opacity-70">Ultima actualización: 8 de Noviembre 2025.</span>
        </p>

        <div className="space-y-8 text-left">
          
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              1. ¿Qué son las cookies?
            </h3>
            <p className="text-slate-300">
                Las cookies son pequeños archivos de texto que los sitios web
                almacenan en el dispositivo del usuario para mejorar su experiencia de navegación y recopilar
                información estadística de forma anónima.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              2. Tipos de cookies utilizadas
            </h3>
            <div className="text-slate-300">
                 ConectAR-DEV utiliza los siguientes tipos de cookies:
                 <ul className="list-none mt-2 space-y-1 text-slate-400">
                    <li>- Cookies esenciales: necesarias para el funcionamiento del Sitio</li>
                    <li>- Cookies analíticas: permiten obtener estadísticas sobre el uso del Sitio y mejorar su rendimiento.</li>
                    <li>- Cookies de terceros: pueden ser instaladas por servicios externos, como Google Analytics o redes sociales.</li>
                 </ul>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              3. Gestión de cookies
            </h3>
            <p className="text-slate-300">
              El usuario puede configurar su navegador para aceptar, rechazar o eliminar
              cookies. Tenga en cuenta que la desactivación de ciertas cookies puede afectar el correcto
              funcionamiento del Sitio
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              4. Consentimiento
            </h3>
            <p className="text-slate-300">
                 Al continuar navegando en el Sitio, el usuario acepta el uso de cookies conforme
                 a la presente Política
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              5. Modificaciones
            </h3>
            <p className="text-slate-300">
                ConectAR-DEV podrá actualizar esta Política de Cookies en cualquier momento.
                Las modificaciones serán publicadas en el Sitio y serán efectivas desde su publicación.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PoliticaCookies
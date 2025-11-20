
const PoliticaCookies = () => {
  return (
    <section className="bg-linear-to-b from-blue-300 via-blue-400 to-blue-500 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10">
          Política de Cookies de ConectAR-DEV
        </h2>

        <p className="text-gray-600 mb-12">
          Ultima actualización: 8 de Noviembre 2025.
        </p>

        <div className="space-y-8 text-left">
          {/* Punto 1 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              1. ¿Qué son las cookies?
            </h3>
            <p className="text-gray-600">
                Las cookies son pequeños archivos de texto que los sitios web
                almacenan en el dispositivo del usuario para mejorar su experiencia de navegación y recopilar
                información estadística de forma anónima.
            </p>
          </div>

          {/* Punto 2 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              2. Tipos de cookies utilizadas
            </h3>
            <p className="text-gray-600">
                 ConectAR-DEV utiliza los siguientes tipos de cookies:
                 <ul>
                    <li>- Cookies esenciales: necesarias para el funcionamiento del Sitio</li>
                    <li>- Cookies analíticas: permiten obtener estadísticas sobre el uso del Sitio y mejorar su rendimiento.</li>
                    <li>- Cookies de terceros: pueden ser instaladas por servicios externos, como Google Analytics o redes sociales.</li>
                 </ul>
            </p>
          </div>

          {/* Punto 3 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              3. Gestión de cookies
            </h3>
            <p className="text-gray-600">
              El usuario puede configurar su navegador para aceptar, rechazar o eliminar
              cookies. Tenga en cuenta que la desactivación de ciertas cookies puede afectar el correcto
              funcionamiento del Sitio
            </p>
          </div>

          {/* Punto 4 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              4. Consentimiento
            </h3>
            <p className="text-gray-600">
                 Al continuar navegando en el Sitio, el usuario acepta el uso de cookies conforme
                 a la presente Política
            </p>
          </div>

          {/* Punto 5 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              5. Modificaciones
            </h3>
            <p className="text-gray-600">
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
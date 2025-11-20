

const TerminosPrivacidad = () => {
  return (
    <section className="bg-linear-to-b from-blue-300 via-blue-400 to-blue-500 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10">
          Política de Privacidad de ConectAR-DEV
        </h2>

        <p className="text-gray-600 mb-12">
          Ultima actualización: 8 de Noviembre 2025.
        </p>

        <div className="space-y-8 text-left">
          {/* Punto 1 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              1. Responsable del Tratamiento
            </h3>
            <p className="text-gray-600">
                El responsable del tratamiento de los datos personales es
                ConectAR-DEV, con domicilio en [DIRECCIÓN], República Argentina.
            </p>
          </div>

          {/* Punto 2 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              2. Finalidad del Tratamiento
            </h3>
            <p className="text-gray-600">
                 Los datos personales recolectados a través del Sitio se utilizarán para:
                 <ul>
                    <li>- Permitir el registro y funcionamiento de las cuentas de usuario.</li>
                    <li>- Facilitar la conexión y comunicación entre Freelancers y Clientes.</li>
                    <li>- Enviar comunicaciones relacionadas con el uso del Sitio.</li>
                    <li>- Mejorar la calidad y seguridad del servicio.</li>
                 </ul>
                 El registro y uso del Sitio son gratuitos, y los datos se utilizan únicamente con fines operativos y de
                 contacto dentro de la plataforma.
            </p>
          </div>

          {/* Punto 3 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              3. Base Legal
            </h3>
            <p className="text-gray-600">
              El tratamiento se realiza de conformidad con la Ley N.º 25.326, y el usuario presta su 
              consentimiento libre, expreso e informado al registrarse o al utilizar el Sitio.
            </p>
          </div>

          {/* Punto 4 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              4. Comunicación y Cesión de Datos
            </h3>
            <p className="text-gray-600">
                Los datos personales no serán vendidos, alquilados ni cedidos 
                a terceros sin el consentimiento del titular, salvo obligación legal o requerimiento judicial.
            </p>
          </div>

          {/* Punto 5 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              5. Derechos de los Titulares
            </h3>
            <p className="text-gray-600">
                Los usuarios podrán ejercer sus derechos de acceso, rectificación,
                actualización, supresión y oposición dirigiendo un correo electrónico a <a href="mailto:hola@conectar-dev.com">hola@conectar-dev.com</a>. La
                Dirección Nacional de Protección de Datos Personales es el órgano de control de la Ley 25.326 y
                tiene la atribución de atender denuncias o reclamos relacionados con el tratamiento de datos
                personales.
            </p>
          </div>

          {/* Punto 6 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              6. Conservación de los Datos
            </h3>
            <p className="text-gray-600">
                Los datos serán conservados mientras el usuario mantenga su
                cuenta activa o durante el tiempo necesario para cumplir con las finalidades antes mencionadas.
            </p>
          </div>

          {/* Punto 7 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              7. Seguridad ConectAR-DEV
            </h3>
            <p className="text-gray-600">
                adopta medidas técnicas y organizativas adecuadas para garantizar
                la confidencialidad e integridad de los datos personales y prevenir accesos no autorizados.
            </p>
          </div>

          {/* Punto 8 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              8. Menores de Edad
            </h3>
            <p className="text-gray-600">
                El Sitio no está destinado a menores de 18 años. Si se detecta el registro de
                un menor sin consentimiento de sus padres o tutores, la cuenta será eliminada y los datos
                borrados.
            </p>
          </div>

          {/* Punto 9 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              9. Modificaciones de la Política
            </h3>
            <p className="text-gray-600">
                ConectAR-DEV podrá actualizar esta Política de Privacidad en
                cualquier momento. Las modificaciones serán publicadas en el Sitio y entrarán en vigencia al
                momento de su publicación.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TerminosPrivacidad
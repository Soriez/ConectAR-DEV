const TerminosPrivacidad = () => {
  return (
    // CAMBIO: Fondo degradado oscuro
    <section className="bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 py-20 px-6 min-h-screen text-slate-300">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">
          Política de Privacidad de ConectAR-DEV
        </h2>

        <p className="text-slate-400 mb-12">
          <span className="text-sm opacity-70">Ultima actualización: 8 de Noviembre 2025.</span>
        </p>

        <div className="space-y-8 text-left">
          
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              1. Responsable del Tratamiento
            </h3>
            <p className="text-slate-300">
                El responsable del tratamiento de los datos personales es
                ConectAR-DEV, con domicilio en [DIRECCIÓN], República Argentina.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              2. Finalidad del Tratamiento
            </h3>
            <div className="text-slate-300">
                 Los datos personales recolectados a través del Sitio se utilizarán para:
                 <ul className="list-none mt-2 space-y-1 text-slate-400">
                    <li>- Permitir el registro y funcionamiento de las cuentas de usuario.</li>
                    <li>- Facilitar la conexión y comunicación entre Freelancers y Clientes.</li>
                    <li>- Enviar comunicaciones relacionadas con el uso del Sitio.</li>
                    <li>- Mejorar la calidad y seguridad del servicio.</li>
                 </ul>
                 <p className="mt-3">
                 El registro y uso del Sitio son gratuitos, y los datos se utilizan únicamente con fines operativos y de
                 contacto dentro de la plataforma.
                 </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              3. Base Legal
            </h3>
            <p className="text-slate-300">
              El tratamiento se realiza de conformidad con la Ley N.º 25.326, y el usuario presta su 
              consentimiento libre, expreso e informado al registrarse o al utilizar el Sitio.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              4. Comunicación y Cesión de Datos
            </h3>
            <p className="text-slate-300">
                Los datos personales no serán vendidos, alquilados ni cedidos 
                a terceros sin el consentimiento del titular, salvo obligación legal o requerimiento judicial.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              5. Derechos de los Titulares
            </h3>
            <p className="text-slate-300">
                Los usuarios podrán ejercer sus derechos de acceso, rectificación,
                actualización, supresión y oposición dirigiendo un correo electrónico a <a href="mailto:hola@conectar-dev.com" className="text-blue-400 hover:underline">hola@conectar-dev.com</a>. La
                Dirección Nacional de Protección de Datos Personales es el órgano de control de la Ley 25.326 y
                tiene la atribución de atender denuncias o reclamos relacionados con el tratamiento de datos
                personales.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              6. Conservación de los Datos
            </h3>
            <p className="text-slate-300">
                Los datos serán conservados mientras el usuario mantenga su
                cuenta activa o durante el tiempo necesario para cumplir con las finalidades antes mencionadas.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              7. Seguridad ConectAR-DEV
            </h3>
            <p className="text-slate-300">
                adopta medidas técnicas y organizativas adecuadas para garantizar
                la confidencialidad e integridad de los datos personales y prevenir accesos no autorizados.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              8. Menores de Edad
            </h3>
            <p className="text-slate-300">
                El Sitio no está destinado a menores de 18 años. Si se detecta el registro de
                un menor sin consentimiento de sus padres o tutores, la cuenta será eliminada y los datos
                borrados.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              9. Modificaciones de la Política
            </h3>
            <p className="text-slate-300">
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
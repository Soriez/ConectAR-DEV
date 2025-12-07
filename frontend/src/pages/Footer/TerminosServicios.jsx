const TerminosServicios = () => {

  return (
    // CAMBIO: Fondo degradado oscuro
    <section className="bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 py-20 px-6 min-h-screen text-slate-300">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">
          Términos y Servicios 
        </h2>

        <p className="text-slate-400 mb-12">
          A continuación se detallan los términos y condiciones que regulan el uso de nuestro sitio y servicios.  
          Por favor, lee atentamente cada punto antes de continuar.
          <br/>
          <span className="text-sm opacity-70">Ultima actualización: 8 de Noviembre 2025.</span>
        </p>

        <div className="space-y-8 text-left">
          {/* Mapeo de puntos manual conservado, actualizado a estilos dark */}
          
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              1. Aceptación de los Términos
            </h3>
            <p className="text-slate-300">
              El presente documento establece los Términos y Condiciones de Uso del sitio web ConectAR-DEV (en adelante, “el Sitio”), cuyo titular es ConectAR-DEV, con domicilio en Avenida Siemper Viva, República Argentina. El uso del Sitio implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. Si el usuario no está de acuerdo con alguno de ellos, deberá abstenerse de utilizar el Sitio.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              2. Objeto del Sitio ConectAR-DEV
            </h3>
            <p className="text-slate-300">
             es una plataforma digital que actúa como intermediario entre
             personas, profesionales o empresas (en adelante, “Freelancers”) y potenciales contratantes (en
             adelante, “Clientes”), con el objetivo de facilitar el contacto y la comunicación entre ambas partes
             para el desarrollo de proyectos o servicios. El Sitio no interviene en las transacciones económicas,
             no cobra comisiones ni gestiona pagos. Las condiciones de trabajo, los honorarios y demás
             aspectos contractuales deberán ser acordados directamente entre las partes fuera de la
             plataforma. El uso y registro en ConectAR-DEV son totalmente gratuitos.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              3. Registro de Usuarios
            </h3>
            <p className="text-slate-300">
              Para acceder a determinadas funcionalidades, los usuarios deberán
              registrarse completando el formulario correspondiente con información veraz, completa y
              actualizada. Cada usuario es responsable del uso y confidencialidad de sus credenciales de
              acceso. ConectAR-DEV podrá suspender o eliminar cuentas que incumplan los presentes
              Términos o que sean utilizadas con fines ilícitos, fraudulentos o contrarios al espíritu del Sitio.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              4. Responsabilidades del usuario
            </h3>
            <p className="text-slate-300">
               Los usuarios se comprometen a utilizar el Sitio de forma lícita, ética
               y respetuosa. Cada usuario es único responsable por la información que publique, las
               comunicaciones que realice y los vínculos o contratos que se generen a partir del uso del Sitio.
               ConectAR-DEV no garantiza la veracidad de los datos publicados por los usuarios ni la idoneidad
               profesional de los Freelancers o la solvencia de los Clientes.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              5. Limitación de responsabilidad
            </h3>
            <p className="text-slate-300">
                El Sitio no garantiza la disponibilidad ni continuidad del servicio.
                En ningún caso ConectAR-DEV será responsable por daños directos, indirectos o consecuentes
                derivados del uso o imposibilidad de uso del Sitio, ni por incumplimientos entre usuarios.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              6. Propiedad Intelectual
            </h3>
            <p className="text-slate-300">
                Todos los contenidos del Sitio (diseños, textos, logos, bases de datos,
                software, etc.) son propiedad exclusiva de ConectAR-DEV o de sus respectivos titulares, y están
                protegidos por la legislación argentina de propiedad intelectual. Queda prohibida su reproducción o
                modificación sin autorización expresa.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              7. Protección de Datos Personales
            </h3>
            <p className="text-slate-300">
                Los datos personales de los usuarios serán tratados conforme
                a la Ley N.º 25.326 de Protección de Datos Personales y su decreto reglamentario. Para más
                información, consulte nuestra Política de Privacidad.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              8. Modificaciones ConectAR-DEV
            </h3>
            <p className="text-slate-300">
                se reserva el derecho de modificar en cualquier momento los
                presentes Términos y Condiciones. Las modificaciones serán publicadas en el Sitio y entrarán en
                vigor a partir de su publicación. El uso continuado del Sitio después de dichas modificaciones
                implicará su aceptación.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              9. Jurisdicción y Ley Aplicable
            </h3>
            <p className="text-slate-300">
                Los presentes Términos se rigen por las leyes de la República
                Argentina. Toda controversia será sometida a los tribunales ordinarios de la Ciudad Autónoma de
                Buenos Aires, con renuncia expresa a cualquier otro fuero.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
export default TerminosServicios;
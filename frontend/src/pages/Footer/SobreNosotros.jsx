import { Target, Eye } from 'lucide-react';
import { sobre_nosotros_data } from '../../constants/item-sobre-nosotros';

/**
 * Componente de la página "Sobre Nosotros" - Rediseño Dark Premium
 */
const SobreNosotros = () => {

  const { valoresData, equipoData } = sobre_nosotros_data

  return (
    <div className="bg-slate-950 min-h-screen overflow-x-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-24 lg:py-32 bg-slate-950 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 center w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900 border border-slate-700 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
            Nuestra Historia
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
            Potenciando el <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-sky-400">
              Talento Argentino
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            Somos el puente digital que conecta a los desarrolladores más apasionados del país
            con empresas globales que buscan excelencia técnica y calidad humana.
          </p>
        </div>
      </section>

      {/* ===== MISIÓN Y VISIÓN ===== */}
      <section className="py-20 bg-slate-900 relative">
        <div className='container mx-auto px-4'>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">

            {/* Tarjeta Misión */}
            <div className="group bg-slate-950 p-10 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110">
                <Target size={150} className="text-white" />
              </div>

              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <Target size={28} />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">Nuestra Misión</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                Democratizar el acceso a oportunidades laborales de primer nivel para el talento IT argentino,
                eliminando fronteras y garantizando procesos de contratación transparentes, ágiles y seguros.
              </p>
            </div>

            {/* Tarjeta Visión */}
            <div className="group bg-slate-950 p-10 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110">
                <Eye size={150} className="text-white" />
              </div>

              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <Eye size={28} />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">Nuestra Visión</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                Convertirnos en el referente indiscutido del mercado tecnológico latinoamericano,
                siendo reconocidos no solo por la calidad de nuestro software, sino por la calidad de nuestra gente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NUESTROS VALORES ===== */}
      <section className="py-24 bg-slate-950 border-y border-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">El ADN de ConectAR</h2>
            <p className="text-slate-400">Los principios innegociables que nos guían</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {valoresData.map((valor) => {
              const IconComponent = valor.icon;
              return (
                <div
                  key={valor.id}
                  className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:-translate-y-2 hover:bg-slate-800 transition-all duration-300 group"
                >
                  {/* Icono con fondo oscuro sutil en lugar del color claro original */}
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-800">
                    <IconComponent className={valor.color} size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {valor.titulo}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {valor.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== NUESTRO EQUIPO ===== */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-6">Conocé a los creadores</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Un equipo multidisciplinario unido por la pasión de transformar la industria.
            </p>
          </div>

          {/* Grid de Equipo Estilo Tarjeta Vertical */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-10">
            {equipoData.map((miembro) => (
              <div key={miembro.id} className="group relative w-72 h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-slate-800">
                {/* Imagen */}
                <img
                  src={miembro.imagen}
                  alt={miembro.nombre}
                  className="w-full h-full object-cover transition-transform duration-700"
                />

                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300"></div>

                {/* Contenido Texto */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-10 h-1 bg-blue-500 mb-4 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-white mb-1 leading-tight">
                    {miembro.nombre}
                  </h3>
                  <p className="text-blue-400 font-medium text-sm tracking-wide uppercase">
                    {miembro.rol}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreNosotros;
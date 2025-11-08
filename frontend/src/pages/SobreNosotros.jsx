import { Target, Eye, Heart, Shield, Users, Lightbulb } from 'lucide-react';
import BotonPrincipal from '../components/Botones/BotonPrincipal';

/**
 * Componente de la página "Sobre Nosotros"
 * Presenta la misión, visión, valores y equipo de ConectAR-Dev
 */
const SobreNosotros = () => {
  
  /**
   * Datos de los valores de la empresa
   * Cada valor tiene un icono, título y descripción
   */
  const valoresData = [
    {
      id: 1,
      icon: Heart,
      titulo: 'Pasión por la tecnología',
      descripcion: 'Amamos lo que hacemos y nos impulsa conectar a las personas correctas con los proyectos correctos.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 2,
      icon: Shield,
      titulo: 'Confianza y transparencia',
      descripcion: 'Construimos relaciones sólidas basadas en la honestidad y la comunicación clara.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      icon: Users,
      titulo: 'Comunidad colaborativa',
      descripcion: 'Fomentamos un ecosistema donde freelancers y empresas crecen juntos.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 4,
      icon: Lightbulb,
      titulo: 'Innovación constante',
      descripcion: 'Nos adaptamos a las nuevas tecnologías y tendencias para ofrecer la mejor experiencia.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  /**
   * Datos del equipo
   * Cada miembro tiene nombre, rol e imagen
   */
  const equipoData = [
    {
      id: 1,
      nombre: 'Leila Arroyo',
      rol: 'Product Owner',
      imagen: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      nombre: 'Jezabel Coronas',
      rol: 'Analista Funcional',
      imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      nombre: 'Santiago Oriez',
      rol: 'QA/Tester',
      imagen: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      nombre: 'Priscila Redondo',
      rol: 'UX/UI Designer',
      imagen: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      nombre: 'Leonel Rasjido',
      rol: 'Desarrollador',
      imagen: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="bg-gray-50">
      
      {/* 
        ===== HERO SECTION ===== 
        Sección principal con título y descripción
      */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 md:py-32">
        {/* Patrón de fondo decorativo (opcional) */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Título principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Sobre <span className="text-yellow-400">ConectAR-Dev</span>
            </h1>
            
            {/* Descripción */}
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Somos la plataforma que une el talento tecnológico argentino con las empresas 
              que buscan excelencia. Nacimos con la misión de potenciar la industria IT nacional 
              y crear oportunidades reales para freelancers y organizaciones.
            </p>
          </div>
        </div>
      </section>

      {/* 
        ===== MISIÓN Y VISIÓN ===== 
        Dos columnas responsivas con misión y visión
      */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Contenedor Misión */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600">
            {/* Icono decorativo */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            
            {/* Título */}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Nuestra Misión
            </h2>
            
            {/* Descripción */}
            <p className="text-gray-700 leading-relaxed text-lg">
              Conectar a los mejores profesionales IT de Argentina con proyectos desafiantes 
              y empresas innovadoras. Facilitamos el encuentro entre talento y oportunidad, 
              garantizando calidad, confianza y crecimiento mutuo en cada colaboración.
            </p>
          </div>

          {/* Contenedor Visión */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-yellow-500">
            {/* Icono decorativo */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
              <Eye className="w-8 h-8 text-yellow-600" />
            </div>
            
            {/* Título */}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Nuestra Visión
            </h2>
            
            {/* Descripción */}
            <p className="text-gray-700 leading-relaxed text-lg">
              Ser la plataforma líder de conexión entre freelancers tecnológicos y empresas 
              en Argentina y Latinoamérica. Aspiramos a construir un ecosistema donde el talento 
              local sea reconocido mundialmente y cada profesional alcance su máximo potencial.
            </p>
          </div>
        </div>
      </section>

      {/* 
        ===== NUESTROS VALORES ===== 
        Grid de 4 tarjetas con los valores principales
      */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Título de la sección */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en ConectAR-Dev
            </p>
          </div>

          {/* Grid de valores */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valoresData.map((valor) => {
              const IconComponent = valor.icon;
              
              return (
                <div 
                  key={valor.id}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                >
                  {/* Icono del valor */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${valor.bgColor} rounded-full mb-4`}>
                    <IconComponent className={`w-8 h-8 ${valor.color}`} />
                  </div>
                  
                  {/* Título del valor */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {valor.titulo}
                  </h3>
                  
                  {/* Descripción */}
                  <p className="text-gray-600 leading-relaxed">
                    {valor.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        ===== NUESTRO EQUIPO ===== 
        Grid de 5 tarjetas con fotos y roles del equipo
      */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Título de la sección */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Las personas que hacen posible ConectAR-Dev cada día
            </p>
          </div>

          {/* Grid del equipo - 5 tarjetas centradas */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {equipoData.map((miembro) => (
              <div 
                key={miembro.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Imagen del miembro */}
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={miembro.imagen} 
                    alt={`Foto de ${miembro.nombre}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Información del miembro */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {miembro.nombre}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {miembro.rol}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ===== SECCIÓN FINAL (REUTILIZADA) ===== 
        Bloque de beneficios con call-to-action
      */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className='mt-16 sm:mt-20'>
            <div className='max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-2xl border-t-4 border-blue-600'>
              <h4 className='text-xl sm:text-2xl font-bold text-gray-800 mb-6'>
                ¿Por qué elegir ConectAR-Dev?
              </h4>
              <div className='flex flex-col sm:flex-row justify-around items-center space-y-6 sm:space-y-0 text-center'>
                
                {/* Beneficio 1 */}
                <div>
                  <p className='text-blue-600 text-3xl font-extrabold mb-1'>100%</p>
                  <p className='text-sm text-gray-600 font-medium'>Talento Argentino Verificado</p>
                </div>
                
                {/* Beneficio 2 */}
                <div>
                  <p className='text-yellow-500 text-3xl font-extrabold mb-1'>IT</p>
                  <p className='text-sm text-gray-600 font-medium'>Especialización Exclusiva en Tecnología</p>
                </div>

                {/* Beneficio 3 */}
                <div>
                  <p className='text-yellow-500 text-3xl mb-1'>⭐⭐⭐</p>
                  <p className='text-sm text-gray-600 font-medium'>Calidad Mundial Argentina</p>
                </div>
              </div>
              <div className='mt-6'>
                <BotonPrincipal 
                  link={'/contacto'}
                  text={'¿Tenés dudas? Consultanos →'}/>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SobreNosotros;
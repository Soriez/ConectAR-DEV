import React, { useState, useContext } from 'react';
import { Star, X, BadgeCheck, Code2, User as UserIcon, Crown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext'; // 👈 Importamos el contexto

const PerfilDashboard = () => {
  // 1. OBTENER DATOS REALES
  const { user, isLoading } = useContext(AuthContext); 
  
  // Si el usuario aún no cargó (aunque DashboardLayout debería manejar esto)
  if (isLoading || !user) return <div className="p-8 text-center text-slate-500">Cargando perfil...</div>;

  // Variables de conveniencia
  const isFreelancer = user.isFreelancer;
  const isPremium = user.isPremium;
  
  // Estado local para la sección de Tecnologías (simulado, si no existe en tu modelo)
  // Nota: Tu modelo no tiene 'technologies', lo simulamos para el UI hasta que lo integres
  const [technologies, setTechnologies] = useState(['React', 'NodeJS', 'MongoDB', 'Express']); 
  const [inputValue, setInputValue] = useState('');

  // Lógica UI para agregar tags (Front-end only por ahora)
  const handleAddTech = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      if (technologies.length < 5) {
        setTechnologies([...technologies, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setTechnologies(technologies.filter(t => t !== techToRemove));
  };

  const renderStars = () => {
    // Usamos una calificación simulada, o el campo 'rating' si existe
    const rating = 5; 
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={18}
        className={`${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
      />
    ));
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-slate-800">Mi Perfil</h1>
         {/* Botón condicional solo si es Freelancer */}
         {/* {isFreelancer && ( de momento en desuso 
             <button className="text-sm text-blue-600 hover:underline font-medium">
                 Editar Perfil Público
             </button>
         )} */}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Tarjeta de Identidad */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
            
            {/* Fondo decorativo para usuarios Premium */}
            {isPremium && (
                <div className="absolute top-0 right-0 p-3 bg-yellow-400/10 rounded-bl-2xl">
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 uppercase tracking-wider">
                        <Crown size={14} className="fill-yellow-600" /> Premium
                    </span>
                </div>
            )}

            {/* Avatar - Usa las iniciales REALES */}
            <div className={`
                w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 
                ${isPremium ? 'bg-slate-900 ring-yellow-400/50' : 'bg-blue-600 ring-blue-50'}
            `}>
              {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800 capitalize">
                    {user.nombre} {user.apellido} {/* 👈 Datos reales */}
                </h2>
                
                {/* Badges Condicionales */}
                {isFreelancer ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                    <BadgeCheck size={14} /> Freelancer
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                    <UserIcon size={14} /> Cliente
                  </span>
                )}
              </div>
              
              <p className="text-slate-500">{user.email}</p>

              {/* Información extra si es freelancer */}
              {isFreelancer && (
                  <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
                    <div className="flex items-center gap-1" title="Rating promedio">
                        <span className="font-bold text-slate-700 text-lg">5.0</span>
                        <div className="flex gap-0.5">{renderStars()}</div>
                    </div>
                    {user.tarifa > 0 && (
                        <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100 font-semibold">
                            ${user.tarifa}/hora
                        </span>
                    )}
                  </div>
              )}
            </div>
          </div>

          {/* 2. Sección de Descripción y Links (Solo Freelancers) */}
          {isFreelancer && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 text-lg mb-3">Sobre mí</h3>
                <p className="text-slate-600 leading-relaxed">
                    {user.descripcion || "Aún no has agregado una descripción. ¡Edita tu perfil para que los clientes te conozcan mejor!"}
                </p>
                
                {/* Links Externos */}
                <div className="flex gap-4 mt-6">
                    {user.linkedin && (
                        <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-sm text-blue-600 font-medium hover:underline">
                            Ver LinkedIn
                        </a>
                    )}
                    {user.portfolio && (
                        <a href={user.portfolio} target="_blank" rel="noreferrer" className="text-sm text-pink-600 font-medium hover:underline">
                            Ver Portfolio
                        </a>
                    )}
                </div>
             </div>
          )}

          {/* 3. Sección de Tecnologías (Solo Freelancers) */}
          {isFreelancer && ( // 👈 CONDICIONAL CRÍTICA: Se oculta para el usuario normal
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                <Code2 className="text-blue-600" size={20}/>
                <h3 className="font-bold text-slate-800 text-lg">Skills & Tecnologías</h3>
                </div>
                
                {/* Tags Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {technologies.map((tech, index) => (
                        <span key={index} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 group hover:bg-slate-200 transition">
                            {tech}
                            <button onClick={() => handleRemoveTech(tech)} className="text-slate-400 hover:text-red-500">
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>

                {/* Input para agregar tecnología */}
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleAddTech}
                        disabled={technologies.length >= 5}
                        placeholder={technologies.length >= 5 ? "Límite alcanzado" : "Ej: HTML, Python..."}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-slate-400">
                        {technologies.length}/5
                    </span>
                </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Stats o CTA */}
        <div className="space-y-6">
            {/* Si NO es freelancer, invítalo a serlo */}
            {!isFreelancer && (
                <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="font-bold text-xl mb-2">¿Eres Desarrollador?</h3>
                    <p className="text-blue-100 text-sm mb-4">
                        Convierte tu cuenta a perfil Freelancer y comienza a ofrecer tus servicios hoy mismo.
                    </p>
                    <button className="w-full bg-white text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-50 transition shadow-sm">
                        Convertirme en Freelancer
                    </button>
                </div>
            )}

            {/* Stats simples */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Estadísticas</h3>
                <ul className="space-y-3">
                    <li className="flex justify-between text-sm">
                        <span className="text-slate-500">Visitas al perfil</span>
                        <span className="font-bold text-slate-800">{user.cantVisitas || 0}</span> {/* 👈 Dato real */}
                    </li>
                    {isFreelancer && ( // 👈 Stats solo si es Freelancer
                        <>
                            <li className="flex justify-between text-sm">
                                <span className="text-slate-500">Clics en Portfolio</span>
                                <span className="font-bold text-slate-800">{user.cantAccesosPortfolio || 0}</span> {/* 👈 Dato real */}
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-slate-500">Clics en LinkedIn</span>
                                <span className="font-bold text-slate-800">{user.cantAccesosLinkedin || 0}</span> {/* 👈 Dato real */}
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PerfilDashboard;
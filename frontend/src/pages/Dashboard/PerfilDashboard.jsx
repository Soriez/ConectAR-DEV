import React, { useState } from 'react';
import { Star, X, BadgeCheck, Code2 } from 'lucide-react';

const PerfilDashboard = () => {
  // ESTADO SIMULADO
  const [user, setUser] = useState({
    name: 'John',
    surname: 'Don',
    email: 'johndon@company.com',
    rating: 4.5,
    technologies: ['HTML', 'CSS', 'React']
  });

  const [inputValue, setInputValue] = useState('');

  // Lógica para agregar tecnologías
  const handleAddTech = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      if (user.technologies.length < 5) {
        setUser({ ...user, technologies: [...user.technologies, inputValue.trim()] });
        setInputValue('');
      }
    }
  };
  // Lógica para borrar tecnologías
  const handleRemoveTech = (techToRemove) => {
    setUser({
      ...user,
      technologies: user.technologies.filter(t => t !== techToRemove)
    });
  };
  // Renderizar Estrellas
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={18}
        className={`${index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
      />
    ));
  };

  return (
    <div>
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Mi Perfil</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMNA IZQUIERDA: Tarjeta Principal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Tarjeta de Usuario */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-blue-50">
              {user.name.charAt(0)}{user.surname.charAt(0)}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-800">{user.name} {user.surname}</h2>
                {/* BADGE FREELANCER */}
                {user.role === 'freelancer' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                    <BadgeCheck size={14} /> Freelancer
                  </span>
                )}
              </div>
              
              <p className="text-slate-500">{user.email}</p>

              {/* VALORACIÓN */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                <span className="font-bold text-slate-700 text-lg">{user.rating}</span>
                <div className="flex gap-0.5">{renderStars(user.rating)}</div>
                <span className="text-xs text-slate-400">(Promedio)</span>
              </div>
            </div>
          </div>

          {/* 2. Sección de Tecnologías */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
               <Code2 className="text-blue-600" size={20}/>
               <h3 className="font-bold text-slate-800 text-lg">Tecnologías</h3>
            </div>
            
            <p className="text-sm text-slate-500 mb-4">
              Agrega las tecnologías que dominas (Máximo 5). Presiona <strong>Enter</strong> para agregar.
            </p>

            {/* Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleAddTech}
                disabled={user.technologies.length >= 5}
                placeholder={user.technologies.length >= 5 ? "Límite alcanzado" : "Ej: HTML, Python..."}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />
              <span className="absolute right-3 top-3.5 text-xs text-slate-400">
                {user.technologies.length}/5
              </span>
            </div>

            {/* Tags Chips */}
            <div className="flex flex-wrap gap-2">
              {user.technologies.map((tech, index) => (
                <span key={index} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 group hover:bg-slate-200 transition">
                  {tech}
                  <button onClick={() => handleRemoveTech(tech)} className="text-slate-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilDashboard;
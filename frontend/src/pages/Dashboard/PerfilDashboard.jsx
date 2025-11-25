import React, { useState, useContext, useMemo, useEffect } from 'react'; 
import { Star, X, BadgeCheck, Code2, User as UserIcon, Crown, Search } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext'; 
import axios from 'axios'; 

// Lista preestablecida de tecnologías (si fallara la carga del backend)
const FALLBACK_TECHS = ['React', 'NodeJS', 'MongoDB', 'JavaScript'];

const PerfilDashboard = () => {
  // 1. TODOS LOS HOOKS DEBEN IR AQUÍ, ANTES DE CUALQUIER RETURN CONDICIONAL
  
  // Hook 1: Obtener el contexto de autenticación
  const { user, isLoading, BASE_URL, setUser } = useContext(AuthContext); 
  
  // Hook 2: Lista de tecnologías disponibles (del backend)
  const [availableTechs, setAvailableTechs] = useState([]); 
  
  // Hook 3: Estado del input del selector
  const [inputValue, setInputValue] = useState(''); 
  
  // Hook 4: Estado de las tecnologías seleccionadas por el usuario.
  // Lo inicializamos con un array vacío. La sincronización se hace en el useEffect.
  const [technologies, setTechnologies] = useState([]); 

  // 2. EFECTO: Sincronizar 'technologies' con 'user.skills' cuando el usuario carga
  useEffect(() => {
    // Solo actualizamos si el usuario existe y es freelancer con skills
    if (user && user.isFreelancer && user.skills) {
         setTechnologies(user.skills);
    } else {
         // Si no es freelancer o no tiene skills, aseguramos que el estado esté vacío.
         setTechnologies([]);
    }
  }, [user]); // Se ejecuta cada vez que el objeto 'user' cambia.

  // 3. EFECTO: Cargar las tecnologías disponibles del backend (solo se ejecuta una vez al montar)
  useEffect(() => { 
    const fetchAvailableTechs = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/technologies/available`);
            setAvailableTechs(response.data); 
        } catch (error) {
            console.error("Error al cargar tecnologías disponibles:", error);
            setAvailableTechs(FALLBACK_TECHS); 
        }
    };
    fetchAvailableTechs();
  }, [BASE_URL]);

  // 4. Lógica de Filtrado (Hook 5: useMemo)
  const filteredSuggestions = useMemo(() => { 
    if (!inputValue) return [];
    
    return availableTechs
        .filter(tech => 
            tech.toLowerCase().includes(inputValue.toLowerCase()) && 
            !technologies.includes(tech)
        )
        .slice(0, 7); 
  }, [inputValue, technologies, availableTechs]);


  // 5. SALIDA TEMPRANA CONDICIONAL (DEBE IR DESPUÉS DE TODOS LOS HOOKS)
  if (isLoading || !user) {
    return <div className="p-8 text-center text-slate-500">Cargando perfil...</div>;
  }
  
  // Variables de conveniencia (AHORA es seguro acceder a user.*)
  const isFreelancer = user.isFreelancer;
  const isPremium = user.isPremium;
  
  // 6. Funciones de manejo
  const handleAddTech = (tech) => {
    if (!technologies.includes(tech) && technologies.length < 5) {
        setTechnologies([...technologies, tech]);
        setInputValue('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setTechnologies(technologies.filter(t => t !== techToRemove));
  };
  
  // Función para guardar las skills en el backend
  const handleSaveSkills = async () => {
      try {
          const response = await axios.put(
              `${BASE_URL}/api/users/${user._id}/skills`,
              { skills: technologies } 
          );
          
          setUser(response.data); // Actualiza el estado global
          alert('¡Skills guardadas exitosamente!');

      } catch (error) {
          const errorMessage = error.response?.data?.message || 'Error desconocido al guardar las skills.';
          alert(`Error: ${errorMessage}`);
      }
  };

  const renderStars = () => {
    const rating = user.rating || 5; 
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
         {isFreelancer && (
             <button className="text-sm text-blue-600 hover:underline font-medium">
                 Editar Perfil Público
             </button>
         )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Tarjeta de Identidad */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
            
            {isPremium && (
                <div className="absolute top-0 right-0 p-3 bg-yellow-400/10 rounded-bl-2xl">
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 uppercase tracking-wider">
                        <Crown size={14} className="fill-yellow-600" /> Premium
                    </span>
                </div>
            )}

            {/* Avatar */}
            <div className={`
                w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 
                ${isPremium ? 'bg-slate-900 ring-yellow-400/50' : 'bg-blue-600 ring-blue-50'}
            `}>
              {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800 capitalize">
                    {user.nombre} {user.apellido}
                </h2>
                
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
          {isFreelancer && ( 
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                <Code2 className="text-blue-600" size={20}/>
                <h3 className="font-bold text-slate-800 text-lg">Skills & Tecnologías</h3>
                </div>
                
                {/* Tags Chips seleccionados */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {technologies.length === 0 ? (
                        <p className="text-slate-500 text-sm">Agrega hasta 5 tecnologías a tu perfil.</p>
                    ) : (
                        technologies.map((tech, index) => (
                            <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 group hover:bg-blue-200 transition">
                                {tech}
                                <button onClick={() => handleRemoveTech(tech)} className="text-blue-400 hover:text-blue-600">
                                    <X size={14} />
                                </button>
                            </span>
                        ))
                    )}
                </div>

                {/* Selector de Tags */}
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={technologies.length >= 5 ? "Límite de 5 tecnologías alcanzado" : "Busca o escribe una tecnología..."}
                        disabled={technologies.length >= 5}
                        className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    />
                    <Search size={18} className="absolute left-3 top-3.5 text-slate-400"/>

                    <span className="absolute right-3 top-3.5 text-xs text-slate-400">
                        {technologies.length}/5
                    </span>
                    
                    {/* Sugerencias de búsqueda */}
                    {(inputValue && filteredSuggestions.length > 0) && ( 
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredSuggestions.map((tech) => (
                                <div
                                    key={tech}
                                    onMouseDown={() => handleAddTech(tech)} 
                                    className="px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                                >
                                    {tech}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={handleSaveSkills} 
                    disabled={!isFreelancer || technologies.length === user.skills.length}
                    className={`mt-4 w-full px-4 py-3 font-bold rounded-lg transition ${
                        technologies.length === user.skills.length 
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    Guardar Skills ({technologies.length}/5)
                </button>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Stats o CTA */}
        <div className="space-y-6">
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
                        <span className="font-bold text-slate-800">{user.cantVisitas || 0}</span>
                    </li>
                    {isFreelancer && ( 
                        <>
                            <li className="flex justify-between text-sm">
                                <span className="text-slate-500">Clics en Portfolio</span>
                                <span className="font-bold text-slate-800">{user.cantAccesosPortfolio || 0}</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-slate-500">Clics en LinkedIn</span>
                                <span className="font-bold text-slate-800">{user.cantAccesosLinkedin || 0}</span>
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
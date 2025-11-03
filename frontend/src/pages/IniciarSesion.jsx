import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente helper para alternar la visibilidad de la contraseña
const PasswordToggle = ({ isVisible, onClick }) => {
    const EyeOpen = <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>;
    const EyeOpenCenter = <circle cx="12" cy="12" r="3"></circle>;
    const EyeClosed = (
        <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </>
    );

    return (
        <button
            type="button"
            className="toggle-password absolute right-[14px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center text-light-gray transition-colors duration-300 hover:text-white"
            onClick={onClick}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isVisible ? (<>{EyeClosed}</>) : (<>{EyeOpen}{EyeOpenCenter}</>)}
            </svg>
        </button>
    );
};


const IniciarSesion = () => {
    const navigate = useNavigate(); 
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Lógica para enviar datos al Backend (versión con fetch asíncrono)
    const handleLogin = async (e) => {
        e.preventDefault();
        
        const { email, password } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un email válido.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); 

            if (response.ok) {
                // Login exitoso
                const token = data.token; 
                localStorage.setItem('userToken', token); 
                alert('¡Inicio de sesión exitoso! Bienvenido a ConectAR-Dev');
                navigate('/'); // Redirige a la página de inicio
            } else {
                // Error de credenciales
                alert(`Error al iniciar sesión: ${data.message || 'Credenciales inválidas.'}`);
            }
        } catch (error) {
            // Error de red (backend caído)
            alert('Error de conexión con el servidor. Asegúrate de que el backend esté activo.');
            console.error('Error de red:', error);
        }
    };

    // Función de redirección a Registrar.jsx (Ruta: /registrarse)
    const goToRegister = () => {
        navigate('/registrarse'); 
    };

    return (
        // ✅ LIMPIO: Clases directas de Tailwind sin sintaxis de plantilla (template literal)
        <div className="container flex min-h-screen bg-dark-blue text-white overflow-x-hidden">
            {/* Panel Izquierdo - Formulario */}
            <div className="left-panel w-full lg:w-1/2 p-10 flex flex-col justify-center items-center bg-dark-blue">
                <div className="form-wrapper w-full max-w-sm animate-fadeIn"> 
                    
                    {/* Logo y Header */}
                    <div className="header text-center mb-8">
                        <div className="logo-container flex items-center justify-center gap-4 mb-6">
                            <div className="logo-box w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-xl text-black">CA</div>
                            <div className="brand-info">
                                <h1 className="text-2xl font-bold text-white m-0 leading-tight">ConectAR-Dev</h1>
                                <p className="text-xs text-custom-orange m-0 font-medium">Professional Network</p>
                            </div>
                        </div>
                        <p className="header-description text-sm text-light-gray leading-relaxed mb-8">
                            Conecta con los mejores talentos tecnológicos y encuentra<br/>
                            proyectos que impulsen tu carrera
                        </p>
                    </div>

                    {/* Formulario */}
                    <h2 className="form-title text-xl font-bold text-white mb-2">Iniciar Sesión</h2>
                    <p className="form-subtitle text-sm text-light-gray mb-8">Accede a tu cuenta para conectar con oportunidades</p>

                    <form onSubmit={handleLogin}>
                        
                        {/* Email */}
                        <div className="form-group mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com" 
                                required
                                autoFocus
                                // ✅ LIMPIO: Clases directas
                                className="w-full p-3.5 bg-input-bg border border-input-border rounded-lg text-sm text-white transition-all duration-300 focus:outline-none focus:border-custom-blue placeholder:text-placeholder" 
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="form-group mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Contraseña</label>
                            <div className="input-wrapper relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    id="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••" 
                                    required
                                    // ✅ LIMPIO: Clases directas
                                    className="w-full p-3.5 pr-12 bg-input-bg border border-input-border rounded-lg text-sm text-white transition-all duration-300 focus:outline-none focus:border-custom-blue placeholder:text-placeholder"
                                />
                                <PasswordToggle 
                                    isVisible={!showPassword} 
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        {/* Botón Principal */}
                        <button type="submit" 
                            // ✅ LIMPIO: Clases directas
                            className="btn-primary w-full p-3.5 bg-custom-blue border-none rounded-lg text-base font-semibold text-white cursor-pointer transition-all duration-300 hover:bg-blue-dark hover:-translate-y-px active:translate-y-0 mb-4"
                        >
                            Iniciar Sesión
                        </button>

                        {/* Enlace Olvidaste Contraseña */}
                        <a href="#" 
                           // ✅ LIMPIO: Clases directas
                           className="link text-center text-sm text-custom-blue block mb-6 transition-colors duration-300 hover:text-blue-dark hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>

                        {/* Separador */}
                        <p className="separator text-center text-sm text-light-gray my-6">
                            ¿No tienes una cuenta?
                        </p>

                        {/* Botón Secundario */}
                        <button 
                            type="button" 
                            // ✅ LIMPIO: Clases directas (el style se queda como estaba)
                            className="btn-secondary w-full p-3.5 bg-transparent border border-input-border rounded-lg text-base font-semibold text-gold-yellow cursor-pointer transition-all duration-300 hover:bg-opacity-10 hover:border-gold-yellow"
                            onClick={goToRegister}
                            style={{ '--tw-bg-opacity': 0.1, backgroundColor: `rgba(255, 215, 0, 0.1)` }}
                        >
                            Crear Cuenta Nueva
                        </button>
                    </form>
                </div>
            </div>

            {/* Panel Derecho - Contenido Estático */}
            {/* ✅ LIMPIO: Clases directas */}
            <div className="right-panel hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-gradient-to-br from-dark-blue to-darker-blue" 
                 style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')` }}>
                
                {/* Overlay Oscuro */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/75 to-gray-900/85"></div>
                
                <div className="right-content relative z-10 w-full h-full flex flex-col justify-end p-16 text-white">
                    <h2 className="text-4xl font-bold leading-tight mb-4">
                        Conecta. Desarrolla. <span className="text-custom-orange">Crece.</span>
                    </h2>
                    <p className="text-base text-light-gray leading-relaxed mb-8">
                        ConectAR-Dev te conecta con las mejores oportunidades tecnológicas en Argentina y Latinoamérica
                    </p>
                    <div className="stats flex gap-8 flex-wrap">
                        <div className="stat-item flex items-center gap-2">
                            <span className="stat-dot w-2 h-2 rounded-full bg-gold-yellow shadow-[0_0_12px_rgba(255,215,0,0.5)]"></span>
                            <span className="stat-text text-sm font-medium text-white">+3,200 desarrolladores</span>
                        </div>
                        <div className="stat-item flex items-center gap-2">
                            <span className="stat-dot w-2 h-2 rounded-full bg-custom-orange shadow-[0_0_12px_rgba(255,140,66,0.5)]"></span>
                            <span className="stat-text text-sm font-medium text-white">+850 proyectos activos</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IniciarSesion;
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

// NOTA: El objeto customColors se ha eliminado. 
// Las clases de Tailwind (blue-800, custom-blue, etc.) 
// DEBEN estar definidas en frontend/tailwind.config.js.

// Componente helper para alternar la visibilidad de la contraseña
const PasswordToggle = ({ isVisible, onClick }) => (
    <button 
        type="button" 
        className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-1 flex items-center z-10 transition-opacity duration-300 hover:opacity-70" 
        onClick={onClick}
    >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#8B94A8"/>
            {!isVisible && <circle cx="10" cy="10" r="2" fill="#8B94A8"/>}
        </svg>
    </button>
);


const Registrar = () => {
    const navigate = useNavigate();

    // 1. Estados para los datos del formulario
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: '',
        terms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 2. Función genérica para manejar los cambios en los inputs
    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    // 3. Lógica para enviar datos al Backend (versión con fetch asíncrono)
    const handleRegister = async (e) => {
        e.preventDefault();
        
        const { fullName, email, password, confirmPassword, userType, terms } = formData;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        if (!terms) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }

        try {
            // URL de la API: Asumimos http://localhost:5000/api/auth/register
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, userType }),
            });

            const data = await response.json(); 

            if (response.ok) {
                alert('¡Cuenta creada exitosamente! Redirigiendo a Login...');
                goToLogin(); 
            } else {
                alert(`Error en el registro: ${data.message || 'El email ya está registrado.'}`);
            }
        } catch (error) {
            alert('Error de conexión con el servidor. Asegúrate de que el backend esté activo.');
            console.error('Error de red:', error);
        }
    };
    
    // Función de redirección a Login usando useNavigate
    const goToLogin = () => {
        // Redirige a la ruta definida en Rutas.jsx: /iniciar-sesion
        navigate('/iniciar-sesion'); 
    };

    return (
        // ✅ LIMPIO: Clases directas de Tailwind
        <div className="min-h-screen flex flex-col lg:flex-row bg-blue-800  text-white overflow-x-hidden">
            {/* Panel Izquierdo - Formulario */}
            <div className="w-full lg:w-5/12 bg-blue-800 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-[480px]"> 
                    
                    {/* Header y Títulos */}
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-[60px] h-[60px] bg-linear-to-br from-custom-blue to-blue-dark rounded-xl shadow-[0_4px_12px_rgba(74,158,255,0.3)] mb-3">
                            <span className="text-[28px] font-bold text-white">CA</span>
                        </div>
                        <h1 className="text-[28px] font-bold text-white mb-1">ConectAR-Dev</h1>
                        <p className="text-[14px] text-custom-orange font-medium m-0">Professional Network</p>
                    </div>

                    <h2 className="text-[24px] font-bold text-white mt-8 mb-2">Crear Cuenta</h2>
                    <p className="text-[14px] text-light-gray mb-6"> 
                        Únete para conectar con oportunidades tecnológicas 
                    </p>

                    {/* Formulario */}
                    <form onSubmit={handleRegister}>
                        
                        {/* Nombre Completo */}
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-[14px] font-medium text-white mb-2">Nombre Completo</label>
                            <div className="relative flex items-center">
                                {/* SVG Icono (Usuario) */}
                                <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#8B94A8"/><path d="M10 12.5C5.16667 12.5 1.25 14.8333 1.25 17.5V20H18.75V17.5C18.75 14.8333 14.8333 12.5 10 12.5Z" fill="#8B94A8"/></svg>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    // ✅ LIMPIO: Clases directas
                                    className="w-full bg-input-bg border border-input-border text-white pl-[45px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-custom-blue placeholder:text-gray-500" 
                                    placeholder="Ingresa tu nombre completo" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-[14px] font-medium text-white mb-2">Email</label>
                            <div className="relative flex items-center">
                                {/* SVG Icono (Email) */}
                                <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18 4H2C0.9 4 0.01 4.9 0.01 6L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V6C20 4.9 19.1 4 18 4ZM18 8L10 11.5L2 8V6L10 9.5L18 6V8Z" fill="#8B94A8"/></svg>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    // ✅ LIMPIO: Clases directas
                                    className="w-full bg-input-bg border border-input-border text-white pl-[45px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-custom-blue placeholder:text-gray-500" 
                                    placeholder="tu@email.com" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-[14px] font-medium text-white mb-2">Contraseña</label>
                            <div className="relative flex items-center">
                                {/* SVG Icono (Candado) */}
                                <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V17C1 18.1 1.9 19 3 19H15C16.1 19 17 18.1 17 17V9C17 7.9 16.1 7 15 7ZM9 14C7.9 14 7 13.1 7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14ZM12 7H6V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V7Z" fill="#8B94A8"/></svg>
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    id="password" 
                                    value={formData.password}
                                    onChange={handleChange}
                                    // ✅ LIMPIO: Clases directas
                                    className="w-full bg-input-bg border border-input-border text-white pl-[45px] pr-[50px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-custom-blue placeholder:text-gray-500" 
                                    placeholder="••••••••" 
                                    required 
                                />
                                <PasswordToggle isVisible={showPassword} onClick={() => setShowPassword(!showPassword)}/>
                            </div>
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-[14px] font-medium text-white mb-2">Confirmar Contraseña</label>
                            <div className="relative flex items-center">
                                {/* SVG Icono (Candado) */}
                                <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V17C1 18.1 1.9 19 3 19H15C16.1 19 17 18.1 17 17V9C17 7.9 16.1 7 15 7ZM9 14C7.9 14 7 13.1 7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14ZM12 7H6V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V7Z" fill="#8B94A8"/></svg>
                                <input 
                                    type={showConfirmPassword ? 'text' : 'password'} 
                                    id="confirmPassword" 
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    // ✅ LIMPIO: Clases directas
                                    className="w-full bg-input-bg border border-input-border text-white pl-[45px] pr-[50px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-custom-blue placeholder:text-gray-500" 
                                    placeholder="••••••••" 
                                    required 
                                />
                                <PasswordToggle isVisible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
                            </div>
                        </div>

                        {/* Tipo de Usuario */}
                        <div className="mb-4">
                            <label htmlFor="userType" className="block text-[14px] font-medium text-white mb-2">Tipo de Usuario</label>
                            <div className="relative">
                                <select 
                                    id="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                    // ✅ LIMPIO: Clases directas
                                    className="w-full bg-input-bg border border-input-border text-white px-4 py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-custom-blue appearance-none cursor-pointer" 
                                    style={{
                                        // Estilo inline para la flecha del select
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%238b94a8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundSize: '16px 12px',
                                    }}
                                    required
                                >
                                    <option value="" disabled>Selecciona tu perfil</option>
                                    {/* ✅ LIMPIO: Clases directas */}
                                    <option value="administrator" className="bg-darker-blue text-white">Administrador</option>
                                    <option value="client" className="bg-darker-blue text-white">Cliente</option>
                                    <option value="provider" className="bg-darker-blue text-white">Proveedor</option>
                                </select>
                            </div>
                        </div>

                        {/* Términos y Condiciones */}
                        <div className="flex items-start mb-6">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={formData.terms}
                                onChange={handleChange}
                                // ✅ LIMPIO: Clases directas
                                className="w-[18px] h-[18px] border-2 border-input-border rounded bg-input-bg cursor-pointer appearance-none checked:bg-custom-blue checked:border-custom-blue focus:outline-none mt-0.5 shrink-0" 
                                required 
                                style={{
                                    // Estilo inline para el checkmark del checkbox
                                    backgroundImage: formData.terms ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3csvg%3e")` : 'none',
                                    backgroundSize: '100%',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            />
                            {/* ✅ LIMPIO: Clases directas */}
                            <label className="text-[13px] text-light-gray cursor-pointer ml-2 leading-relaxed" htmlFor="terms">
                                Acepto los <a href="#" className="text-custom-blue no-underline transition-all duration-300 hover:text-blue-dark hover:underline">términos y condiciones</a> y la <a href="#" className="text-custom-blue no-underline transition-all duration-300 hover:text-blue-dark hover:underline">política de privacidad</a>
                            </label>
                        </div>

                        {/* Botón Crear Cuenta */}
                        <button type="submit" 
                            // ✅ LIMPIO: Clases directas
                            className="w-full bg-linear-to-br from-custom-blue to-blue-dark border-0 text-white px-6 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 shadow-[0_4px_12px_rgba(74,158,255,0.3)] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 mb-3"
                        >
                            Crear Cuenta
                        </button>

                        {/* Ya tienes cuenta */}
                        {/* ✅ LIMPIO: Clases directas */}
                        <p className="text-center text-light-gray text-[14px] mb-2">
                            ¿Ya tienes una cuenta?
                        </p>
                        <button 
                            type="button" 
                            // ✅ LIMPIO: Clases directas
                            className="w-full bg-transparent border border-input-border text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-all duration-300 cursor-pointer hover:bg-input-bg hover:border-custom-blue mb-3" 
                            onClick={goToLogin}
                        >
                            Iniciar Sesión
                        </button>

                        {/* Olvidaste contraseña */}
                        <p className="text-center">
                            <a href="#" className="text-custom-blue text-[14px] no-underline transition-all duration-300 hover:text-blue-dark hover:underline">¿Olvidaste tu contraseña?</a>
                        </p>
                    </form>
                </div>
            </div>

            {/* Panel Derecho - Contenido Estático */}
            <div className="hidden lg:flex lg:w-7/12 bg-linear-to-br from-blue-800 to-darker-blue relative">
                {/* Asumimos que las clases de estilo de patrón y brillo están en tu CSS global */}
                <div className="absolute inset-0 bg-grid-pattern"></div> 
                <div className="absolute inset-0 bg-glow"></div>
                <div className="absolute inset-0 bg-linear-to-br from-blue-800/90 to-darker-blue/70"></div>

                <div className="relative z-10 flex items-center justify-center p-20">
                    <div>
                        <h1 className="text-[56px] font-bold leading-[1.2] mb-6 text-white">
                            Conecta.<br/>
                            Desarrolla.<br/>
                            <span className="text-custom-orange">Crece.</span>
                        </h1>
                        <p className="text-[18px] text-light-gray leading-[1.6] mb-12">
                            ConectAR-Dev te conecta con las mejores<br/>
                            oportunidades tecnológicas en Argentina y<br/>
                            Latinoamérica
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registrar;
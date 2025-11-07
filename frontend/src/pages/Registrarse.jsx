import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase } from '@fortawesome/free-solid-svg-icons';

// Componente helper para alternar la visibilidad de la contraseña
const PasswordToggle = ({ isVisible, onClick }) => (
    <button 
        type="button" 
        className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-1 flex items-center z-10 transition-opacity duration-300 hover:opacity-70" 
        onClick={onClick}
    >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {/* Color del ícono: gray-400 para un gris sutil */}
            <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#9CA3AF"/> 
            {!isVisible && <circle cx="10" cy="10" r="2" fill="#9CA3AF"/>}
        </svg>
    </button>
);


const Registrar = () => {
    const [message, setMessage] = useState('');
    // Usamos la clase para el fondo del mensaje (ej: 'bg-red-600')
    const [isMessageVisible, setIsMessageVisible] = useState(false); 
    
    // Asumimos que `useNavigate` está disponible
    const navigate = useNavigate();

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

    // Ajustamos showCustomMessage para usar clases dinámicas de Tailwind
    const showCustomMessage = (text, isError = true) => {
        setMessage(text);
        setIsMessageVisible(isError ? 'bg-red-600' : 'bg-blue-600');
        setTimeout(() => setIsMessageVisible(false), 4000);
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        const { password, confirmPassword, userType, terms } = formData;

        if (password !== confirmPassword) {
            showCustomMessage('Las contraseñas no coinciden.');
            return;
        }
        if (!terms) {
            showCustomMessage('Debes aceptar los términos y condiciones.');
            return;
        }
        if (!userType) {
            showCustomMessage('Debes seleccionar un tipo de usuario.');
            return;
        }

        try {
            // URL de la API: http://localhost:5000/api/auth/register
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json(); 

            if (response.ok) {
                showCustomMessage('¡Cuenta creada exitosamente! Redirigiendo a Login...', false); 
                setTimeout(goToLogin, 1000); 
            } else {
                showCustomMessage(`Error en el registro: ${data.message || 'El email ya está registrado.'}`);
            }
        } catch (error) {
            showCustomMessage('Error de conexión con el servidor. Asegúrate de que el backend esté activo.');
            console.error('Error de red:', error);
        }
    };
    
    const goToLogin = () => {
        navigate('/iniciar-sesion'); 
    };

    return (
        <div className='flex flex-col lg:flex-row lg:justify-center'>
            {/* Modal de Mensajes */}
            <div 
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-3 rounded-lg text-white font-semibold shadow-lg transition-opacity duration-300 ${isMessageVisible ? `opacity-100 z-50 ${isMessageVisible}` : 'opacity-0 z-0'}`}
            >
                {message}
            </div>

            {/* Contenedor Principal Flex: 100% de Ancho */}
            <div className="min-h-screen flex flex-col lg:flex-row text-white w-full">
                
                {/* 🎯 Panel Izquierdo - Formulario (50%) */}
                {/* Fondo principal oscuro: bg-slate-900 (simula el color dark navy) */}
                <div className="w-full lg:w-1/2 bg-slate-900 flex items-center justify-center p-4 lg:p-8">
                    {/* Contenedor de Contenido (Límites del Formulario) */}
                    <div className="w-full max-w-[480px]"> 
                        
                        {/* Header y Títulos */}
                        <div className="text-center mb-4">
                            {/* LOGO - sombra azul */}
                                <img src="imgs/logo.jpeg" alt="" 
                                    className="inline-flex items-center justify-center w-[60px] h-[60px] bg-url rounded-xl shadow-lg shadow-blue-600/50 mb-3"
                                />
                            <h1 className="text-[28px] font-bold text-white mb-1">ConectAR-Dev</h1>
                            {/* Acento ajustado a text-yellow-400 */}
                            <p className="text-[14px] text-yellow-400 font-medium m-0">Professional Network</p>
                        </div>

                        <h2 className="text-[24px] font-bold text-white mt-8 mb-2">Crear Cuenta</h2>
                        {/* Texto secundario ajustado a text-slate-300 */}
                        <p className="text-[14px] text-slate-300 mb-6"> 
                            Únete para conectar con oportunidades tecnológicas 
                        </p>

                        {/* Formulario */}
                        <form onSubmit={handleRegister}>
                            
                            {/* Nombre Completo */}
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-[14px] font-medium text-white mb-2">Nombre Completo</label>
                                <div className="relative flex items-center">
                                    {/* SVG Icono: fill ajustado a #9CA3AF (gris nativo) */}
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#9CA3AF"/><path d="M10 12.5C5.16667 12.5 1.25 14.8333 1.25 17.5V20H18.75V17.5C18.75 14.8333 14.8333 12.5 10 12.5Z" fill="#9CA3AF"/></svg>
                                    {/* Inputs: bg-slate-800, border-slate-700, focus:border-blue-600, placeholder:text-slate-500 */}
                                    <input 
                                        type="text" 
                                        id="fullName" 
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500" 
                                        placeholder="Ingresa tu nombre completo" 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-[14px] font-medium text-white mb-2">Email</label>
                                <div className="relative flex items-center">
                                    {/* SVG Icono: fill ajustado a #9CA3AF (gris nativo) */}
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18 4H2C0.9 4 0.01 4.9 0.01 6L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V6C20 4.9 19.1 4 18 4ZM18 8L10 11.5L2 8V6L10 9.5L18 6V8Z" fill="#9CA3AF"/></svg>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500" 
                                        placeholder="tu@email.com" 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-[14px] font-medium text-white mb-2">Contraseña</label>
                                <div className="relative flex items-center">
                                    {/* SVG Icono: fill ajustado a #9CA3AF (gris nativo) */}
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V17C1 18.1 1.9 19 3 19H15C16.1 19 17 18.1 17 17V9C17 7.9 16.1 7 15 7ZM9 14C7.9 14 7 13.1 7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14ZM12 7H6V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V7Z" fill="#9CA3AF"/></svg>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        id="password" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] pr-[50px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500" 
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
                                    {/* SVG Icono: fill ajustado a #9CA3AF (gris nativo) */}
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V17C1 18.1 1.9 19 3 19H15C16.1 19 17 18.1 17 17V9C17 7.9 16.1 7 15 7ZM9 14C7.9 14 7 13.1 7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14ZM12 7H6V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V7Z" fill="#9CA3AF"/></svg>
                                    <input 
                                        type={showConfirmPassword ? 'text' : 'password'} 
                                        id="confirmPassword" 
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] pr-[50px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500" 
                                        placeholder="••••••••" 
                                        required 
                                    />
                                    <PasswordToggle isVisible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
                                </div>
                            </div>

                            {/* Tipo de Usuario (Select) */}
                            <div className="mb-4">
                                <label htmlFor="userType" className="block text-[14px] font-medium text-white mb-2">Tipo de Usuario</label>
                                <div className="relative">
                                    {/* Estilos ajustados */}
                                    <select 
                                        id="userType"
                                        value={formData.userType}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 appearance-none cursor-pointer" 
                                        style={{
                                            // Ícono del select (fill ajustado a #9CA3AF)
                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '16px 12px',
                                        }}
                                        required
                                    >
                                        <option value="" disabled>Selecciona tu perfil</option>
                                        {/* El fondo de las opciones debe ser oscuro, el texto blanco */}
                                        <option value="administrator" className="bg-slate-900 text-white">Administrador</option>
                                        <option value="client" className="bg-slate-900 text-white">Cliente</option>
                                        <option value="provider" className="bg-slate-900 text-white">Proveedor</option>
                                    </select>
                                </div>
                            </div>

                            {/* Términos y Condiciones (Checkbox) */}
                            <div className="flex items-start mb-6">
                                {/* Estilos ajustados */}
                                <input 
                                    type="checkbox" 
                                    id="terms" 
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    className="w-[18px] h-[18px] border-2 border-slate-700 rounded bg-slate-800 cursor-pointer appearance-none checked:bg-blue-600 checked:border-blue-600 focus:outline-none mt-0.5 shrink-0" 
                                    required 
                                    style={{
                                        // Checkmark SVG para el estado checked
                                        backgroundImage: formData.terms ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3csvg%3e")` : 'none',
                                        backgroundSize: '100%',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                />
                                {/* Texto de los términos ajustado a text-slate-300 y enlaces a text-blue-500 */}
                                <label className="text-[13px] text-slate-300 cursor-pointer ml-2 leading-relaxed" htmlFor="terms">
                                    Acepto los <a href="#" className="text-blue-500 no-underline transition-all duration-300 hover:text-blue-400 hover:underline">términos y condiciones</a> y la <a href="#" className="text-blue-500 no-underline transition-all duration-300 hover:text-blue-400 hover:underline">política de privacidad</a>
                                </label>
                            </div>

                            {/* Botón Crear Cuenta (Primario) */}
                            {/* Gradiente de blue-600 a blue-800, sombra azul */}
                            <button type="submit" 
                                className="w-full bg-gradient-to-br from-blue-600 to-blue-800 border-0 text-white px-6 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 shadow-xl shadow-blue-600/30 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 mb-3"
                            >
                                Crear Cuenta
                            </button>

                            {/* Ya tienes cuenta */}
                            <p className="text-center text-slate-300 text-[14px] mb-2">
                                ¿Ya tienes una cuenta?
                            </p>
                            {/* Botón Iniciar Sesión (Secundario) */}
                            {/* Fondo transparente, borde gris oscuro, hover bg-slate-800 border-blue-600 */}
                            <button 
                                type="button" 
                                className="w-full bg-transparent border border-slate-700 text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-all duration-300 cursor-pointer hover:bg-slate-800 hover:border-blue-600 mb-3" 
                                onClick={goToLogin}
                            >
                                Iniciar Sesión
                            </button>

                            {/* Olvidaste contraseña */}
                            <p className="text-center">
                                <a href="#" className="text-blue-500 text-[14px] no-underline transition-all duration-300 hover:text-blue-400 hover:underline">¿Olvidaste tu contraseña?</a>
                            </p>
                        </form>
                    </div>
                </div>

                {/* 🎯 Panel Derecho - Contenido Estático (50%) */}
                <div className="lg:flex lg:w-1/2 relative p-4 lg:p-8 flex items-center justify-center min-h-screen">
                    {/* Imagen de fondo, cubriendo todo el div */}
                    <img 
                        src="imgs/imagen-registro.jpg" 
                        alt="Notebook con código en la pantalla. Planta en una maceta, vista hacia una ventana hacia la naturaleza" 
                        className="absolute top-0 left-0 w-full h-full z-0 object-cover"
                    />
                    {/* Overlay oscuro semitransparente para mejorar la legibilidad */}
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-10"></div> 
                    
                    {/* Contenedor de Contenido: Define límites y Padding Interior */}
                    {/* Ajustado z-20 para estar sobre el overlay y alineado */}
                    <div className="w-full max-w-[800px] px-16 py-20 z-20 text-center lg:text-left"> 
                        
                        {/* --- ⬇️ TEXTO MEJORADO ⬇️ --- */}
                        <h1 className="text-[56px] font-bold leading-[1.2] mb-6 text-white">
                            Calidad y Confianza.<br/>
                            100% Talento<br/>
                            <span className="text-yellow-400">Argentino.</span>
                        </h1>
                        
                        <p className="text-[18px] text-slate-300 leading-[1.6] mb-12">
                            Únete a la única plataforma de freelancers IT 100% verificada de Argentina. Conecta de forma segura con profesionales expertos y lleva tus proyectos al siguiente nivel.
                        </p>
                        {/* --- ⬆️ FIN DEL TEXTO MEJORADO ⬆️ --- */}


                        {/* --- STATS CON ICONOS --- */}
                        <div className="stats flex gap-8 flex-wrap mt-12 justify-center lg:justify-start">
                            
                            {/* Stat 1: Desarrolladores */}
                            <div className="stat-item flex items-center gap-3">
                                <FontAwesomeIcon icon={faUsers} className="text-yellow-400" />
                                <span className="stat-text text-sm font-medium text-slate-200">+3,200 desarrolladores</span>
                            </div>
                            
                            {/* Stat 2: Proyectos */}
                            <div className="stat-item flex items-center gap-3">
                                <FontAwesomeIcon icon={faBriefcase} className="text-blue-500" />
                                <span className="stat-text text-sm font-medium text-slate-200">+850 proyectos activos</span>
                            </div>
                            
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Registrar;
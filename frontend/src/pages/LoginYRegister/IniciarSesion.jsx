import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
// Importamos FontAwesome para replicar el estilo del panel derecho (si lo usaremos)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';

// Componente helper para alternar la visibilidad de la contraseña
const PasswordToggle = ({ isVisible, onClick }) => {
    // Usamos SVG simple con fill ajustado para el color oscuro
    const EyeOpen = <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6z"></path>;
    const EyeOpenCenter = <circle cx="10" cy="10" r="2"></circle>;
    const EyeClosed = (
        <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </>
    );

    return (
        <button
            type="button"
            // Estilos oscuros y gris sutil para el icono
            className="toggle-password absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center text-slate-400 transition-colors duration-300 hover:text-white"
            onClick={onClick}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isVisible ? (<>{EyeClosed}</>) : (<>{EyeOpen}{EyeOpenCenter}</>)}
            </svg>
        </button>
    );
};


const IniciarSesion = () => {
    const { BASE_URL, login } = useAuth();
    const [message, setMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    // Nota: Se eliminaron las funciones de alerta y se reemplazaron por lógica simple de fetch.

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const showCustomMessage = (text, isError = true) => {
        setMessage(text);
        setIsMessageVisible(isError ? 'bg-red-600' : 'bg-blue-600');
        setTimeout(() => setIsMessageVisible(false), 4000);
    };

    // Lógica para enviar datos al Backend (versión con fetch asíncrono)
    // CÓDIGO ACTUALIZADO: Usando axios y contexto
    const handleLogin = async (e) => {
        e.preventDefault();

        const { email, password } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showCustomMessage('Por favor ingresa un email válido.'); // Usamos el modal de mensaje
            return;
        }

        try {
            // ⭐️ Petición con Axios a la URL base + ruta de login
            const response = await axios.post(`${BASE_URL}/api/users/login`, {
                email,
                password
            });

            const { token, user } = response.data;

            // ⭐️ Usar la función 'login' del contexto para manejar la sesión
            login(token, user);

            showCustomMessage('¡Inicio de sesión exitoso! Redirigiendo...', false);

            setTimeout(() => {
                navigate('/'); // Redirigir a la página principal
            }, 1000);

        } catch (error) {
            // Manejo de errores con el modal de mensaje
            const errorMsg = error.response?.data?.message || 'Error de conexión con el servidor.';
            showCustomMessage(`Error: ${errorMsg}`);
            console.error('Error de red/login:', error);
        }
    };

    // Función de redirección a Registrar.jsx (Ruta: /registrarse)
    const goToRegister = () => {
        navigate('/registrarse');
    };

    return (
        // Contenedor principal con bg-slate-900 (equivalente a dark-blue/darker-blue)
        <div className="min-h-screen flex flex-col lg:flex-row text-white w-full bg-slate-900">

            {/* Modal de Mensajes */}
            <div
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-3 rounded-lg text-white font-semibold shadow-lg transition-opacity duration-300 ${isMessageVisible ? `opacity-100 z-50 ${isMessageVisible}` : 'opacity-0 z-0'}`}
            >
                {message}
            </div>

            {/* 🎯 Panel Izquierdo - Formulario (50%) */}
            <div className="w-full lg:w-1/2 bg-slate-900 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-[480px]">

                    {/* Logo y Header */}
                    <div className="text-center mb-4">
                        {/* LOGO - usando una imagen de ejemplo o div simple */}
                        <img src="imgs/logo_new.png" alt="" // Asegúrate de que esta ruta sea correcta
                            className="inline-flex items-center justify-center w-[60px] h-[60px] shadow-lg shadow-blue-600/50 mb-3 bg-white rounded-full"
                        />
                        <h1 className="text-[28px] font-bold text-white mb-1">ConectAR-Dev</h1>
                        {/* Acento ajustado a text-yellow-400 */}
                        <p className="text-[14px] text-yellow-400 font-medium m-0">Professional Network</p>
                    </div>

                    {/* Formulario */}
                    <h2 className="text-[24px] font-bold text-white mt-8 mb-2">Iniciar Sesión</h2>
                    {/* Texto secundario ajustado a text-slate-300 */}
                    <p className="text-[14px] text-slate-300 mb-6">Accede a tu cuenta para conectar con oportunidades</p>

                    <form onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-[14px] font-medium text-white mb-2">Email</label>
                            <div className="relative flex items-center">
                                {/* SVG Icono (Email): fill ajustado a #9CA3AF (gris nativo) */}
                                <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18 4H2C0.9 4 0.01 4.9 0.01 6L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V6C20 4.9 19.1 4 18 4ZM18 8L10 11.5L2 8V6L10 9.5L18 6V8Z" fill="#9CA3AF" /></svg>
                                {/* Inputs: bg-slate-800, border-slate-700, focus:border-blue-600, placeholder:text-slate-500 */}
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500"
                                    placeholder="tu@email.com"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-[14px] font-medium text-white mb-2">Contraseña</label>
                            <div className="relative flex items-center">
                                {/* SVG Icono (Candado): fill ajustado a #9CA3AF (gris nativo) */}
                                <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V17C1 18.1 1.9 19 3 19H15C16.1 19 17 18.1 17 17V9C17 7.9 16.1 7 15 7ZM9 14C7.9 14 7 13.1 7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14ZM12 7H6V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V7Z" fill="#9CA3AF" /></svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] pr-[50px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500"
                                    placeholder="••••••••"
                                    required
                                />
                                <PasswordToggle isVisible={!showPassword} onClick={() => setShowPassword(!showPassword)} />
                            </div>
                        </div>

                        {/* Enlace Olvidaste Contraseña */}
                        <NavLink to={'/recuperar-cuenta'}
                            // ✅ LIMPIO: Clases directas
                            className="link text-center text-sm text-custom-blue block mb-6 transition-colors duration-300 hover:text-blue-dark hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </NavLink>

                        {/* Botón Principal (Login) */}
                        {/* Gradiente de blue-600 a blue-800, sombra azul */}
                        <button type="submit"
                            className="w-full bg-linear-to-br from-blue-600 to-blue-800 border-0 text-white px-6 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 shadow-xl shadow-blue-600/30 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 mb-4"
                        >
                            Iniciar Sesión
                        </button>

                        {/* Separador */}
                        <p className="text-center text-slate-300 text-[14px] my-6">
                            ¿No tienes una cuenta?
                        </p>

                        {/* Botón Secundario (Crear Cuenta) */}
                        {/* Fondo transparente, borde gris oscuro, hover bg-slate-800 border-blue-600 */}
                        <button
                            type="button"
                            className="w-full bg-transparent border border-slate-700 text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-all duration-300 cursor-pointer hover:bg-slate-800 hover:border-blue-600 mb-3"
                            onClick={goToRegister}
                        >
                            Crear Cuenta Nueva
                        </button>

                    </form>
                </div>
            </div>

            {/* Panel Derecho - Contenido Estático (50%) */}
            {/* Este panel es el mismo que el de Registrar.jsx */}
            <div className="hidden lg:flex lg:w-1/2 relative p-4 lg:p-8 items-center justify-center min-h-screen">
                {/* Imagen de fondo, cubriendo todo el div */}
                <img
                    src="imgs/imagen-login.webp" // Asegúrate de que esta ruta sea correcta
                    alt="Imagen de fondo login"
                    className="absolute top-0 left-0 w-full h-full z-0 object-cover"
                />
                {/* Overlay oscuro semitransparente para mejorar la legibilidad */}
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-10"></div>

                {/* Contenedor de Contenido: Define límites y Padding Interior */}
                <div className="w-full max-w-[800px] px-16 py-20 z-20 text-center lg:text-left">

                    {/* --- TEXTO DEL REGISTRO --- */}
                    <h1 className="text-[56px] font-bold leading-[1.2] mb-6 text-white">
                        Tu red IT te espera.<br />

                        <span className="text-yellow-400">Iniciá Sesión</span>
                    </h1>

                    <p className="text-[18px] text-slate-300 leading-[1.6] mb-12">
                        Ingresá para
                        retomar tus proyectos y continuar conectando con las mejores
                        oportunidades IT en la región.
                    </p>
                    {/* --- ⬆️ FIN DEL TEXTO ⬆️ --- */}


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
    );
};

export default IniciarSesion;
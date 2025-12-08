import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';

// Componente helper para alternar la visibilidad de la contraseña (SIN CAMBIOS)
const PasswordToggle = ({ isVisible, onClick }) => (
    <button
        type="button"
        className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-1 flex items-center z-10 transition-opacity duration-300 hover:opacity-70"
        onClick={onClick}
    >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#9CA3AF" />
            {!isVisible && <circle cx="10" cy="10" r="2" fill="#9CA3AF" />}
        </svg>
    </button>
);


const Registrar = () => {
    const [message, setMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const navigate = useNavigate();

    const { BASE_URL } = useAuth();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Función para validar el formato de email
    // Un patrón simple que verifica al menos un caracter antes del @, un @, al menos un caracter, un punto y al menos dos caracteres después del punto.
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { nombre, apellido, email, password, confirmPassword, terms } = formData;
        // 1. Validación de Formato de Email
        if (!isValidEmail(email)) {
            showCustomMessage('Por favor, ingresa un formato de email válido (ej: tu@dominio.com).');
            return;
        }

        // 2. Validación de Longitud de Contraseña
        if (password.length < 8 || password.length > 13) {
            console.error('Error de registro:', error);
        }
        if (password !== confirmPassword) {
            showCustomMessage('Las contraseñas no coinciden.');
            return;
        }
        if (!terms) {
            showCustomMessage('Debes aceptar los términos y condiciones.');
            return;
        }
        try {
            // 2. Petición al Backend
            // IMPORTANTE: Enviamos role: 'cliente' para coincidir con tu user.model.js
            const response = await axios.post(`${BASE_URL}/api/users/register`, {
                nombre,
                apellido,
                email,
                password,
                role: 'cliente'
            });

            // 3. Éxito
            showCustomMessage('¡Cuenta creada con éxito! Redirigiendo...', false);

            setTimeout(() => {
                navigate('/iniciar-sesion');
            }, 2000);

        } catch (error) {
            // Capturamos el mensaje exacto que envía tu backend (ej: "El email ya está en uso")
            const errorMsg = error.response?.data?.message || 'Error al conectar con el servidor.';
            showCustomMessage(errorMsg);
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
                <div className="w-full lg:w-1/2 bg-slate-900 flex items-center justify-center p-4 lg:p-8">
                    <div className="w-full max-w-[480px]">

                        {/* Header y Títulos */}
                        <div className="text-center mb-4">
                            <img src="imgs/logo.png" alt=""
                                className="inline-flex items-center justify-center w-[60px] h-[60px]  shadow-lg shadow-blue-600/50 mb-3 bg-white rounded-full"
                            />
                            <h1 className="text-[28px] font-bold text-white mb-1">ConectAR-Dev</h1>
                            <p className="text-[14px] text-yellow-400 font-medium m-0">Professional Network</p>
                        </div>

                        <h2 className="text-[24px] font-bold text-white mt-8 mb-2">Crear Cuenta</h2>
                        <p className="text-[14px] text-slate-300 mb-6">
                            Únete para conectar con oportunidades tecnológicas
                        </p>

                        {/* Formulario */}
                        <form onSubmit={handleRegister}>

                            {/* Nombre */}
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-[14px] font-medium text-white mb-2">Nombre</label>
                                <div className="relative flex items-center">
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#9CA3AF" /><path d="M10 12.5C5.16667 12.5 1.25 14.8333 1.25 17.5V20H18.75V17.5C18.75 14.8333 14.8333 12.5 10 12.5Z" fill="#9CA3AF" /></svg>
                                    <input
                                        type="text"
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500"
                                        placeholder="Ingresa tu nombre"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Apellido */}
                            <div className="mb-4">
                                <label htmlFor="apellido" className="block text-[14px] font-medium text-white mb-2">Apellido</label>
                                <div className="relative flex items-center">
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#9CA3AF" /><path d="M10 12.5C5.16667 12.5 1.25 14.8333 1.25 17.5V20H18.75V17.5C18.75 14.8333 14.8333 12.5 10 12.5Z" fill="#9CA3AF" /></svg>
                                    <input
                                        type="text"
                                        id="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500"
                                        placeholder="Ingresa tu apellido"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-[14px] font-medium text-white mb-2">Email</label>
                                <div className="relative flex items-center">
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18 4H2C0.9 4 0.01 4.9 0.01 6L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V6C20 4.9 19.1 4 18 4ZM18 8L10 11.5L2 8V6L10 9.5L18 6V8Z" fill="#9CA3AF" /></svg>
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
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V17C1 18.1 1.9 19 3 19H15C16.1 19 17 18.1 17 17V9C17 7.9 16.1 7 15 7ZM9 14C7.9 14 7 13.1 7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14ZM12 7H6V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V7Z" fill="#9CA3AF" /></svg>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] pr-[50px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        maxLength={13}
                                    />
                                    <PasswordToggle isVisible={showPassword} onClick={() => setShowPassword(!showPassword)} />
                                </div>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-[14px] font-medium text-white mb-2">Confirmar Contraseña</label>
                                <div className="relative flex items-center">
                                    <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V17C1 18.1 1.9 19 3 19H15C16.1 19 17 18.1 17 17V9C17 7.9 16.1 7 15 7ZM9 14C7.9 14 7 13.1 7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14ZM12 7H6V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V7Z" fill="#9CA3AF" /></svg>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-[45px] pr-[50px] py-3 rounded-lg text-[14px] transition-all duration-300 focus:outline-none focus:border-blue-600 placeholder:text-slate-500"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        maxLength={13}
                                    />
                                    <PasswordToggle isVisible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                </div>
                            </div>

                            {/* 💥 ELIMINADO: Tipo de Usuario (Select) */}

                            {/* Términos y Condiciones (Checkbox) */}
                            <div className="flex items-start mb-6">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    className="w-[18px] h-[18px] border-2 border-slate-700 rounded bg-slate-800 cursor-pointer appearance-none checked:bg-blue-600 checked:border-blue-600 focus:outline-none mt-0.5 shrink-0"
                                    required
                                    style={{
                                        backgroundImage: formData.terms ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3csvg%3e")` : 'none',
                                        backgroundSize: '100%',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                />
                                <label className="text-[13px] text-slate-300 cursor-pointer ml-2 leading-relaxed" htmlFor="terms">
                                    Acepto los <a href="#" className="text-blue-500 no-underline transition-all duration-300 hover:text-blue-400 hover:underline">términos y condiciones</a> y la <a href="#" className="text-blue-500 no-underline transition-all duration-300 hover:text-blue-400 hover:underline">política de privacidad</a>
                                </label>
                            </div>

                            {/* Botón Crear Cuenta (Primario) */}
                            <button type="submit"
                                className="w-full bg-linear-to-br from-blue-600 to-blue-800 border-0 text-white px-6 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 shadow-xl shadow-blue-600/30 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 mb-3"
                            >
                                Crear Cuenta
                            </button>

                            {/* Ya tienes cuenta */}
                            <p className="text-center text-slate-300 text-[14px] mb-2">
                                ¿Ya tienes una cuenta?
                            </p>
                            {/* Botón Iniciar Sesión (Secundario) */}
                            <button
                                type="button"
                                className="w-full bg-transparent border border-slate-700 text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-all duration-300 cursor-pointer hover:bg-slate-800 hover:border-blue-600 mb-3"
                                onClick={goToLogin}
                            >
                                Iniciar Sesión
                            </button>

                        </form>
                    </div>
                </div>

                {/* 🎯 Panel Derecho - Contenido Estático (50%) */}
                <div className="lg:flex lg:w-1/2 relative p-4 lg:p-8 flex items-center justify-center min-h-screen">
                    <img
                        src="imgs/imagen-registro.webp"
                        alt="Notebook con código en la pantalla. Planta en una maceta, vista hacia una ventana hacia la naturaleza"
                        className="absolute top-0 left-0 w-full h-full z-0 object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-10"></div>

                    <div className="w-full max-w-[800px] px-16 py-20 z-20 text-center lg:text-left">
                        <h1 className="text-[56px] font-bold leading-[1.2] mb-6 text-white">
                            Calidad y Confianza.<br />
                            100% Talento<br />
                            <span className="text-yellow-400">Argentino.</span>
                        </h1>

                        <div className="text-[18px] text-slate-300 leading-[1.6] mb-12">
                            <p>Unite a la única plataforma de freelancers IT 100% Argentina. Conectá de forma segura con profesionales expertos y lleva tus proyectos al siguiente nivel.</p>
                        </div>

                        <div className="stats flex gap-8 flex-wrap mt-12 justify-center lg:justify-start">
                            <div className="stat-item flex items-center gap-3">
                                <FontAwesomeIcon icon={faUsers} className="text-yellow-400" />
                                <span className="stat-text text-sm font-medium text-slate-200">+3,200 desarrolladores</span>
                            </div>
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
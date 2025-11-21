import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import BotonPrincipal from '../../components/Botones/BotonPrincipal';

const RecuperarCuenta = () => {
    const [message, setMessage] = useState('');
    // 'isMessageVisible' almacena la clase de color (ej: 'bg-red-600') o 'false'
    const [isMessageVisible, setIsMessageVisible] = useState(false); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const showCustomMessage = (text, isError = true) => {
        setMessage(text);
        // Almacenamos la clase de color que queremos mostrar
        setIsMessageVisible(isError ? 'bg-red-600' : 'bg-blue-600');
        setTimeout(() => setIsMessageVisible(false), 4000);
    };

    const goToLogin = () => {
        navigate('/iniciar-sesion'); 
    };

    const handleRecuperacion = async (e) => {
        e.preventDefault(); 
        const { email } = formData; 
        
        if (!email) {
            showCustomMessage('Por favor, ingresa tu correo electrónico.');
            return;
        }

        try {
            // TODO: Asegúrate de que esta URL sea correcta
            const apiUrl = 'http://localhost:5000/api/auth/recuperar-cuenta'; 

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }), 
            });

            const data = await response.json(); 

            if (response.ok) {
                // Mensaje genérico por seguridad (no confirmar si el email existe)
                showCustomMessage('Si existe una cuenta con ese email, recibirás un enlace.', false); 
            } else {
                const errorMessage = data.message || 'Error al procesar la solicitud.';
                // No revelamos si el email no existe por seguridad
                showCustomMessage(`Error: ${errorMessage}`);
            }
        } catch (error) {
            showCustomMessage('Error de conexión con el servidor.');
            console.error('Error de red:', error);
        }
    };

    // --- RENDERIZADO RESPONSIVE ---

    return (
        // 1. CONTENEDOR PRINCIPAL 
        // //Quitar el flex-col cuando se saquen los botones de abajo
        <div className='h-screen flex items-center flex-col justify-center p-4 bg-blue-400'>
            
            {/* 2. MODAL DE MENSAJE (RESPONSIVE)
                - 'w-11/12': Ancho del 90% en móviles
                - 'max-w-lg': Ancho máximo en pantallas grandes
            */}
            <div 
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg p-4 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 ${isMessageVisible ? `opacity-100 z-50 ${isMessageVisible}` : 'opacity-0 -z-10'}`}
                role="alert"
            >
                {message}
            </div>
            
            {/* 3. TARJETA DE FORMULARIO (RESPONSIVE)
                - 'w-full': Ancho completo en móviles (limitado por el 'p-4' del padre)
                - 'max-w-2xl': Límite de ancho en pantallas grandes (desktop)
            */}
            <div className='w-full max-w-2xl bg-white rounded-md border border-gray-400 shadow-xl '>
                
                {/* 4. TÍTULO (PADDING Y TEXTO RESPONSIVE) */}
                <div className='border-b border-gray-300 py-4 px-4 sm:px-8 bg-gray-100'>
                    {/* - 'text-2xl sm:text-3xl': Texto más pequeño en móviles */}
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>Encuentra tu cuenta</h2>
                </div>
                
                {/* 5. FORMULARIO (PADDING RESPONSIVE) */}
                <div className='py-6 px-4 sm:px-8'>
                    <form onSubmit={handleRecuperacion}>
                        <div className="mb-5">
                            {/* - 'text-lg sm:text-xl': Texto más pequeño en móviles */}
                            <label htmlFor="email" className="block text-lg sm:text-xl mb-4 text-gray-700">Ingresa tu correo electrónico para buscar tu cuenta.</label>
                            <div className="relative flex items-center">
                                <svg className="absolute left-3.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18 4H2C0.9 4 0.01 4.9 0.01 6L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V6C20 4.9 19.1 4 18 4ZM18 8L10 11.5L2 8V6L10 9.5L18 6V8Z" fill="#9CA3AF"/></svg>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    // - Estilos de input oscuros (como en tu original)
                                    className="w-full bg-slate-800 border border-slate-500 text-white pl-12 pr-4 py-3 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500" 
                                    placeholder="tu@email.com" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* 6. BOTONES (GRID RESPONSIVE)
                            - 'grid-cols-1': Una columna en móviles (botones apilados)
                            - 'md:grid-cols-2': Dos columnas en pantallas medianas y grandes
                            - 'gap-4': Espacio entre botones
                        */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                            {/* Botón de cancelar */}
                            <button 
                                type="button" 
                                className="w-full bg-gray-200 border border-gray-400 text-gray-800 px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 cursor-pointer hover:bg-gray-300 hover:border-gray-500 order-2 md:order-1" 
                                onClick={goToLogin}
                            >
                                Cancelar
                            </button>
                            
                            {/* Botón de recuperar (con tu estilo original) */}
                            <button type="submit" 
                                className="w-full bg-linear-to from-blue-600 to-blue-800 border-0 text-white px-6 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 shadow-lg shadow-blue-600/30 cursor-pointer hover:from-blue-700 hover:to-blue-900 order-1 md:order-2"
                            >
                                Recuperar Cuenta
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Sección de botones de Cambiar email y cambiar contraseña, estas irían en el dashboard cuando esté hecho */}
            <div className='grid md:grid-cols-2 gap-8 mt-8'>
                <BotonPrincipal link={'/cambiar-email'} text='Cambiar email'/>
                <BotonPrincipal link={'/cambiar-password'} text='Cambiar contraseña'/>
            </div>
        </div>
    );
}

export default RecuperarCuenta;
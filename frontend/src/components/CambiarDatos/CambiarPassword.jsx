import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router';
import { Lock } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CambiarPassword = () => {
    const { user, BASE_URL } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    // 'isMessageVisible' almacena la clase de color (ej: 'bg-red-600') o 'false'
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
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

    //Personalizar esto para saber a dónde va cuando se cambia la contraseña
    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const handleCambio = async (e) => {
        e.preventDefault();
        const { password, newPassword } = formData;

        if (!password) {
            showCustomMessage('Por favor, ingresa tu contraseña actual.');
            return;
        }

        if (!newPassword) {
            showCustomMessage('Por favor, ingresa tu nueva contraseña.')
            return
        }

        if (password === newPassword) {
            showCustomMessage('La nueva contraseña debe ser diferente a la actual.')
            return
        }

        if (!user || !user.email) {
            showCustomMessage('Error: No se pudo identificar al usuario.');
            return;
        }

        try {
            // 1. Verificar la contraseña actual intentando hacer login
            try {
                await axios.post(`${BASE_URL}/api/users/login`, {
                    email: user.email,
                    password: password
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    showCustomMessage('La contraseña actual es incorrecta.');
                    return;
                }
                throw error; // Re-lanzar otros errores
            }

            // 2. Si el login es exitoso, procedemos a cambiar la contraseña
            const response = await axios.put(`${BASE_URL}/api/users/${user._id}`, {
                password: newPassword
            });

            if (response.status === 200) {
                showCustomMessage('Contraseña actualizada correctamente.', false);
                // Opcional: Limpiar formulario o redirigir
                setFormData({ password: '', newPassword: '' });
                setTimeout(() => goToDashboard(), 2000);
            } else {
                showCustomMessage('Error al actualizar la contraseña.');
            }

        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor.';
            showCustomMessage(`Error: ${errorMessage}`);
        }
    };

    return (
        <div className='h-screen flex items-center justify-center p-4 bg-blue-400'>

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
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>Cambia tu contraseña</h2>
                </div>

                {/* 5. FORMULARIO (PADDING RESPONSIVE) */}
                <div className='py-6 px-4 sm:px-8'>
                    <form onSubmit={handleCambio}>
                        <div className="mb-5">
                            {/* - 'text-lg sm:text-xl': Texto más pequeño en móviles */}
                            <label htmlFor="password" className="block text-lg sm:text-xl mb-4 text-gray-700">Ingresa tu contraseña actual para validar que eres tú</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 z-10 text-gray-400 pointer-events-none" size={20} />
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    // - Estilos de input oscuros (como en tu original)
                                    className="w-full bg-slate-800 border border-slate-500 text-white pl-12 pr-4 py-3 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {/* - 'text-lg sm:text-xl': Texto más pequeño en móviles */}
                            <label htmlFor="newPassword" className="mt-4 block text-lg sm:text-xl mb-4 text-gray-700">Ingresa la nueva contraseña</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 z-10 text-gray-400 pointer-events-none" size={20} />
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    // - Estilos de input oscuros (como en tu original)
                                    className="w-full bg-slate-800 border border-slate-500 text-white pl-12 pr-4 py-3 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                                    placeholder="••••••••"
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
                                onClick={goToDashboard}
                            >
                                Cancelar
                            </button>

                            {/* Botón de recuperar (con tu estilo original) */}
                            <button type="submit"
                                className="w-full bg-linear-to-br from-blue-600 to-blue-800 border-0 text-white px-6 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 shadow-lg shadow-blue-600/30 cursor-pointer hover:from-blue-700 hover:to-blue-900 order-1 md:order-2"
                            >
                                Actualizar contraseña
                            </button>
                        </div>

                    </form>
                </div>
                {/* Enlace Olvidaste Contraseña */}
                <NavLink to={'/recuperar-cuenta'}
                    // ✅ LIMPIO: Clases directas
                    className="link text-center text-blue-700 text-sm text-custom-blue block mb-6 transition-colors duration-300 hover:text-blue-dark hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </NavLink>
            </div>
        </div>
    )
}

export default CambiarPassword
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Mail } from 'lucide-react';

const CambiarEmail = () => {
    const { user, BASE_URL, setUser } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    // 'isMessageVisible' almacena la clase de color (ej: 'bg-red-600') o 'false'
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        repeatEmail: '',
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

    //Personalizar esto para saber a dónde va cuando se cambia el email
    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const handleCambio = async (e) => {
        e.preventDefault();
        const { email, repeatEmail } = formData;

        if (!email) {
            showCustomMessage('Por favor, ingresa tu correo actual.');
            return;
        }

        if (!repeatEmail) {
            showCustomMessage('Por favor, ingresa tu nuevo correo.')
            return
        }

        if (email === repeatEmail) {
            showCustomMessage('El nuevo correo debe ser diferente al actual.')
            return
        }

        if (user && email !== user.email) {
            showCustomMessage('El correo actual ingresado no coincide con tu cuenta.');
            return;
        }

        try {
            // Usamos el endpoint de actualización de usuario
            const response = await axios.put(`${BASE_URL}/api/users/${user._id}`, {
                email: repeatEmail
            });

            if (response.status === 200) {
                showCustomMessage('Email actualizado correctamente.', false);

                // Actualizamos el contexto con el nuevo usuario
                if (response.data.user) {
                    setUser(response.data.user);
                }

                // Opcional: Limpiar formulario o redirigir
                setFormData({ email: '', repeatEmail: '' });
                setTimeout(() => goToDashboard(), 2000);
            } else {
                showCustomMessage('Error al actualizar el email.');
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
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>Cambia tu email</h2>
                </div>

                {/* 5. FORMULARIO (PADDING RESPONSIVE) */}
                <div className='py-6 px-4 sm:px-8'>
                    <form onSubmit={handleCambio}>
                        <div className="mb-5">
                            {/* - 'text-lg sm:text-xl': Texto más pequeño en móviles */}
                            <label htmlFor="email" className="block text-lg sm:text-xl mb-4 text-gray-700">Ingresa tu correo electrónico actual para validar que eres tú</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3.5 z-10 text-gray-400 pointer-events-none" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    // - Estilos de input oscuros (como en tu original)
                                    className="w-full bg-slate-800 border border-slate-500 text-white pl-12 pr-4 py-3 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                                    placeholder="tu@email_viejo.com"
                                    required
                                />
                            </div>
                            {/* - 'text-lg sm:text-xl': Texto más pequeño en móviles */}
                            <label htmlFor="repeatEmail" className="mt-4 block text-lg sm:text-xl mb-4 text-gray-700">Ingresa el nuevo correo electrónico</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3.5 z-10 text-gray-400 pointer-events-none" size={20} />
                                <input
                                    type="email"
                                    id="repeatEmail"
                                    value={formData.repeatEmail}
                                    onChange={handleChange}
                                    // - Estilos de input oscuros (como en tu original)
                                    className="w-full bg-slate-800 border border-slate-500 text-white pl-12 pr-4 py-3 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                                    placeholder="tu@email_nuevo.com"
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
                                Cambiar email
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default CambiarEmail
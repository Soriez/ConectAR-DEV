import { useState, useContext } from 'react'
import { useNavigate } from 'react-router';
import { Lock } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CambiarPassword = () => {
    const { user, BASE_URL } = useContext(AuthContext);
    const [message, setMessage] = useState('');
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
        setIsMessageVisible(isError ? 'bg-red-900/90 text-red-100 border border-red-700' : 'bg-blue-900/90 text-blue-100 border border-blue-700');
        setTimeout(() => setIsMessageVisible(false), 4000);
    };

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
                throw error;
            }

            const response = await axios.put(`${BASE_URL}/api/users/${user._id}`, {
                password: newPassword
            });

            if (response.status === 200) {
                showCustomMessage('Contraseña actualizada correctamente.', false);
                setFormData({ password: '', newPassword: '' });
                setTimeout(() => goToDashboard(), 2000);
            } else {
                showCustomMessage('Error al actualizar la contraseña.');
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor.';
            showCustomMessage(`Error: ${errorMessage}`);
        }
    };

    return (
        // CAMBIO: Fondo general oscuro
        <div className='min-h-screen flex items-center justify-center p-4 bg-slate-950'>

            {/* Modal de Mensaje */}
            <div
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg p-4 rounded-xl font-medium shadow-2xl backdrop-blur-sm transition-all duration-300 ${isMessageVisible ? `opacity-100 z-50 ${isMessageVisible}` : 'opacity-0 -z-10'}`}
                role="alert"
            >
                {message}
            </div>

            {/* Tarjeta del Formulario */}
            {/* CAMBIO: Tarjeta oscura con borde sutil */}
            <div className='w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl shadow-black/50'>

                {/* Título */}
                {/* CAMBIO: Header oscuro y textos claros */}
                <div className='border-b border-slate-800 py-6 px-6 sm:px-8 bg-slate-900/50 rounded-t-2xl'>
                    <h2 className='text-2xl sm:text-3xl font-bold text-white'>Cambia tu contraseña</h2>
                    <p className='text-slate-400 text-sm mt-1'>Asegura tu cuenta con una clave robusta</p>
                </div>

                {/* Formulario */}
                <div className='py-8 px-6 sm:px-8'>
                    <form onSubmit={handleCambio}>
                        <div className="mb-8 space-y-6">

                            {/* Input Contraseña Actual */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                    Contraseña actual
                                </label>
                                <div className="relative flex items-center group">
                                    <Lock className="absolute left-4 z-10 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    {/* CAMBIO: Inputs estilo dark */}
                                    <input
                                        type="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500 hover:border-slate-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Input Nueva Contraseña */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
                                    Nueva contraseña
                                </label>
                                <div className="relative flex items-center group">
                                    <Lock className="absolute left-4 z-10 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500 hover:border-slate-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <button
                                type="button"
                                // CAMBIO: Botón secundario oscuro
                                className="w-full bg-slate-800 border border-slate-700 text-slate-300 px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-slate-700 hover:text-white order-2 md:order-1"
                                onClick={goToDashboard}
                            >
                                Cancelar
                            </button>

                            <button type="submit"
                                // CAMBIO: Botón primario azul vibrante
                                className="w-full bg-blue-600 border border-transparent text-white px-6 py-3.5 rounded-xl text-base font-bold transition-all duration-200 hover:bg-blue-500 shadow-lg shadow-blue-900/30 order-1 md:order-2"
                            >
                                Actualizar contraseña
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default CambiarPassword
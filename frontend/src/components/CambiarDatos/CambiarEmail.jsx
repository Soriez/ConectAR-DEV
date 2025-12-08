import { useState, useContext } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Mail } from 'lucide-react';

const CambiarEmail = () => {
    const { user, BASE_URL, setUser } = useContext(AuthContext);
    const [message, setMessage] = useState('');
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
        setIsMessageVisible(isError ? 'bg-red-900/90 text-red-100 border border-red-700' : 'bg-blue-900/90 text-blue-100 border border-blue-700');
        setTimeout(() => setIsMessageVisible(false), 4000);
    };

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
            const response = await axios.put(`${BASE_URL}/api/users/${user._id}`, {
                email: repeatEmail
            });

            if (response.status === 200) {
                showCustomMessage('Email actualizado correctamente.', false);

                if (response.data.user) {
                    setUser(response.data.user);
                }

                setFormData({ email: '', repeatEmail: '' });
                setTimeout(() => goToDashboard(), 2000);
            } else {
                showCustomMessage('Error al actualizar el email.');
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
            {/* CAMBIO: Estilo Dark Mode */}
            <div className='w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl shadow-black/50'>

                {/* Título */}
                <div className='border-b border-slate-800 py-6 px-6 sm:px-8 bg-slate-900/50 rounded-t-2xl'>
                    <h2 className='text-2xl sm:text-3xl font-bold text-white'>Cambia tu email</h2>
                    <p className='text-slate-400 text-sm mt-1'>Mantén tu información de contacto actualizada</p>
                </div>

                {/* Formulario */}
                <div className='py-8 px-6 sm:px-8'>
                    <form onSubmit={handleCambio}>
                        <div className="mb-8 space-y-6">

                            {/* Input Email Actual */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                    Correo electrónico actual
                                </label>
                                <div className="relative flex items-center group">
                                    <Mail className="absolute left-4 z-10 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    {/* CAMBIO: Inputs oscuros */}
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500 hover:border-slate-600"
                                        placeholder="tu@email_viejo.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Input Nuevo Email */}
                            <div>
                                <label htmlFor="repeatEmail" className="block text-sm font-medium text-slate-300 mb-2">
                                    Nuevo correo electrónico
                                </label>
                                <div className="relative flex items-center group">
                                    <Mail className="absolute left-4 z-10 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        id="repeatEmail"
                                        value={formData.repeatEmail}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500 hover:border-slate-600"
                                        placeholder="tu@email_nuevo.com"
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
                                // CAMBIO: Botón primario azul
                                className="w-full bg-blue-600 border border-transparent text-white px-6 py-3.5 rounded-xl text-base font-bold transition-all duration-200 hover:bg-blue-500 shadow-lg shadow-blue-900/30 order-1 md:order-2"
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
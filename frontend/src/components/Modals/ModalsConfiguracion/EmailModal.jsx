import { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const EmailModal = ({ show, onClose, userEmail }) => {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showSuccess, showErrorModal } = useNotification();

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Aquí iría tu lógica de axios.put('/api/users/change-email')


        setTimeout(() => {
            setLoading(false);
            onClose();
            showSuccess("Correo actualizado correctamente");
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 animate-fade-in-up">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Mail className="text-blue-600" size={24} /> Cambiar Email
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"><X size={20} /></button>
                </div>

                <p className="text-slate-500 text-sm mb-6">
                    Tu email actual es <strong className="text-slate-700">{userEmail}</strong>. Ingresa el nuevo correo y confirma con tu contraseña.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nuevo Correo</label>
                        <input
                            type="email"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="nuevo@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña Actual</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirma tu identidad"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-70">
                            {loading ? 'Procesando...' : 'Actualizar Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailModal;
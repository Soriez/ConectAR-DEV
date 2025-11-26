import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

const PasswordModal = ({ show, onClose }) => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (passwords.new !== passwords.confirm) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        // Lógica de axios.put('/api/users/change-password')
        setTimeout(() => {
            setLoading(false);
            onClose();
            alert("Contraseña actualizada correctamente");
            setPasswords({ current: '', new: '', confirm: '' });
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 animate-fade-in-up">
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Lock className="text-blue-600" size={24}/> Cambiar Contraseña
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Contraseña Actual"
                        required
                        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={passwords.current}
                        onChange={e => setPasswords({...passwords, current: e.target.value})}
                    />
                    <div className="h-px bg-slate-100 my-2"></div>
                    <input 
                        type="password" 
                        placeholder="Nueva Contraseña"
                        required
                        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={passwords.new}
                        onChange={e => setPasswords({...passwords, new: e.target.value})}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirmar Nueva Contraseña"
                        required
                        className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`}
                        value={passwords.confirm}
                        onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    />
                    
                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            {loading ? 'Guardando...' : 'Cambiar Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;
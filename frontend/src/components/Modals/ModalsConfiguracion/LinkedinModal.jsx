import React from 'react';
import { X, Linkedin } from 'lucide-react';

const LinkedinModal = ({ show, onClose, isConnected, baseUrl, token }) => {
    if (!show) return null;

    const handleAction = () => {
        console.log("LinkedinModal: handleAction triggered");
        console.log("BaseURL:", baseUrl);
        console.log("Token:", token);

        if (isConnected) {
            // Lógica para desconectar
            alert("Desvinculando cuenta...");
            onClose();
        } else {
            // Lógica para conectar (OAuth)
            if (baseUrl && token) {
                const redirectUrl = `${baseUrl}/api/auth/linkedin/connect?token=${token}`;
                console.log("Redirigiendo a:", redirectUrl);
                window.location.href = redirectUrl;
            } else {
                console.error("Base URL o Token no definidos");
                console.error("BaseURL:", baseUrl, "Token:", token);
                alert("Error de configuración: No se puede conectar con el servidor.");
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 animate-fade-in-up">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Linkedin className="text-[#0077b5]" size={24} /> LinkedIn
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"><X size={20} /></button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {isConnected
                            ? "Tu cuenta de LinkedIn está actualmente vinculada. Si la desconectas, no podrás usarla para iniciar sesión ni mostrarla en tu perfil."
                            : "Conecta tu perfil profesional para aumentar la confianza con los clientes y mostrar tu experiencia verificada."}
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition">
                        Cancelar
                    </button>
                    <button
                        onClick={handleAction}
                        className={`px-6 py-2.5 font-bold rounded-xl text-white transition shadow-lg ${isConnected ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-[#0077b5] hover:bg-[#006097] shadow-blue-200'}`}
                    >
                        {isConnected ? 'Desconectar Cuenta' : 'Conectar LinkedIn'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkedinModal;
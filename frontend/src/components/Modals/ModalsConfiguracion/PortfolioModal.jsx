import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';

const PortfolioModal = ({ show, onClose, currentPortfolio, onSave }) => {
    const [url, setUrl] = useState(currentPortfolio || '');
    const [loading, setLoading] = useState(false);

    // Sincronizar el input cuando se abre el modal o cambia el portfolio actual
    useEffect(() => {
        if (show) {
            setUrl(currentPortfolio || '');
        }
    }, [show, currentPortfolio]);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Llamamos a la función del padre para guardar
        await onSave(url);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={onClose}
            ></div>
            
            {/* Contenedor Modal */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 animate-fade-in-up">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <LinkIcon className="text-blue-600" size={24}/> 
                        Tu Portfolio
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"
                    >
                        <X size={20}/>
                    </button>
                </div>

                <p className="text-slate-500 text-sm mb-6">
                    Añade el enlace a tu sitio web personal, Behance, GitHub o portafolio para que los clientes puedan ver tu trabajo.
                </p>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">URL del Portfolio</label>
                        <input 
                            type="url" 
                            required
                            placeholder="https://mi-portfolio.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition"
                        >
                            Cancelar
                        </button>
                        <button 
                            disabled={loading} 
                            type="submit" 
                            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PortfolioModal;
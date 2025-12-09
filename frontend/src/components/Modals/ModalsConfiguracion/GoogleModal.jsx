import { Globe } from 'lucide-react';

const GoogleModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10 animate-fade-in-up text-center">

                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="text-blue-600" size={32} />
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">Conectar con Google</h2>
                <p className="text-slate-500 mb-8">
                    Vincula tu cuenta de Google para iniciar sesión rápidamente sin recordar más contraseñas.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => alert("Lógica de OAuth Google")}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        Continuar con Google
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoogleModal;
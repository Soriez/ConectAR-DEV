import { Crown, X } from 'lucide-react';

const BecomeFreelancerModal = ({ show, onClose, data, setData, onSubmit }) => {

    // Si la prop 'show' es falsa, no renderizamos nada
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

            {/* Fondo oscuro para cerrar al hacer clic fuera */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* Contenedor del Modal */}
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-start text-white">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Crown className="text-yellow-300 fill-yellow-300" size={24} />
                            Modo Freelancer
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">Completa tu perfil profesional para empezar.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <div className="p-8">
                    <form onSubmit={onSubmit} className="space-y-5">

                        {/* 1. Descripción */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Descripción Profesional *
                            </label>
                            <textarea
                                required
                                value={data.descripcion}
                                onChange={e => setData({ ...data, descripcion: e.target.value })}
                                placeholder="Cuéntanos sobre tu experiencia, tecnologías que dominas y qué ofreces a tus clientes..."
                                rows="4"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700"
                            />
                        </div>

                        {/* 2. Tarifa */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Tarifa por Hora Promedio (USD) *
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={data.tarifa}
                                    onChange={e => setData({ ...data, tarifa: parseFloat(e.target.value) || 0 })}
                                    placeholder="Ej: 25"
                                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 3. LinkedIn */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={data.linkedin}
                                        onChange={e => setData({ ...data, linkedin: e.target.value })}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>

                            {/* 4. Portfolio */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Portfolio</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={data.portfolio}
                                        onChange={e => setData({ ...data, portfolio: e.target.value })}
                                        placeholder="https://miweb.com"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                            >
                                ¡Empezar Ahora!
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BecomeFreelancerModal;

const formatARS = (n) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(n);

const getAvatarUrl = (nombreCompleto) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nombreCompleto
    )}&background=random&color=fff&size=220&bold=true`;

const CardPerfil = ({
    freelancer,
    averageRating,
    reviewsCount,
    handleLinkedinClick,
    handlePortfolioClick,
    tariffDisplay // Nueva prop
}) => {
    if (!freelancer) return null;

    const fullName = `${freelancer.nombre} ${freelancer.apellido}`;
    const avatar = getAvatarUrl(fullName);

    return (
        <aside className="hidden lg:block relative">
            {/* CAMBIO: Card oscura (slate-900) con borde slate-800 */}
            <div className="sticky top-8 bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800 backdrop-blur-sm">

                <div className="flex flex-col items-center text-center">
                    {/* CAMBIO: Avatar con borde oscuro */}
                    <img src={avatar} alt={fullName} className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-slate-800" />

                    {/* CAMBIO: Nombre blanco */}
                    <h3 className="text-2xl font-bold text-white">{fullName}</h3>

                    <div className="flex items-center gap-1 mt-2 mb-6">
                        <span className="text-amber-400 text-lg">★</span>
                        {/* CAMBIO: Rating blanco y count gris claro */}
                        <span className="font-bold text-slate-100">{averageRating}</span>
                        <span className="text-slate-500 text-sm">({reviewsCount} opiniones)</span>
                    </div>

                    <div className="w-full space-y-3 mb-8">
                        {/* CAMBIO: Separadores oscuros */}
                        <div className="flex justify-between items-center py-3 border-b border-slate-800">
                            <span className="text-slate-400 text-sm">Tarifa Promedio</span>
                            <span className="font-bold text-white text-lg">
                                {tariffDisplay || formatARS(freelancer.tarifa)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-800">
                            <span className="text-slate-400 text-sm">Disponibilidad</span>
                            {/* CAMBIO: Colores de estado ajustados para dark mode */}
                            <span className={`font-bold ${freelancer.isDisponible ? 'text-emerald-400' : 'text-red-400'}`}>
                                {freelancer.isDisponible ? 'Disponible' : 'Ocupado'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-800">
                            <span className="text-slate-400 text-sm">Miembro desde</span>
                            <span className="font-medium text-slate-200">{new Date(freelancer.createdAt).getFullYear()}</span>
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        {freelancer.linkedin && (
                            <button
                                onClick={handleLinkedinClick}
                                // CAMBIO: Botón LinkedIn con sombra y hover sutil
                                className="w-full flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#006097] text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-[#0077b5]/30 hover:-translate-y-0.5"
                            >
                                <span>LinkedIn</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </button>
                        )}
                        {freelancer.portfolio && (
                            <button
                                onClick={handlePortfolioClick}
                                // CAMBIO: Botón Portfolio oscuro (slate-700)
                                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg border border-slate-700 hover:border-slate-600 hover:-translate-y-0.5"
                            >
                                <span>Ver Portfolio</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default CardPerfil;
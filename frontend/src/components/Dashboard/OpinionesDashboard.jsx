import { Star, User } from 'lucide-react';

const OpinionesDashboard = () => {
  // Datos simulados
  const reviews = [
    { id: 1, client: 'Ana García', rating: 5, comment: 'Excelente trabajo, muy profesional y puntual.', date: 'Hace 2 días' },
    { id: 2, client: 'Carlos Mendez', rating: 4, comment: 'Buen resultado final, aunque la comunicación podría mejorar.', date: 'Hace 1 semana' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Opiniones Recibidas</h1>
      
      <div className="grid gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <User size={20}/>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{review.client}</h4>
                  <span className="text-xs text-slate-500">{review.date}</span>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < review.rating ? 'fill-current' : 'text-slate-200'} />
                ))}
              </div>
            </div>
            <p className="text-slate-600 text-sm italic">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpinionesDashboard;
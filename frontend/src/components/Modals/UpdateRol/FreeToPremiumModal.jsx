import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ onGoToDashboard }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="bg-[#1f2937] p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-green-500/50 transform scale-100 transition-transform duration-300">
      <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">¡Felicidades, Eres Premium!</h2>
      <p className="text-gray-300 mb-8">
        Tu cuenta Premium está activa. Ya puedes disfrutar de todas las métricas avanzadas y la máxima visibilidad en la plataforma.
      </p>
      <button
        onClick={onGoToDashboard}
        className="w-full py-3 px-4 bg-[#FACC15] hover:bg-yellow-500 text-black rounded-lg font-bold transition-colors shadow-lg shadow-yellow-900/50"
      >
        Ir a mi Dashboard
      </button>
    </div>
  </div>
);
export default SuccessModal
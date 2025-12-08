import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import {
  CheckCircle,
  Star,
  BarChart2,
  MousePointerClick,
  CreditCard
} from 'lucide-react';
import SuccessModal from '../../components/Modals/UpdateRol/FreeToPremiumModal';

const BenefitItem = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-[#1f2937]/50 border border-gray-700 hover:border-[#2563EB]/50 transition-colors group">
    <div className="shrink-0">
      <div className="h-12 w-12 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
    </div>
    <div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{description}</p>
    </div>
  </div>
);

const FreeToPremium = () => {
  const { token, user, setUser, BASE_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleUpgradeAPI = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const { data } = await axios.put(`${BASE_URL}/api/users/hacerse-premium`, { plan: 'premium' }, config);

      setIsProcessing(false);

      // Actualizar el estado global con la respuesta del backend
      if (data) {
        setUser(data);
      }

      setShowModal(true);

    } catch (err) {
      setIsProcessing(false);
      const errorMsg = err.response && err.response.data.message
        ? err.response.data.message
        : 'Error de conexión con el servidor.';
      setError(errorMsg);
    }
  }

  const handleRedirectToPayment = () => {
    setIsProcessing(true);
    setError('');

    setTimeout(() => {
      handleUpgradeAPI();
    }, 2500);
  };

  const handleGoToDashboard = async () => {
    try {
      // Decodificar el token para obtener el ID del usuario
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);

      // Recargar el usuario desde el backend para asegurar que tenemos la data más reciente
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const { data } = await axios.get(`${BASE_URL}/api/users/${payload.id}`, config);
      setUser(data);

      // Ahora navegamos al dashboard con la información actualizada
      setShowModal(false);
      navigate('/dashboard');
    } catch (error) {
      // Incluso si falla, navegamos al dashboard
      setShowModal(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a233a] font-sans selection:bg-[#2563EB] selection:text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-8 animate-fade-in-up">
            <div>
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-yellow-400/10 text-[#FACC15] text-sm font-semibold mb-4 border border-yellow-400/20">
                <Star size={14} fill="#FACC15" /> La Mejor Decisión
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                El <span className="text-[#FACC15]">Premium</span> que tu carrera necesita
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Desbloquea el potencial completo de la plataforma con una inversión única y lleva tu perfil al frente.
              </p>
            </div>

            <div className="space-y-4">
              <BenefitItem
                icon={BarChart2}
                title="Visitas Históricas de Perfil"
                description="Accede a la analítica completa para entender quién te ve y cuándo. ¡Deja de adivinar!"
              />
              <BenefitItem
                icon={MousePointerClick}
                title="Métricas de Conversión a Enlaces"
                description="Mide cuántos clics reciben tu LinkedIn y Portfolio para optimizar tu presentación profesional."
              />
              <BenefitItem
                icon={Star}
                title="Máxima Visibilidad"
                description="Tu perfil aparecerá siempre destacado en tu especialidad, garantizando que los clientes te encuentren primero."
              />
            </div>

            <div className="mt-8 bg-linear-to-r from-[#2563EB]/10 to-[#1f2937] p-5 rounded-xl border-l-4 border-[#2563EB]">
              <div className="flex items-center gap-3">
                <CreditCard className="text-[#2563EB]" size={24} />
                <div>
                  <h4 className="text-white font-bold text-lg">Pago Único de por Vida</h4>
                  <p className="text-gray-400 text-sm">Una sola inversión que te da acceso ilimitado a todas las funciones Premium.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-[#1f2937] border border-gray-700 rounded-2xl shadow-2xl p-8 lg:p-10 text-center">

              <p className="text-5xl font-extrabold text-white mb-2">
                $5.000 ARS
              </p>
              <p className="text-gray-400 mb-8">
                Unico pago. Sin letra chica.
              </p>

              {error && (
                <div className="bg-red-900/50 text-red-300 border border-red-500 rounded-lg p-3 mb-6">
                  {error}
                </div>
              )}

              <p className="text-gray-300 text-sm mb-6">
                Al hacer clic serás redirigido de forma segura a nuestra pasarela de pago para completar la transacción.
              </p>

              <button
                onClick={handleRedirectToPayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#FACC15] hover:bg-yellow-500 text-black rounded-lg font-bold text-lg shadow-lg shadow-yellow-900/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Procesando Pago...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} /> Pagar y Activar Premium
                  </>
                )}
              </button>

              <div className="mt-8 pt-6 border-t border-gray-700 space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-2 justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Analíticas Avanzadas</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Posicionamiento VIP</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showModal && <SuccessModal onGoToDashboard={handleGoToDashboard} />}
    </div>
  );
};

export default FreeToPremium;
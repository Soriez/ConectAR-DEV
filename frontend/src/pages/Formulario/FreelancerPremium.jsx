import React, { useState } from 'react';
import { 
  CheckCircle, 
  Linkedin, 
  Globe, 
  Star, 
  BarChart2, 
  MousePointerClick, 
  ArrowRight,
  Shield,
  CreditCard
} from 'lucide-react';

// Componente para los items de beneficios
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

const FreelancerPremium = () => {
  const [formData, setFormData] = useState({
    linkedin: '',
    portfolio: '',
    agreeTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular envío
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1a233a] font-sans flex flex-col">
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-[#1f2937] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-700">
            <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">¡Solicitud Recibida!</h2>
            <p className="text-gray-300 mb-8">
              Estamos validando tus enlaces. En breve recibirás un correo para finalizar el proceso de pago único y activar tu cuenta Premium.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="w-full py-3 px-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a233a] font-sans selection:bg-[#2563EB] selection:text-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Columna Izquierda: Ventajas Premium */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-yellow-400/10 text-[#FACC15] text-sm font-semibold mb-4 border border-yellow-400/20">
                <Star size={14} fill="#FACC15" /> Cuenta Premium
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Potencia tu carrera con <span className="text-[#2563EB]">datos reales</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Pasa de usuario a Freelancer Premium y accede a herramientas exclusivas para medir y mejorar tu impacto profesional.
              </p>
            </div>

            <div className="space-y-4">
              <BenefitItem 
                icon={BarChart2}
                title="Historial de Visitas"
                description="Visualiza la evolución de tu perfil con gráficas detalladas de cuántas personas te visitan históricamente."
              />
              <BenefitItem 
                icon={MousePointerClick}
                title="Métricas de Conversión"
                description="Descubre el interés real: mide cuántos reclutadores hacen clic en tu LinkedIn y Portfolio desde tu perfil."
              />
              <BenefitItem 
                icon={Star}
                title="Posicionamiento Destacado"
                description="Aparece primero en las listas de freelancers. Más visibilidad significa más oportunidades laborales."
              />
            </div>

            {/* Banner de Pago Único */}
            <div className="mt-8 bg-gradient-to-r from-[#2563EB]/10 to-[#1f2937] p-5 rounded-xl border-l-4 border-[#2563EB]">
              <div className="flex items-center gap-3">
                <CreditCard className="text-[#2563EB]" size={24} />
                <div>
                  <h4 className="text-white font-bold text-lg">Pago Único de por Vida</h4>
                  <p className="text-gray-400 text-sm">Sin suscripciones mensuales ni costos ocultos. Pagas una vez, es tuyo para siempre.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="relative">
            {/* Decoración de fondo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] to-purple-600 rounded-2xl blur opacity-25"></div>
            
            <div className="relative bg-[#1f2937] border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8">
              <div className="mb-8 border-b border-gray-700 pb-6">
                <h2 className="text-2xl font-bold text-white">Activar Perfil Freelancer</h2>
                <p className="text-gray-400 text-sm mt-2">
                  Ingresa tus enlaces profesionales para comenzar. Podrás ofrecer múltiples servicios una vez activo.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* LinkedIn Input */}
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-2">
                    Perfil de LinkedIn <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <Linkedin className="absolute left-3 top-3 text-gray-500 group-focus-within:text-[#0077b5] transition-colors" size={20} />
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      required
                      placeholder="https://linkedin.com/in/tu-perfil"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Portfolio Input */}
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300 mb-2">
                    Portfolio o Sitio Web <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-3 text-gray-500 group-focus-within:text-green-500 transition-colors" size={20} />
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      required
                      placeholder="https://miportfolio.com"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Checkbox Terminos */}
                <div className="flex items-start gap-3 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-600 text-[#2563EB] focus:ring-[#2563EB] bg-[#111827]"
                    />
                  </div>
                  <div className="text-sm">
                    <label htmlFor="agreeTerms" className="text-gray-300">
                      Entiendo que al enviar este formulario iniciaré el proceso para obtener mi cuenta Premium de <span className="font-semibold text-white">pago único</span>.
                    </label>
                  </div>
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg font-bold text-lg shadow-lg shadow-blue-900/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      Continuar al Pago <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Mensaje de seguridad */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Shield size={12} /> Proceso de pago seguro y encriptado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerPremium;
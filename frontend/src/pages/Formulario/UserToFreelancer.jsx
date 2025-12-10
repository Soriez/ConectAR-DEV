import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { CheckCircle, Linkedin, Globe, ArrowRight, Clock } from 'lucide-react';

const UserToFreelancer = () => {
  const { token, user, setUser, BASE_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    linkedin: '',
    portfolio: '',
    descripcion: '',
    agreeTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Efecto para leer parámetros de la URL (retorno de LinkedIn)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const linkedinUrl = params.get('linkedin');

    if (status === 'success') {
      if (linkedinUrl) {
        setFormData(prev => ({ ...prev, }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const ensureHttps = (url) => {
    if (!url) return '';
    let newUrl = url.trim();
    if (!/^https?:\/\//i.test(newUrl)) {
      newUrl = 'https://' + newUrl;
    }
    return newUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.linkedin || !formData.portfolio || !formData.descripcion || !formData.agreeTerms) {
      return setError("Por favor, completa todos los campos requeridos y acepta los términos.");
    }

    setIsSubmitting(true);

    const cleanLinkedin = ensureHttps(formData.linkedin);
    const cleanPortfolio = ensureHttps(formData.portfolio);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Se envía role: 'pendiente' en lugar de 'freelancer'
      const { data } = await axios.put(`${BASE_URL}/api/users/hacerse-freelancer`, {
        role: 'pendiente',
        estado: 'pendiente', // Enviamos explícitamente el estado pendiente
        motivoRechazo: '',
        linkedin: cleanLinkedin,
        portfolio: cleanPortfolio,
        descripcion: formData.descripcion
      }, config);

      // Actualizar el estado global con la respuesta del backend
      if (data) {
        setUser(data);
      }

      setSubmitted(true);

    } catch (err) {
      const errorMsg = err.response && err.response.data.message
        ? err.response.data.message
        : 'Error de conexión con el servidor.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
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

        // Ahora navegamos al dashboard
        navigate('/dashboard');
      } catch (error) {
        // Incluso si falla, navegamos al dashboard
        navigate('/dashboard');
      }
    };

    return (
      <div className="min-h-screen bg-[#1a233a] font-sans flex flex-col">
        <div className="grow flex items-center justify-center p-6">
          <div className="bg-[#1f2937] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-700">
            <div className="h-20 w-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Solicitud Enviada</h2>
            <p className="text-gray-300 mb-6">
              Tu solicitud para ser Freelancer está <span className="text-blue-400 font-semibold">pendiente de revisión</span>.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Nuestro staff validará tus datos y experiencia. Te notificaremos pronto sobre el estado de tu cuenta.
            </p>
            <button
              onClick={handleGoToDashboard}
              className="w-full py-3 px-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a233a] font-sans selection:bg-[#2563EB] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] to-purple-600 rounded-2xl blur opacity-25"></div>

          <div className="relative bg-[#1f2937] border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 text-center">

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Conviértete en Freelancer Certificado
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Solo un paso más: necesitamos validar tu experiencia profesional para garantizar la calidad de nuestros servicios.
            </p>

            {error && (
              <div className="bg-red-900/50 text-red-300 border border-red-500 rounded-lg p-3 mb-6 max-w-lg mx-auto">
                {error}
              </div>
            )}

            {/* Mensaje de Vinculación Exitosa */}
            {new URLSearchParams(window.location.search).get('status') === 'success' && (
              <div className="bg-green-900/30 text-green-400 border border-green-500/50 rounded-lg p-3 mb-6 max-w-lg mx-auto flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                <span>¡Cuenta de LinkedIn vinculada correctamente!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto text-left">

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-2">
                  Perfil de LinkedIn <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <Linkedin className="absolute left-3 top-3 text-gray-500 group-focus-within:text-[#0077b5] transition-colors" size={20} />
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    required
                    placeholder="linkedin.com/in/tu-perfil"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-4 py-3 bg-[#111827] border rounded-lg text-white placeholder-gray-500 focus:ring-2 outline-none transition-all ${new URLSearchParams(window.location.search).get('status') === 'success' && formData.linkedin ? 'border-green-500 focus:ring-green-500' : 'border-gray-600 focus:ring-[#2563EB] focus:border-transparent'}`}
                  />
                  {new URLSearchParams(window.location.search).get('status') === 'success' && formData.linkedin && (
                    <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Este es el link que se guardará en tu perfil.</p>
              </div>

              <div>
                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio o Sitio Web <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <Globe className="absolute left-3 top-3 text-gray-500 group-focus-within:text-green-500 transition-colors" size={20} />
                  <input
                    type="text"
                    id="portfolio"
                    name="portfolio"
                    required
                    placeholder="miportfolio.com"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción Breve (Pitch) <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  required
                  rows="3"
                  placeholder="Soy un desarrollador Full Stack con 5 años de experiencia..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex items-start mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-[18px] h-[18px] border-2 border-slate-700 rounded bg-slate-800 cursor-pointer appearance-none checked:bg-blue-600 checked:border-blue-600 focus:outline-none mt-0.5 shrink-0"
                  required
                  style={{
                    backgroundImage: formData.agreeTerms ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3csvg%3e")` : 'none',
                    backgroundSize: '100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <label className="text-[13px] text-slate-300 cursor-pointer ml-2 leading-relaxed" htmlFor="terms">
                  Acepto los <a href="#" className="text-blue-500 hover:underline">términos</a> y la <a href="#" className="text-blue-500 hover:underline">política de privacidad</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg font-bold text-lg shadow-lg shadow-blue-900/50 transition-all disabled:opacity-70 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar Solicitud <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserToFreelancer;
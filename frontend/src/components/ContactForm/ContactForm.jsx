import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// ⚠️ REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES DE EMAILJS
const YOUR_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const YOUR_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const YOUR_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

/**
 * Componente de formulario de contacto
 * Usa React Hook Form para manejo de formulario y validaciones
 * Integra EmailJS mediante carga dinámica para evitar errores de compilación
 */
const ContactForm = () => {
  // Estados del componente
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [showForm, setShowForm] = useState(true);
  const [emailJsLoaded, setEmailJsLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  // Efecto para cargar EmailJS dinámicamente desde CDN
  // Esto soluciona el error "Could not resolve @emailjs/browser" en entornos sin npm
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      // Inicializar EmailJS una vez cargado (opcional si usas solo send, pero recomendado)
      if (window.emailjs) {
        setEmailJsLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      // Limpieza del script al desmontar
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  /**
   * Función que se ejecuta al enviar el formulario
   * @param {Object} data - Datos del formulario validados
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      if (!emailJsLoaded || !window.emailjs) {
        throw new Error('La librería de EmailJS no se ha cargado correctamente.');
      }

      // Preparamos los parámetros para que coincidan con tu Template de EmailJS
      const templateParams = {
        title: data.asunto,
        message: data.mensaje,
        email: data.email,
        name: data.email.split('@')[0], // Fallback para el nombre
      };

      // Enviamos el email usando el objeto global window.emailjs
      await window.emailjs.send(
        YOUR_SERVICE_ID,
        YOUR_TEMPLATE_ID,
        templateParams,
        YOUR_PUBLIC_KEY
      );

      // Si tiene éxito:
      setSubmitStatus('success');
      setShowForm(false);
      reset();
    } catch (error) {
      // Si hay error:
      setSubmitStatus('error');
      console.error('Error al enviar con EmailJS:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewQuery = () => {
    setShowForm(true);
    setSubmitStatus(null);
  };

  const handleRetry = () => {
    setSubmitStatus(null);
  };

  // --- Renderizado de Éxito ---
  if (!showForm && submitStatus === 'success') {
    return (
      <div
        className="bg-gray-700 rounded-lg p-8 text-center shadow-xl"
        role="alert"
        aria-live="polite"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          ¡Mensaje Enviado!
        </h3>
        <p className="text-sky-200 mb-6">
          Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos
          a la brevedad en la dirección de email que proporcionaste.
        </p>
        <button
          onClick={handleNewQuery}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Enviar Otra Consulta
        </button>
      </div>
    );
  }

  // --- Renderizado del Formulario ---
  return (
    <div className="bg-gray-700 rounded-lg p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Formulario de Contacto
      </h3>

      <div aria-live="polite" className="sr-only">
        {isSubmitting && 'Enviando correo, por favor espere...'}
        {submitStatus === 'success' && 'Correo enviado exitosamente'}
        {submitStatus === 'error' && 'Error al enviar el correo'}
      </div>

      {/* Advertencia si EmailJS no cargó (útil para debugging) */}
      {!emailJsLoaded && (
        <div className="mb-4 text-yellow-400 text-sm text-center">
          Cargando servicio de correo...
        </div>
      )}

      {submitStatus === 'error' && (
        <div
          className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 font-semibold mb-2">
              Error al enviar el mensaje
            </p>
            <p className="text-red-300 text-sm mb-3">
              Hubo un problema al procesar tu solicitud con el servidor de correo.
            </p>
            <button
              onClick={handleRetry}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* EMAIL */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-white font-semibold mb-2">
            Email <span className="text-yellow-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Formato de email inválido',
              },
            })}
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 transition-colors duration-200 focus:outline-none ${errors.email
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-600 focus:border-blue-500'
              }`}
            placeholder="tu@email.com"
            disabled={isSubmitting || !emailJsLoaded}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* ASUNTO */}
        <div className="mb-6">
          <label htmlFor="asunto" className="block text-white font-semibold mb-2">
            Asunto <span className="text-yellow-500">*</span>
          </label>
          <input
            id="asunto"
            type="text"
            {...register('asunto', {
              required: 'El asunto es obligatorio',
              minLength: {
                value: 3,
                message: 'El asunto debe tener al menos 3 caracteres',
              },
            })}
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 transition-colors duration-200 focus:outline-none ${errors.asunto
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-600 focus:border-blue-500'
              }`}
            placeholder="¿Sobre qué querés consultar?"
            disabled={isSubmitting || !emailJsLoaded}
          />
          {errors.asunto && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.asunto.message}
            </p>
          )}
        </div>

        {/* MENSAJE */}
        <div className="mb-6">
          <label htmlFor="mensaje" className="block text-white font-semibold mb-2">
            Mensaje <span className="text-yellow-500">*</span>
          </label>
          <textarea
            id="mensaje"
            rows="5"
            {...register('mensaje', {
              required: 'El mensaje es obligatorio',
              maxLength: {
                value: 1000,
                message: 'El mensaje no puede exceder los 1000 caracteres',
              },
            })}
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 transition-colors duration-200 focus:outline-none resize-none ${errors.mensaje
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-600 focus:border-blue-500'
              }`}
            placeholder="Contanos tu consulta..."
            disabled={isSubmitting || !emailJsLoaded}
          />
          {errors.mensaje && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.mensaje.message}
            </p>
          )}
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={isSubmitting || !emailJsLoaded}
          className={`w-full font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-lg ${isSubmitting || !emailJsLoaded
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 transform hover:scale-105'
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Enviar Mensaje
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
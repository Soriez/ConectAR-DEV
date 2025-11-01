import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

/**
 * Función mock que simula el envío de un email
 * Retorna una Promise que se resuelve después de 1200ms
 * @param {Object} data - Datos del formulario
 * @returns {Promise} - Promise que simula el envío
 */
const mockSendMail = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulamos un 90% de éxito y 10% de error para testing
      const success = Math.random() > 0.1;
      if (success) {
        resolve({ success: true, message: 'Email enviado correctamente' });
      } else {
        reject({ success: false, message: 'Error al enviar el email' });
      }
    }, 1200);
  });
};

/**
 * Componente de formulario de contacto
 * Usa React Hook Form para manejo de formulario y validaciones
 */
const ContactForm = () => {
  // Estados del componente
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de envío
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [showForm, setShowForm] = useState(true); // Controla si se muestra el formulario o el mensaje de éxito

  /**
   * Configuración de React Hook Form
   * register: función para registrar inputs
   * handleSubmit: función que maneja el submit
   * formState: contiene errores y estado del formulario
   * reset: función para resetear el formulario
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur', // Valida cuando el usuario sale del campo
  });

  /**
   * Función que se ejecuta al enviar el formulario
   * @param {Object} data - Datos del formulario validados
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true); // Iniciamos el estado de envío
    setSubmitStatus(null); // Limpiamos cualquier estado anterior

    try {
      // Intentamos enviar el email con la función mock
      await mockSendMail(data);
      
      // Si tiene éxito:
      setSubmitStatus('success'); // Marcamos como exitoso
      setShowForm(false); // Ocultamos el formulario
      reset(); // Limpiamos los datos del formulario
    } catch (error) {
      // Si hay error:
      setSubmitStatus('error'); // Marcamos como error
      console.error('Error al enviar:', error);
    } finally {
      // Siempre ejecutamos esto al final
      setIsSubmitting(false); // Terminamos el estado de envío
    }
  };

  /**
   * Función para volver a mostrar el formulario después del éxito
   */
  const handleNewQuery = () => {
    setShowForm(true); // Mostramos el formulario nuevamente
    setSubmitStatus(null); // Limpiamos el estado
  };

  /**
   * Función para reintentar el envío después de un error
   */
  const handleRetry = () => {
    setSubmitStatus(null); // Limpiamos el estado de error
  };

  // Si el formulario se envió con éxito, mostramos mensaje de confirmación
  if (!showForm && submitStatus === 'success') {
    return (
      <div 
        className="bg-gray-700 rounded-lg p-8 text-center shadow-xl"
        role="alert"
        aria-live="polite"
      >
        {/* Icono de éxito */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        {/* Mensaje de éxito */}
        <h3 className="text-2xl font-bold text-white mb-3">
          ¡Mensaje Enviado!
        </h3>
        <p className="text-sky-200 mb-6">
          Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos 
          a la brevedad en la dirección de email que proporcionaste.
        </p>

        {/* Botón para enviar otra consulta */}
        <button
          onClick={handleNewQuery}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Enviar Otra Consulta
        </button>
      </div>
    );
  }

  // Renderizado del formulario
  return (
    <div className="bg-gray-700 rounded-lg p-8 shadow-xl">
      {/* Título del formulario */}
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Formulario de Contacto
      </h3>

      {/* 
        Región aria-live para anunciar estados a lectores de pantalla
        Se actualiza dinámicamente según el estado del formulario
      */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isSubmitting && 'Enviando correo, por favor espere...'}
        {submitStatus === 'success' && 'Correo enviado exitosamente'}
        {submitStatus === 'error' && 'Error al enviar el correo'}
      </div>

      {/* Notificación de error si el envío falló */}
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
              Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente.
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

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* 
          CAMPO EMAIL 
          Validaciones: requerido, formato de email válido
        */}
        <div className="mb-6">
          <label 
            htmlFor="email" 
            className="block text-white font-semibold mb-2"
          >
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
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 transition-colors duration-200 focus:outline-none ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="tu@email.com"
            disabled={isSubmitting}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {/* Mensaje de error del email */}
          {errors.email && (
            <p 
              id="email-error" 
              className="text-red-400 text-sm mt-2 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 
          CAMPO ASUNTO 
          Validaciones: requerido, mínimo 3 caracteres
        */}
        <div className="mb-6">
          <label 
            htmlFor="asunto" 
            className="block text-white font-semibold mb-2"
          >
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
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 transition-colors duration-200 focus:outline-none ${
              errors.asunto 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="¿Sobre qué querés consultar?"
            disabled={isSubmitting}
            aria-invalid={errors.asunto ? 'true' : 'false'}
            aria-describedby={errors.asunto ? 'asunto-error' : undefined}
          />
          {/* Mensaje de error del asunto */}
          {errors.asunto && (
            <p 
              id="asunto-error" 
              className="text-red-400 text-sm mt-2 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.asunto.message}
            </p>
          )}
        </div>

        {/* 
          CAMPO MENSAJE 
          Validaciones: requerido, máximo 1000 caracteres
        */}
        <div className="mb-6">
          <label 
            htmlFor="mensaje" 
            className="block text-white font-semibold mb-2"
          >
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
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 transition-colors duration-200 focus:outline-none resize-none ${
              errors.mensaje 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="Contanos tu consulta..."
            disabled={isSubmitting}
            aria-invalid={errors.mensaje ? 'true' : 'false'}
            aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
          />
          {/* Mensaje de error del mensaje */}
          {errors.mensaje && (
            <p 
              id="mensaje-error" 
              className="text-red-400 text-sm mt-2 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.mensaje.message}
            </p>
          )}
        </div>

        {/* 
          BOTÓN DE ENVÍO 
          Se deshabilita durante el envío y muestra estados diferentes
        */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-lg ${
            isSubmitting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 transform hover:scale-105'
          }`}
          aria-busy={isSubmitting}
        >
          {/* Condicional: muestra spinner durante el envío, ícono normal en reposo */}
          {isSubmitting ? (
            <>
              {/* Spinner animado (rotación CSS) */}
              <Loader className="w-5 h-5 animate-spin" />
              Enviando correo...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Enviar Mensaje
            </>
          )}
        </button>
      </form>

      {/* Nota informativa */}
      <p className="text-sky-200 text-sm text-center mt-4">
        * Campos obligatorios
      </p>
    </div>
  );
};

export default ContactForm;
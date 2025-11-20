import React, { useState } from 'react'
import { Mail, ChevronDown } from 'lucide-react';
import ContactForm from '../../components/ContactForm/ContactForm';

// Componente principal de la página de Contacto
// Estructura: Hero -> Formulario (toggle) -> FAQ
const Contacto = () => {
  const [showForm, setShowForm] = useState(false)

  // Datos de preguntas frecuentes (FAQ)
  // Cada pregunta tiene un id único, pregunta y respuesta

  const faqData = [
    {
      id: 1,
      pregunta: "¿Cómo funciona ConectAR-Dev?",
      respuesta: "ConectAR-Dev es una plataforma que conecta empresas con freelancers argentinos especializados en tecnología. Las empresas publican sus proyectos, los freelancers envían propuestas, y ambas partes pueden revisar perfiles y calificaciones antes de iniciar la colaboración."
    },
    {
      id: 2,
      pregunta: "¿Qué servicios ofrecen los freelancers?",
      respuesta: "Los freelancers ofrecen una amplia gama de servicios IT: desarrollo web y móvil, diseño UI/UX, bases de datos, inteligencia artificial, DevOps, cloud computing, consultoría técnica y mentorías personalizadas en tecnología."
    },
    {
      id: 3,
      pregunta: "¿Cómo se manejan los pagos?",
      respuesta: "No intervenimos en los pagos. Nuestra función es únicamente poner en contacto a las partes, quienes coordinan entre sí los términos y la forma de pago."
    },
    {
      id: 4,
      pregunta: "¿Cuánto cuesta usar la plataforma?",
      respuesta: "Registrarse y buscar talento es completamente gratis. Los freelancers pueden crear su perfil sin costo alguno."
    },
    {
      id: 5,
      pregunta: "¿Cómo garantizan la calidad de los freelancers?",
      respuesta: "Todos los freelancers pasan por un proceso de verificación que incluye validación de identidad, portfolio y referencias. Además, contamos con un sistema de calificaciones y reseñas de clientes anteriores para ayudarte a tomar la mejor decisión."
    },
    {
      id: 6,
      pregunta: "¿Qué soporte ofrecen durante el proyecto?",
      respuesta: "Ofrecemos soporte continuo a través de nuestro chat en vivo, email y teléfono. También contamos con un sistema de mediación para resolver cualquier conflicto que pueda surgir durante la ejecución del proyecto."
    }
  ];
  
  // Estado para controlar qué pregunta del FAQ está abierta (solo una a la vez)
  const [openFaq, setOpenFaq] = useState(null)
    
  // Función para alternar la apertura/cierre de preguntas FAQ
  // @param {number} id - ID de la pregunta a abrir/cerrar

  const toggleFaq = (id) => {
    // Si la pregunta ya está abierta, la cerramos (null)
    // Si está cerrada, la abrimos (guardamos su id)
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
      <div className="bg-linear-to-b from-gray-700 to-gray-900 pb-0">
      {/* 
        SECCIÓN HERO / INTRODUCCIÓN 
        Presenta la página y el botón para mostrar el formulario
      */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icono decorativo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Tenés alguna consulta?
          </h1>

          {/* Descripción */}
          <p className="text-lg text-sky-200 mb-8">
            Estamos aquí para ayudarte. Ya sea que tengas preguntas sobre nuestros servicios, 
            necesites soporte técnico o quieras discutir un proyecto, nuestro equipo está 
            listo para asistirte.
          </p>

          {/* Botón para mostrar/ocultar formulario */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            aria-expanded={showForm}
            aria-controls="contact-form-section"
          >
            {showForm ? 'Ocultar Formulario' : 'Contactar Ahora'}
          </button>
        </div>
      </section>

      {/* 
        SECCIÓN FORMULARIO DE CONTACTO 
        Se muestra/oculta con animación según el estado showForm
      */}
      <section
        id="contact-form-section"
        className={`container mx-auto px-4 transition-all duration-500 ease-in-out ${
          showForm ? 'opacity-100 max-h-[2000px] mb-16' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
        aria-hidden={!showForm}
      >
        <div className="max-w-2xl mx-auto">
          {/* Componente del formulario (separado) */}
          <ContactForm />
        </div>
      </section>

      {/* 
        SECCIÓN FAQ (Preguntas Frecuentes)
        Accordion con 6 preguntas predefinidas
      */}
      <section className="container mx-auto px-4 py-16 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Título de la sección FAQ */}
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Preguntas Frecuentes
          </h2>

          {/* Lista de preguntas FAQ */}
          <div className="space-y-4">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
              >
                {/* Botón de pregunta (header del accordion) */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700 transition-colors duration-200"
                  aria-expanded={openFaq === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  {/* Texto de la pregunta */}
                  <span className="text-lg font-semibold text-white pr-4">
                    {faq.pregunta}
                  </span>

                  {/* Icono de chevron que rota cuando se abre */}
                  <ChevronDown
                    className={`w-5 h-5 text-blue-500 shrink-0 transition-transform duration-300 ${
                      openFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Respuesta (contenido del accordion) */}
                <div
                  id={`faq-answer-${faq.id}`}
                  className={`transition-all duration-300 ease-in-out ${
                    openFaq === faq.id
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="px-6 pb-4 pt-2">
                    <p className="text-blue-200 leading-relaxed">
                      {faq.respuesta}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

}

export default Contacto
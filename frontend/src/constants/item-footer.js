// footerLinks.js

/**
 * Estructura de datos para todos los enlaces del Footer.
 * Se organizan en un objeto, donde cada clave representa una columna.
 * El 'Contacto' se maneja de forma especial ya que usa diferentes tipos de datos (texto, arrays, objetos).
 */
export const FOOTER_DATA = {
    // Columna 1: Información Principal (Texto y Redes Sociales) - No requiere mapeo de enlaces, pero se define aquí si se necesita.
    principal: {
        titulo: "ConectAR-Dev",
        subtitulo: "Talento IT Argentino",
        descripcion: "La plataforma que conecta a los mejores freelancers argentinos del área IT con empresas que buscan talento nacional de calidad.",
        redes: [
            { icono: 'linkedin', url: 'https://linkedin.com/' },
            { icono: 'instagram', url: 'https://instagram.com/' },
            { icono: 'twitter', url: 'https://twitter.com/' },
        ],
    },
    
    // Columna 2: Servicios
    servicios: {
        titulo: "Servicios",
        enlaces: [
            { id: 'dev', texto: "Desarrollo Web", url: "/servicios/desarrollo-web" },
            { id: 'apps', texto: "Apps Móviles", url: "/servicios/apps-moviles" },
            { id: 'db', texto: "Bases de Datos", url: "/servicios/bases-de-datos" },
            { id: 'ia', texto: "Inteligencia Artificial", url: "/servicios/ia" },
            { id: 'cloud', texto: "DevOps & Cloud", url: "/servicios/devops-cloud" },
            { id: 'mentor', texto: "Mentorías", url: "/servicios/mentorias" },
        ]
    },

    // Columna 3: Empresa
    empresa: {
        titulo: "Empresa",
        enlaces: [
            { id: 'nosotros', texto: "Sobre Nosotros", url: "/empresa/sobre-nosotros" },
            { id: 'como', texto: "Cómo Funciona", url: "/empresa/como-funciona" },
            { id: 'empresas', texto: "Para Empresas", url: "/empresas" },
            { id: 'freelancers', texto: "Para Freelancers", url: "/freelancers" },
            { id: 'blog', texto: "Blog", url: "/blog" },
            { id: 'ayuda', texto: "Ayuda", url: "/ayuda" },
        ]
    },

    // Columna 4: Contacto (Datos No Enlazables)
    contacto: {
        titulo: "Contacto",
        datos: [
            { tipo: 'ubicacion', valor: "Buenos Aires, Argentina", icono: 'map-pin' },
            { tipo: 'email', valor: "hola@conectar-dev.com", url: "mailto:hola@conectar-dev.com", icono: 'mail' },
            { tipo: 'telefono', valor: "+54 9 11 2345-6789", url: "tel:+5491123456789", icono: 'phone' },
        ],
        // El bloque de "Orgullo Argentino" (puede ser un componente separado)
        claim: "Orgullo Argentino"
    }
};
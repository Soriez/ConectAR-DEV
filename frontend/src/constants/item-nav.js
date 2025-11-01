// Array de enlaces para el navbar
//  Cada objeto puede tener:
//  - id: identificador único
//  - name: texto que se muestra en el navbar
//  - href: URL para React Router (mantiene la URL en el navegador)
//  - scrollTo: (opcional) ID del elemento al que hacer scroll

const links = [
    { id: 1, 
      name: "Servicios",
      href: "/servicios", //URL que aparece en el navegador
      scrollTo: "servicios" //ID del elemento al que hacemos scroll
    },
    { id: 2,
      name: "Freelancers", 
      href: "/freelancers" // Este NO tiene scrollTo, navegará normalmente
    },
    { id: 3, 
      name: "ComoFunciona", 
      href: "/como-funciona",
      scrollTo: "como-funciona"// ID del elemento al que haremos scroll
    },
    { id: 4, 
      name: "Contacto", 
      href: "/contacto"  // Este NO tiene scrollTo, navegará normalmente
    },
];

export default links
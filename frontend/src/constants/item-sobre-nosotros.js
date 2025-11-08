import { Heart, Shield, Users, Lightbulb } from 'lucide-react';

export const sobre_nosotros_data ={
     valoresData : [
    {
      id: 1,
      icon: Heart,
      titulo: 'Pasión por la tecnología',
      descripcion: 'Amamos lo que hacemos y nos impulsa conectar a las personas correctas con los proyectos correctos.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 2,
      icon: Shield,
      titulo: 'Confianza y transparencia',
      descripcion: 'Construimos relaciones sólidas basadas en la honestidad y la comunicación clara.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      icon: Users,
      titulo: 'Comunidad colaborativa',
      descripcion: 'Fomentamos un ecosistema donde freelancers y empresas crecen juntos.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 4,
      icon: Lightbulb,
      titulo: 'Innovación constante',
      descripcion: 'Nos adaptamos a las nuevas tecnologías y tendencias para ofrecer la mejor experiencia.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ],

  /**
   * Datos del equipo
   * Cada miembro tiene nombre, rol e imagen
   */
 equipoData : [
    {
      id: 1,
      nombre: 'Leila Arroyo',
      rol: 'Product Owner',
      imagen: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      nombre: 'Jezabel Coronas',
      rol: 'Analista Funcional',
      imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      nombre: 'Santiago Oriez',
      rol: 'QA/Tester',
      imagen: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      nombre: 'Priscila Redondo',
      rol: 'UX/UI Designer',
      imagen: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      nombre: 'Leonel Rasjido',
      rol: 'Desarrollador',
      imagen: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    }
  ]
}
// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
export default { // CAMBIO CLAVE: Usamos 'export default' en lugar de 'module.exports'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores base (ajustados para que coincidan con el prototipo oscuro)
        'dark-blue': '#0A192F',
        'darker-blue': '#001E3C',
        
        // Colores de interaccion y branding
        'custom-blue': '#4A9EFF',
        'blue-dark': '#1E5385',
        'custom-orange': '#FF8C42',
        
        // Colores de inputs
        'input-bg': '#102A4A',
        'input-border': '#203E60',
        'light-gray': '#8B94A8',
        'placeholder': '#8B94A8',
      },
    },
  },
  plugins: [],
}
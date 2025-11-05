// frontend/postcss.config.mjs

export default {
  plugins: {
    // CAMBIO CLAVE: Usamos el nuevo nombre del plugin de PostCSS
    '@tailwindcss/postcss': {}, 
    autoprefixer: {},
  },
};
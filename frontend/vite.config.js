import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname (necesario cuando se usa ESM para obtener la ruta del directorio actual)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    // La propiedad 'root' debe ser una función en Vite 5 para que 'path.resolve' funcione correctamente.
    // Aunque en este caso, la configuración dentro de 'defineConfig' ya maneja la ruta base.
    
    
    server: {
        port: 8080,
        hot: true
    },
    
    resolve: {
        alias: {
            // Se usa '__dirname' para resolver la ruta a node_modules
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    
    css: {
        devSourcemap: true
    }
});
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Expose the API_KEY to the client
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    // 1. Force esbuild to compile to esnext
    esbuild: {
      target: 'esnext'
    },
    // 2. Force dependency optimization to use esnext (this handles node_modules like pdfjs-dist)
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    },
    // 3. Force final production build to use esnext
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'esnext' 
    }
  };
});
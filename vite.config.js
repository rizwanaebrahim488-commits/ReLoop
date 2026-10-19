import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages (https://rizwanaebrahim488-commits.github.io/ReLoop/)
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/ReLoop/' : '/'),
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-maps': ['leaflet']
        }
      }
    }
  }
});

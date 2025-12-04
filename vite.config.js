import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure assets are loaded from root
  build: {
    assetsDir: 'assets', // Assets folder name
    outDir: 'dist',
  },
  define: {
    // Set backend URL for production - uses same domain, no subdomain
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify('https://vision-ai-production.up.railway.app')
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.freepik.com/v1/ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

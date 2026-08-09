import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/prices': {
        target: 'https://www.prijsprofeet.nl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/prices/, '/api/v1/search'),
        headers: { 'User-Agent': 'Hap/1.0 (local recipe app)' },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'catalog', test: /src[\\/]data[\\/]recipes\.generated\.json$/, priority: 30 },
            { name: 'react-vendor', test: /node_modules[\\/](?:react|react-dom)[\\/]/, priority: 20 },
            { name: 'icons', test: /node_modules[\\/]lucide-react[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
})

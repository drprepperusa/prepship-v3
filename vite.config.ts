import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4014,
    host: '0.0.0.0',
    allowedHosts: [
      'prepshipv3.drprepperusa.com',
      'localhost',
      '127.0.0.1',
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        headers: {
          'X-App-Token': process.env.SESSION_TOKEN || '2431ac56eba4fdda-efde772175b96d2fe648a5df5a2126b0fff9ac3a6ef482b',
        },
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'import.meta.env.VITE_SESSION_TOKEN': JSON.stringify(process.env.SESSION_TOKEN || '2431ac56eba4fdda-efde772175b96d2fe648a5df5a2126b0fff9ac3a6ef482b'),
  },
})

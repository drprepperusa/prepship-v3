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
        target: 'http://127.0.0.1:4010',
        changeOrigin: true,
        headers: {
          'X-App-Token': process.env.SESSION_TOKEN || 'b05b4996d27144788a085477e5db30fbe2e057c7029ab2617647704bf3a07c75',
        },
        onProxyRes: (proxyRes, req, res) => {
          // Add CORS headers for tunnel access
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-App-Token, Authorization';
        },
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'import.meta.env.VITE_SESSION_TOKEN': JSON.stringify(process.env.SESSION_TOKEN || 'b05b4996d27144788a085477e5db30fbe2e057c7029ab2617647704bf3a07c75'),
  },
})

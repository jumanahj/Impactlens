
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows process.env.API_KEY to work in the browser locally
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || 'YOUR_API_KEY_HERE')
  },
  server: {
    port: 5173,
    open: true
  }
});

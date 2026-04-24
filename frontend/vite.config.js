import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { historyApiFallback: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'react-hot-toast'],
          'vendor-utils': ['axios', 'clsx', 'jwt-decode', 'socket.io-client']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
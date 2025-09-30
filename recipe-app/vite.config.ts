import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/recipes/', // GitHub Pages subpath deployment
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: false,
      interval: 100
    },
    // Enable SPA fallback for development - serves index.html for all routes
    historyApiFallback: true
  },
  build: {
    outDir: '../dist', // Build to root dist directory for GitHub Pages
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})

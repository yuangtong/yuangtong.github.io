import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import { splitVendorChunkPlugin } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  // Asegurarse de que la base sea correcta para GitHub Pages o Netlify
  base: '/',
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // Add imagemin plugin to optimize images
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4,
      },
      webp: {
        quality: 75,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
        ],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Yuang Tong Portfolio',
        short_name: 'YT Portfolio',
        description: 'Designer & Developer Portfolio',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Cambiado a false para depuración
        drop_debugger: false, // Cambiado a false para depuración
        pure_funcs: [] // Eliminado para depuración
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'ui-components': ['lucide-react']
        },
        // Optimize code splitting
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      },
      // Tree shaking to remove unused code
      treeshake: {
        moduleSideEffects: false,
      }
    },
    chunkSizeWarningLimit: 1000,
    // Habilitar sourcemaps para depuración
    sourcemap: true,
    // Improve CSS handling
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4kb
  },
  server: {
    open: true
  }
});

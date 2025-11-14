/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-brands-svg-icons',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'react-globe.gl',
      'framer-motion',
      'gsap'
    ],
    // Force esbuild to handle these correctly
    esbuildOptions: {
      target: 'es2020'
    }
  },
  // Resolve configuration to prevent React duplication
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts']
  },
  plugins: [
    react({
      // Ensure React is not duplicated in multiple chunks
      jsxRuntime: 'automatic',
      // Disable Fast Refresh in production to avoid potential issues
      fastRefresh: process.env.NODE_ENV !== 'production'
    }),
    // Skip imagemin in CI/Netlify environments due to native binary dependency issues
    ...(process.env.CI || process.env.NETLIFY ? [] : [
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
      })
    ]),
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
      },
      // Add this configuration to increase the size limit
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MiB
      }
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    // Use Vite default (esbuild) for safer minification across browsers
    minify: 'esbuild',
    emptyOutDir: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1500,
    // Target modern browsers to avoid TDZ issues
    target: 'es2020',
    // Removed terserOptions to avoid runtime errors in vendor chunks (Cannot access 'n' before initialization)
    rollupOptions: {
      output: {
        // Use ES module format for better compatibility
        format: 'es',
        // Important: disable hoisting to ensure React is loaded first
        hoistTransitiveImports: false,
        // Prevent inlining of dynamic imports to ensure proper chunk loading order
        inlineDynamicImports: false,
        manualChunks(id) {
          // CRITICAL: React core must be in its own chunk and loaded first
          if (id.includes('node_modules/react/') && !id.includes('node_modules/react-dom') && !id.includes('node_modules/react-router')) {
            return 'react-core';
          }
          
          // React DOM depends on react-core
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
            return 'react-dom';
          }
          
          // Router depends on react-core
          if (id.includes('node_modules/react-router') || 
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/@remix-run')) {
            return 'router-vendor';
          }
          
          // Three.js and 3D libraries (depend on react)
          if (id.includes('node_modules/three') || 
              id.includes('node_modules/@react-three') ||
              id.includes('node_modules/react-globe.gl') ||
              id.includes('node_modules/globe.gl') ||
              id.includes('node_modules/three-globe')) {
            return 'three-vendor';
          }
          
          // FontAwesome (depends on react)
          if (id.includes('node_modules/@fortawesome')) {
            return 'fontawesome-vendor';
          }
          
          // UI libraries (depend on react)
          if (id.includes('node_modules/framer-motion') || 
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/react-type-animation')) {
            return 'ui-vendor';
          }
          
          // GSAP animation library (standalone)
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor';
          }
          
          // Other third-party libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
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
      }
    },
    sourcemap: true,
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  server: {
    open: true
  }
});

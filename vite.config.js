import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Base configuration
  root: '.',
  publicDir: 'public',

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Intelligent chunking strategy
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            // Large libraries get their own chunks
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('lodash') || id.includes('underscore')) return 'vendor-lodash';
            if (id.includes('jquery')) return 'vendor-jquery';
            if (id.includes('react') || id.includes('vue') || id.includes('angular')) return 'vendor-framework';

            // Group smaller vendor files
            return 'vendor';
          }

          // Feature-based chunks for application code
          if (id.includes('src/ab-testing')) return 'feature-ab-testing';
          if (id.includes('src/analytics')) return 'feature-analytics';
          if (id.includes('src/components')) return 'feature-components';

          // Default chunk for remaining code
          return 'app';
        },

        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/img/[name]-[hash][extname]`;
          }

          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }

          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    // Performance optimizations
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },

  // Development server configuration
  server: {
    host: true,
    port: 3000,
    open: true,
    cors: true,

    // Security headers for development
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },

  // Preview server (for testing production builds)
  preview: {
    port: 4173,
    host: true,
  },

  // Plugin configuration
  plugins: [
    // PWA Plugin with simplified configuration
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif}'],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Website Templates - Professional Web Design',
        short_name: 'WebTemplates',
        description: 'Production-ready website templates for businesses',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  // Dependency optimization
  optimizeDeps: {
    include: [
      'gsap',
      'lodash',
      // Add other commonly used dependencies
    ],
    exclude: [
      // Dependencies that should not be pre-bundled
    ],
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js',
  },

  // Environment variables
  envPrefix: 'VITE_',

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },

  // Testing configuration (Vitest)
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],

    // Coverage configuration
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'scripts/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/coverage/**',
      ],
    },
  },

  // ESBuild configuration
  esbuild: {
    // Drop console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});

import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import fs from 'fs';
import path from 'path';

// Main application entry point
const mainEntry = resolve(__dirname, 'index.html');

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isAnalyze = mode === 'analyze';

  return {
    // Base public path
    base: './',

    // Build configuration
    build: {
      // Output directory
      outDir: 'dist',

      // Asset directory
      assetsDir: 'assets',

      // Source maps for debugging
      sourcemap: !isProduction,

      // Minification
      minify: isProduction ? 'terser' : false,

      // Terser options
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,

      // Rollup options
      rollupOptions: {
        input: mainEntry,

        // External dependencies
        external: [],

        output: {
          // Manual chunks for better caching
          manualChunks: {
            vendor: ['mustache', 'gsap'],
            utils: ['lazysizes', 'intersection-observer', 'focus-visible', 'smoothscroll-polyfill'],
          },

          // Asset file naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const extType = info[info.length - 1];
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/\.(css)$/i.test(assetInfo.name)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },

          // Chunk file naming
          chunkFileNames: 'assets/js/[name]-[hash].js',

          // Entry file naming
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },

      // Chunk size warnings
      chunkSizeWarningLimit: 1000,

      // CSS code splitting
      cssCodeSplit: true,

      // Target browsers
      target: ['es2015', 'chrome60', 'firefox60', 'safari12', 'edge79'],
    },

    // Development server
    server: {
      host: true,
      port: 3000,
      open: true,

      // CORS
      cors: true,

      // Proxy for API calls (if needed)
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Preview server (for testing production build)
    preview: {
      host: true,
      port: 4173,
    },

    // CSS configuration
    css: {
      // PostCSS configuration
      postcss: './postcss.config.js',

      // CSS modules
      modules: {
        localsConvention: 'camelCaseOnly',
      },

      // Preprocessor options
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/styles/variables.scss";`,
          charset: false,
        },
      },

      // Development CSS sourcemaps
      devSourcemap: true,
    },

    // Plugin configuration
    plugins: [

      // PWA plugin - disabled due to workbox configuration issues
      // TODO: Fix workbox configuration for service worker generation
      // VitePWA({
      //   registerType: 'autoUpdate',
      //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      //   manifest: {
      //     name: 'Website Templates',
      //     short_name: 'Templates',
      //     description: 'Professional website templates with CMS integrations',
      //     theme_color: '#ffffff',
      //     icons: [
      //       {
      //         src: 'pwa-192x192.png',
      //         sizes: '192x192',
      //         type: 'image/png',
      //       },
      //       {
      //         src: 'pwa-512x512.png',
      //         sizes: '512x512',
      //         type: 'image/png',
      //       },
      //     ],
      //   },
      //   workbox: {
      //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      //     runtimeCaching: [
      //       {
      //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      //         handler: 'CacheFirst',
      //         options: {
      //           cacheName: 'google-fonts-cache',
      //             expiration: {
      //               maxEntries: 10,
      //               maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      //             },
      //             cacheKeyWillBeUsed: async ({ request }) => {
      //               return `${request.url}`;
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   },
      // }),

      // Bundle analyzer (only in analyze mode)
      ...(isAnalyze ? [
        visualizer({
          filename: 'reports/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      ] : []),
    ],

    // Dependency optimization
    optimizeDeps: {
      include: [
        'mustache',
        'gsap',
        'lazysizes',
        'intersection-observer',
        'focus-visible',
        'smoothscroll-polyfill',
      ],
      exclude: [],
    },

    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'components'),
        '@industries': resolve(__dirname, 'industries'),
        '@kits': resolve(__dirname, 'kits'),
        '@tools': resolve(__dirname, 'tools'),
        '@assets': resolve(__dirname, 'assets'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@scripts': resolve(__dirname, 'src/scripts'),
        '@utils': resolve(__dirname, 'src/utils'),
      },
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __IS_PRODUCTION__: isProduction,
    },

    // ESBuild configuration
    esbuild: {
      // Drop console.log in production
      drop: isProduction ? ['console', 'debugger'] : [],
      // Target
      target: 'es2015',
    },

    // Legacy browser support
    ...(isProduction ? {
      legacy: {
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      },
    } : {}),
  };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.'
        },
        {
          src: 'public/icons/*',
          dest: 'icons'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/popup.html'),
        'service-worker': path.resolve(__dirname, 'src/service-worker.ts'),
        'content-script': path.resolve(__dirname, 'src/content-script.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Service worker and content script at root level
          if (chunkInfo.name === 'service-worker' || chunkInfo.name === 'content-script') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          // popup.html at root level
          if (name === 'popup.html') {
            return 'popup.html';
          }
          // CSS files at root assets
          if (name.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    },
    // Disable code splitting for service worker and content script
    modulePreload: false,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});

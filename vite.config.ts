import { defineConfig } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng';

export default defineConfig({
  base: '/bybk-char/',

  build: {
    outDir: 'dist',
    target: 'esnext',
  },

  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },

  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [
    createSvgIconsPlugin({
      iconDirs: ['src/assets/icons'],
    }),
  ],
});

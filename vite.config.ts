import { defineConfig, type Plugin } from 'vite';

// Strips type="module" and crossorigin from script tags so dist/index.html
// can be opened directly via file:// without a dev server.
function removeModuleType(): Plugin {
  return {
    name: 'remove-module-type',
    apply: 'build',   // dev server needs type="module" — only strip for production build
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin/g, '<script')
        .replace(/<script type="module"/g, '<script');
    },
  };
}

export default defineConfig({
  plugins: [removeModuleType()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
});

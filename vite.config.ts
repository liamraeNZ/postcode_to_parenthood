import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

function copyStaticAssets(): Plugin {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const src = path.resolve(__dirname, 'static/data/icb-boundaries.topojson');
      const destDir = path.resolve(__dirname, 'dist/data');
      if (fs.existsSync(src)) {
        fs.mkdirSync(destDir, {recursive: true});
        fs.copyFileSync(src, path.resolve(destDir, 'icb-boundaries.topojson'));
      }
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), copyStaticAssets()],
    envPrefix: ['VITE_'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: ['**/.wrangler/**']
      },
    },
  };
});

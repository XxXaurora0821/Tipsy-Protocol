import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiPort = env.PORT || '8787';
    return {
      server: {
        port: 3000,
        host: env.VITE_HOST || '127.0.0.1',
        proxy: {
          '/api': {
            target: `http://127.0.0.1:${apiPort}`,
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

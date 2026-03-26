import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const packageDir = fileURLToPath(new URL('.', import.meta.url));
const parentDir = fileURLToPath(new URL('..', import.meta.url));

function viteEnvDefine(mode: string): Record<string, string> {
  const merged = {
    ...loadEnv(mode, packageDir, 'VITE_'),
    ...loadEnv(mode, parentDir, 'VITE_'),
  };
  const define: Record<string, string> = {};
  for (const key of Object.keys(merged)) {
    define[`import.meta.env.${key}`] = JSON.stringify(merged[key]);
  }
  return define;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: viteEnvDefine(mode),
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));

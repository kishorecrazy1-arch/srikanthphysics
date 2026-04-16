import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
/** Some clones keep `.env` only under `./srikanthphysics/` while `npm run dev` runs from the repo root. */
const nestedEnvDir = fileURLToPath(new URL('./srikanthphysics', import.meta.url));

function viteEnvDefine(mode: string): Record<string, string> {
  const merged = {
    ...loadEnv(mode, nestedEnvDir, 'VITE_'),
    ...loadEnv(mode, rootDir, 'VITE_'),
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
    port: 5175,
    proxy: {
      // Daily Question Engine (FastAPI): `cd python/daily_question_engine && uvicorn app.main:app --port 8000`
      '/daily-engine-api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/daily-engine-api/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));

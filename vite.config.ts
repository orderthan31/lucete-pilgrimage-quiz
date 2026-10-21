import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const projectDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    fs: { strict: true, allow: [projectDirectory] },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.tsx'],
  },
});

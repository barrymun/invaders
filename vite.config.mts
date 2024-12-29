/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';

import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(version),
  },
  test: {
    setupFiles: ['/tests/setup.ts'],
    coverage: {
      provider: 'istanbul',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/_mantine" as *;`,
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-hook-form': ['react-hook-form'],
          'yup': ['yup'],
          'react-i18next': ['react-i18next'],
          'countries-list': ['countries-list'],
          'react': ['react'],
          'react-dom': ['react-dom'],
          'mantine': ['@mantine/core'],
          'faker': ['@faker-js/faker'],
        },
      },
    },
  },
});

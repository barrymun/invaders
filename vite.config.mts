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
    coverage: {
      provider: 'istanbul',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/_mantine";`,
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
});

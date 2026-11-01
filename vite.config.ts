/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// @ts-expect-error type error without @types/node package
import process from "node:process";
import path from "node:path";
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: [
      {
        find: 'monaco-editor/esm/vs/editor/editor.api',
        replacement: path.resolve(process.cwd(), 'node_modules/monaco-editor/esm/vs/editor/editor.api.js'),
      },
      {
        find: 'monaco-editor/esm/vs/editor/common/commands/shiftCommand',
        replacement: path.resolve(process.cwd(), 'node_modules/monaco-editor/esm/vs/editor/common/commands/shiftCommand.js'),
      },
      {
        find: /^monaco-editor$/,
        replacement: path.resolve(process.cwd(), 'node_modules/monaco-editor/esm/vs/editor/editor.main.js'),
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('monaco-vim') || id.includes('monaco-editor')) {
            return 'monaco-vendor';
          }
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
        },
      },
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));

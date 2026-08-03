import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",  // Important for Electron — use relative paths
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    target: "es2015",        // Windows 7 compatible
    cssTarget: "chrome49",   // Windows 7 Chrome minimum
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    target: "es2015",
  },
});

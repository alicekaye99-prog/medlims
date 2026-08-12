import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "./" : "/",
  server: {
    port: 5173,
    host: "0.0.0.0",
    strictPort: true,
  },
  build: {
    outDir: "dist",
    target: "es2015",
    cssTarget: "chrome49",
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
}));

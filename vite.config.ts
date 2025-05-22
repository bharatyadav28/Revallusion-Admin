import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // Enable source maps for better error tracing
  },

  server: {
    proxy: {
      "/api": {
        // target: "https://revallusion.onrender.com",
        target: "http://localhost:4000",
        changeOrigin: true, // This is required to ensure the Host header matches the target domain
      },
      "/videos": {
        target: "https://dcays3srybill.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/videos/, ""),
      },
    },
  },
});

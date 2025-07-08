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
        target: "https://revallusion.onrender.com",
        // target: "https://api.ravallusion.com",
        // target: "http://localhost:4000",
        changeOrigin: true,
        configure: (proxyServer) => {
          proxyServer.on("error", (err: Error, _req, res) => {
            console.error("[Proxy Error]", (err as any).code || "UNKNOWN");

            // Handle ECONNRESET or other network-level errors
            if (!res.headersSent) {
              res.writeHead(500, { "Content-Type": "application/json" });
            }

            res.end(
              JSON.stringify({
                success: false,
                message: "Proxy error occurred",
                error: (err as any).code || "UNKNOWN",
              })
            );
          });
        },
      },
      "/videos": {
        target: "https://d2b1ol8c9bt133.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/videos/, ""),
      },
    },
  },
});

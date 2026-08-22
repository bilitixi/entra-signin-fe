import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// See README.md — local dev proxies /api to Django so cookies stay same-site.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api/v1": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});

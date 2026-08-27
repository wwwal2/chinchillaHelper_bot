import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/logs": { target: "http://localhost:8080", changeOrigin: true },
      "/status": { target: "http://localhost:8080", changeOrigin: true },
      "/control": { target: "http://localhost:8080", changeOrigin: true },
    },
  },
});

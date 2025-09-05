// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://agent.ivoz.ai",
        changeOrigin: true,
        secure: false, // set to true if SSL cert is valid
      },
    },
  },
});

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['agent.ivoz.ai'], // 👈 allow your custom domain
    host: '0.0.0.0',                 // optional: listen on all IPs
    port: 5173,    
    proxy: {
      "/api": {
        target: "https://agent.ivoz.ai",
        changeOrigin: true,
        secure: false, // set to true if SSL cert is valid
      },
    },
  },
});

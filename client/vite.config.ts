import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
    }),
  ],

  resolve: {
    alias: {
      stream: "stream-browserify",
      util: "util/",
      events: "events/",
    },
  },
  define: {
    global: "window",
    "process.env": {},
  },
});

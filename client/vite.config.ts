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

      manifest: {
        name: "SagX",
        short_name: "SagX",
        description: "Your Favorite Management Tool",
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",

        icons: [
          {
            src: "/icons/icon-192.webp",
            sizes: "192x192",
            type: "image/webp",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.webp",
            sizes: "512x512",
            type: "image/webp",
            purpose: "any maskable",
          },
        ],
      },
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

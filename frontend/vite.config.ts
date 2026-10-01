import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "API_");

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",

        workbox: {
          runtimeCaching: [
            {
              // Функция сериализуется в sw.js: не использует внешние переменные.
              urlPattern: ({ request, url }) =>
                request.destination === "image" &&
                request.mode === "cors" &&
                url.origin === "https://res.cloudinary.com" &&
                !url.search &&
                /^\/[^/]+\/image\/upload\/c_limit,w_(256|960|1200)\/f_auto\/q_auto\/v\d+\/.+/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "maqas-images-v1",
                cacheableResponse: { statuses: [200] },
                expiration: {
                  maxEntries: 150,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                  purgeOnQuotaError: true,
                },
              },
            },
          ],
        },

        manifest: {
          name: "Maqas",
          short_name: "Maqas",
          description: "Maqas social network",

          start_url: "/",
          scope: "/",

          display: "standalone",

          background_color: "#121416",
          theme_color: "#121416",

          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.API_PROXY_TARGET || "https://maqas.ru",
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});

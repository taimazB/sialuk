import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    },
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/scripts",
    "nuxt-gtag",
    "@nuxtjs/sitemap",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  gtag: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },
  site: {
    url: "https://sialuk.com",
    name: "Sialuk Climate Data Platform",
  },
  sitemap: {
    urls: ["https://sialuk.com", "https://sialuk.com/climate-rings"],
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "author", content: "Sialuk" },
        { name: "theme-color", content: "#1976d2" },
        { property: "og:site_name", content: "Sialuk" },
        { property: "og:locale", content: "en_US" },
        { name: "twitter:site", content: "@sialuk" }, // Replace with actual Twitter handle
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://sialuk.com" }, // Replace with actual domain
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"]
    },
    compressPublicAssets: true,
  },
  css: [
    "vuetify/lib/styles/main.sass", // Or main.css if you prefer
    "@mdi/font/css/materialdesignicons.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  experimental: {
    payloadExtraction: false,
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});

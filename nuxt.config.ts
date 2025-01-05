// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: "Proclaimify",
      htmlAttrs: { lang: "en" },
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        {
          rel: "mask-icon",
          href: "/safari-pinned-tab.svg",
          color: "#fb8661",
        },
        { rel: "shortcut icon", href: "/favicon.ico" },
      ],
      meta: [
        { name: "msapplication-TileColor", content: "#fb8661" },
        { name: "msapplication-Config", content: "/browserconfig.xml" },
        { name: "theme-color", content: "#fb8661" },
        { name: "description", content: "Convert your lyrics" },
      ],
    },
  },

  fontMetrics: { fonts: ["Inter"] },

  modules: [
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxt/ui",
    "@nuxtjs/fontaine",
    "nuxt-svgo",
  ],

  css: ["~/assets/main.css"],

  compatibilityDate: "2024-08-07",
});


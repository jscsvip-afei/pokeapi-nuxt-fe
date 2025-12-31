// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
   vite: {
    plugins: [tailwindcss()],
  },
  css: ["./app/tailwind.css"],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ]
})

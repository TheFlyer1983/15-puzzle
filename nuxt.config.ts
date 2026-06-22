// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/supabase'],
  supabase: {
    redirect: false,
    types: false
  },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  }
});

import { isDevelopment } from 'std-env'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  extends: ['pruvious'],
  modules: ['@nuxt/ui'],
  nitro: { preset: 'cloudflare_module' },
  pruvious: {
    auth: { jwt: { secret: 'dev' } },
    debug: { logs: { driver: 'sqlite://logs.sqlite' } },
    i18n: {
      languages: [
        { name: 'English', code: 'en' },
        { name: 'Deutsch', code: 'de' },
        { name: 'Français', code: 'fr' },
      ],
    },
    ...(isDevelopment
      ? undefined
      : {
          database: { driver: 'd1://DB' },
          uploads: { driver: 'r2://UPLOADS' },
          debug: { logs: { driver: 'd1://LOGS' } },
        }),
  },
  ssr: false,
})

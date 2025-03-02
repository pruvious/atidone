import {
  isValidLanguageCode,
  preloadTranslatableStrings,
  primaryLanguage,
  useAuth,
  useLanguage,
} from '#pruvious/client'

export default defineNuxtRouteMiddleware(async () => {
  const language = useLanguage()
  const storedLanguage = localStorage.getItem('language')
  const auth = useAuth()

  if (auth.value.isLoggedIn) {
    if (storedLanguage !== auth.value.user.contentLanguage) {
      localStorage.setItem('language', auth.value.user.contentLanguage)
    }

    language.value = auth.value.user.contentLanguage
  } else {
    language.value = isValidLanguageCode(storedLanguage)
      ? storedLanguage
      : primaryLanguage
  }

  await preloadTranslatableStrings('default', language.value)
})

export const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('../../locales/*.y(a)?ml', { eager: true }))
    .map(([key, value]) => {
      const yaml = key.endsWith('.yaml')
      return [key.slice(14, yaml ? -5 : -4), value.default]
    }),
)
export const fallbackLocale = 'en'

const prefferedLanguages = usePreferredLanguages()
const availableLocales = Object.keys(messages)

const isLocaleAvailable = (lang: string) => availableLocales.includes(lang)
export function toAvailableLocale(lang: string) {
  return isLocaleAvailable(lang)
    ? lang
    : fallbackLocale
}

const defaultLanguage = ref(fallbackLocale)

watch(prefferedLanguages, (prefferedLanguages) => {
  defaultLanguage.value = prefferedLanguages.find(isLocaleAvailable) || fallbackLocale
}, { immediate: true })
export const locale = ref(defaultLanguage)

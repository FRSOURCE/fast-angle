import { createI18n } from 'vue-i18n'
import type { UserModule } from '~/types'
import { fallbackLocale, locale, messages } from '~/composables/locale'

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//

export const install: UserModule = ({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: locale.value,
    fallbackLocale,
    messages,
  })

  app.use(i18n)

  watch(i18n.global.locale, (newLocale) => {
    locale.value = newLocale
  })
}

export const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: Record<string, string> }>(
      '../../locales/*.y(a)?ml',
      { eager: true },
    ),
  ).map(([key, value]) => {
    const yaml = key.endsWith('.yaml');
    return [key.slice(14, yaml ? -5 : -4), value.default];
  }),
);
export const fallbackLocale = 'en';

const prefferedLanguages = usePreferredLanguages();
const availableLocales = Object.keys(messages);

const isLocaleAvailable = (lang: string) => availableLocales.includes(lang);
export const toAvailableLocale = (lang: string) =>
  isLocaleAvailable(lang) ? lang : fallbackLocale;

const defaultLanguage = ref(fallbackLocale);

watch(
  prefferedLanguages,
  (prefferedLanguages) => {
    defaultLanguage.value =
      prefferedLanguages.find(isLocaleAvailable) || fallbackLocale;
  },
  { immediate: true },
);
export const locale = useLocalStorage(
  'fast-angle-locale',
  defaultLanguage.value,
);

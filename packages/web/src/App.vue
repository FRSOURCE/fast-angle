<script setup lang="ts">
const { t, locale, availableLocales } = useI18n()
const router = useRouter()

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Fast angle',
  htmlAttrs: {
    lang: locale,
  },
  meta: [
    { name: 'description', content: computed(() => t('main.description')) },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: '@FRSOURCE1' },
    { name: 'og:url', content: `${host}${basePath}` },
    { name: 'og:title', content: 'Fast Angle' },
    { name: 'og:description', content: computed(() => t('main.description')) },
    { name: 'og:image', content: `${host}${basePath}fast-angle-og-image.jpg` },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#0189e9' : '#0189e9'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: favicon,
    },
    ...availableLocales.map(locale => ({
      rel: 'alternate',
      hreflang: locale,
      href: `${host}${basePath}${router.resolve({ name: `lang-${locale}` }).fullPath.substring(1)}`,
    })),
  ],
})

onMounted(() => {
  // Make sure viewport is always 100vh, even with mobile keyboard open
  // https://stackoverflow.com/a/62054041/8805801
  const viewport = document.querySelector<HTMLMetaElement>('meta[name=viewport]')
  viewport?.setAttribute('content', `width=device-width, height=${window.innerHeight}, initial-scale=1.0`)
})
</script>

<template>
  <RouterView />
</template>


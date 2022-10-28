<script setup lang="ts">
const { t } = useI18n()
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Fast angle',
  meta: [
    { name: 'description', content: t('main.description') },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: '@FRSOURCE1' },
    { name: 'og:url', content: `${host}${basePath}` },
    { name: 'og:title', content: 'Fast Angle' },
    { name: 'og:description', content: t('main.description') },
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
  <Header :class="$style.header" />
  <main :class="$style.main">
    <Board ref="boardRef" :class="$style.board" />
    <Footer />
  </main>
</template>

<style lang="scss" module>
.main {
  --block-spacing-vertical: 0!important;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
}

.board {
  flex-grow: 1;
}
</style>

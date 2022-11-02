<script lang="ts" setup>
const { locale } = useI18n()
const uriLocale = useUriLocale()
watch(uriLocale, (uriLocale) => {
  if (uriLocale && uriLocale !== locale.value)
    locale.value = toAvailableLocale(uriLocale)
}, { immediate: true })

const router = useRouter()

watch(locale, (locale) => {
  const currentPath = router.currentRoute.value.path.split('/')
  currentPath[1] = locale
  router.push(currentPath.join('/'))
})
</script>

<template>
  <Header :class="$style.header" />
  <main :class="$style.main">
    <slot><RouterView /></slot>
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
</style>

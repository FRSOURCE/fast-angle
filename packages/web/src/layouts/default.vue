<script lang="ts" setup>
const { locale } = useI18n();
const uriLocale = useUriLocale();
watch(
  uriLocale,
  (uriLocale) => {
    if (uriLocale && uriLocale !== locale.value)
      locale.value = toAvailableLocale(uriLocale);
  },
  { immediate: true },
);

const router = useRouter();
const showFooter = computed(() => {
  const routeName = (router.currentRoute.value.name as string) || '';
  return routeName.split('-').length !== 2;
});

watch(locale, (locale) => {
  const currentPath = router.currentRoute.value.path.split('/');
  currentPath[1] = locale;
  router.push(currentPath.join('/'));
});
</script>

<template>
  <Header :class="$style.header" />
  <main :class="[$style.main, { [$style['main-no-footer']]: !showFooter }]">
    <slot><RouterView /></slot>
    <Footer v-if="showFooter" />
  </main>
</template>

<style lang="scss" module>
.header {
  position: sticky;
  top: 0;
  background: var(--background-color);
}

.main {
  --block-spacing-vertical: 0px !important;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  overflow: hidden;
}

.main-no-footer {
  @media (min-width: 768px) {
    padding-bottom: 0.5rem !important;
  }

  @media (min-width: 1024px) {
    padding-bottom: 1rem !important;
  }
}
</style>

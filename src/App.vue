<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Fast angle',
  meta: [
    { name: 'description', content: 'Online protractor - measure any angle directly on your image!' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
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

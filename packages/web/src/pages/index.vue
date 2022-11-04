<script lang="ts" setup>
const { t } = useI18n()

useHead({
  meta: [
    {
      'http-equiv': 'status' as 'refresh',
      'content': '302',
    },
    {
      'http-equiv': 'refresh',
      'content': `0;${host}${basePath}en`,
    },
  ],
})
</script>

<template>
  <h1 v-text="t('lang_redirect.title')" />
  <p v-text="t('lang_redirect.description')" />
</template>

<route lang="yaml">
meta:
  layout: centered
</route>

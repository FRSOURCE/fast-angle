<script lang="ts" setup>
const { t } = useI18n();

const currentRoute = useRoute();
const uriLocale = useUriLocale();
const lang = computed(() => toAvailableLocale(uriLocale.value));
const currentUrl = computed(() => currentRoute.fullPath);
</script>

<template>
  <div>
    <h1 v-text="t('404.title')" />
    <p>
      <i18n-t keypath="404.description">
        <template #url>
          <i>{{ currentUrl }}</i>
        </template>
      </i18n-t>
      <a
        rel="noreferrer"
        href="https://github.com/FRSOURCE/fast-angle"
        target="_blank"
        v-text="t('404.file_issue_button')"
      />
    </p>
    <p v-if="lang">
      {{ t('404.redirect_button_description') }}
      <RouterLink :to="{ name: `lang-${lang}` }">
        {{ t('404.redirect_button') }}
      </RouterLink>
    </p>
  </div>
</template>

<route lang="yaml">
meta:
  layout: centered
</route>

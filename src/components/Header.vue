<script setup lang="ts">
import IconSun from '~icons/carbon/sun'
import IconMoon from '~icons/carbon/moon'
import IconLanguage from '~icons/carbon/language'

const { t, availableLocales, locale } = useI18n()
</script>

<template>
  <header class="header">
    <nav>
      <ul />
      <ul>
        <li>
          <details role="list" :title="t('board.nav.toggle_langs')">
            <summary aria-haspopup="listbox" role="link">
              <IconLanguage />
            </summary>
            <ul role="listbox" class="dropdown">
              <li v-for="lang in availableLocales" :key="lang">
                <a @click.prevent="locale = lang">{{ lang }}</a>
              </li>
            </ul>
          </details>
        </li>

        <li>
          <button type="button" role="button" :title="t('board.nav.toggle_dark')" @click="toggleDark()">
            <IconSun v-if="isDark" />
            <IconMoon v-else />
          </button>
        </li>
      </ul>
    </nav>

    <hgroup>
      <h2>{{ t('main.title') }}</h2>
      <h3>{{ t('main.description') }}</h3>
    </hgroup>
  </header>
</template>

<style lang="scss">
.header {
  --block-spacing-vertical: 0!important;
}

.dropdown {
  max-height: 200px;
  overflow: auto;
}
</style>


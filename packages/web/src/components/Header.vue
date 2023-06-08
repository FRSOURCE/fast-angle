<script setup lang="ts">
import { basePath } from '~/composables/basePath'
import { favicon } from '~/composables/favicon'
import { isDark, toggleDark } from '~/composables/dark'
import IconSun from '~icons/carbon/sun'
import IconMoon from '~icons/carbon/moon'
import IconLanguage from '~icons/carbon/language'

const { t, availableLocales, locale } = useI18n()
const detailsRef = ref<HTMLDetailsElement>()
const open = ref(false)

function setLocale(value: string) {
  locale.value = value
  open.value = false
}
</script>

<template>
  <header
    :class="$style.header"
  >
    <hgroup
      :class="$style.heading"
    >
      <h1>
        <a :href="basePath" :class="$style.title">
          <img :src="favicon" :class="$style.favicon" alt="Fast Angle logo" width="32" height="32">
          {{ t('main.title') }}
        </a>
      </h1>
      <h2>{{ t('main.description') }}</h2>
    </hgroup>
    <nav>
      <ul>
        <li>
          <details
            ref="detailsRef"
            role="list"
            :title="t('board.nav.toggle_langs')"
            :open="open"
            @toggle="() => open = detailsRef?.open || false"
          >
            <summary aria-haspopup="listbox" role="button">
              <IconLanguage />
            </summary>
            <ul role="group" :class="$style.dropdown" :aria-label="t('board.nav.toggle_langs')">
              <li v-for="lang in availableLocales" :key="lang" role="listitem" :aria-label="lang">
                <a
                  href="#"
                  :class="{ [$style['dropdown--active']]: locale === lang }"
                  @click.prevent="setLocale(lang)"
                  v-text="lang"
                />
              </li>
            </ul>
          </details>
        </li>

        <li>
          <Button :title="t('board.nav.toggle_dark')" @click="toggleDark()">
            <IconSun v-if="isDark" />
            <IconMoon v-else />
          </Button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" module>
.header {
  --block-spacing-vertical: 0!important;
  --nav-element-spacing-vertical: .5rem;
  display: flex;
  justify-content: space-between;
}

.heading {
  overflow: hidden;
  max-height: 2.25rem;
  margin: var(--nav-element-spacing-vertical) 0;
  transition: max-height .3s ease-out;

  @media (min-width: 1024px) {
    max-height: 120px;
  }
}

.title {
  display: block;
  font-size: 1.5rem;
  color: var(--h2-color);

  @media (min-width: 1024px) {
    font-size: var(--font-size);
  }
}

.favicon {
  @media (min-width: 768px) {
    margin-right: .5rem;
  }
}

.dropdown {
  max-height: 200px;
  overflow: auto;

  &--active {
    --dropdown-color: var(--primary-link);
  }
}
</style>

<script setup lang="ts">
import IconSun from '~icons/carbon/sun'
import IconMoon from '~icons/carbon/moon'
import IconLanguage from '~icons/carbon/language'

const { t, availableLocales, locale } = useI18n()
const detailsRef = ref<HTMLDetailsElement>()
const open = ref(false)

const setLocale = (value: string) => {
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
      <h2>{{ t('main.title') }}</h2>
      <h3>{{ t('main.description') }}</h3>
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
            <summary aria-haspopup="listbox" role="link">
              <IconLanguage />
            </summary>
            <ul role="listbox" :class="$style.dropdown">
              <li v-for="lang in availableLocales" :key="lang">
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
          <button type="button" role="button" :title="t('board.nav.toggle_dark')" @click="toggleDark()">
            <IconSun v-if="isDark" />
            <IconMoon v-else />
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" module>
.header {
  --block-spacing-vertical: 0!important;
  display: flex;
  justify-content: space-between;
}

.heading {
  overflow: hidden;
  max-height: 45px;
  margin: 10px 0;
  transition: max-height .3s ease-out;

  @media (min-height: 720px) {
    max-height: 120px;
  }
}

.dropdown {
  max-height: 200px;
  overflow: auto;

  &--active {
    --dropdown-color: var(--color);
  }
}
</style>


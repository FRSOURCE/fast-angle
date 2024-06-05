<script setup lang="ts">
import { basePath } from '~/composables/basePath';
import { favicon } from '~/composables/favicon';
import { isDark, toggleDark } from '~/composables/dark';
import IconSun from '~icons/carbon/sun';
import IconMoon from '~icons/carbon/moon';
import IconLanguage from '~icons/carbon/language';

const { t, availableLocales, locale } = useI18n();

const localeModel = computed({
  get() {
    return locale.value;
  },
  set(value) {
    locale.value = value;
  },
});
</script>

<template>
  <header :class="$style.header">
    <hgroup :class="$style.heading">
      <h1>
        <a :href="basePath" :class="$style.title">
          <img
            :src="favicon"
            :class="$style.favicon"
            alt="Fast Angle logo"
            width="32"
            height="32"
          />
          {{ t('main.title') }}
        </a>
      </h1>
      <h2>{{ t('main.description') }}</h2>
    </hgroup>
    <nav>
      <ul>
        <li>
          <form @submit.prevent :class="$style.lang">
            <IconLanguage
              :class="$style['lang-icon']"
              :aria-label="t('board.nav.toggle_langs')"
            />
            <select
              :class="$style['lang-select']"
              v-model="localeModel"
              :title="t('board.nav.toggle_langs')"
              :aria-label="t('board.nav.toggle_langs')"
            >
              <option
                v-for="lang in availableLocales"
                :key="lang"
                v-text="lang"
              />
            </select>
          </form>
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
  --block-spacing-vertical: 0 !important;
  --nav-element-spacing-vertical: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 1024px) {
    margin: var(--nav-element-spacing-vertical) 0;
  }
}

.heading {
  overflow: hidden;
  max-height: 2.25rem;
  margin: 0;
  transition: max-height 0.3s ease-out;

  @media (min-width: 1024px) {
    margin-bottom: calc(var(--nav-element-spacing-vertical) / 2);
    max-height: 120px;
  }
}

.title {
  vertical-align: middle;
  font-size: 1.5rem;
  color: var(--h2-color);
  --underline: rgba(255 255 255 / 0%);

  @media (min-width: 1024px) {
    display: block;
    font-size: var(--font-size);
    margin-bottom: 0.5rem;
  }
}

.favicon {
  @media (min-width: 768px) {
    margin-right: 0.5rem;
  }
}

.lang {
  position: relative;

  &-icon {
    position: absolute;
    top: 50%;
    left: 0.5rem;
    transform: translateY(-50%);
  }

  &-select {
    width: 0;
    padding-left: 1.5rem !important;
    --nav-link-spacing-vertical: 0.35rem;
  }
}
</style>

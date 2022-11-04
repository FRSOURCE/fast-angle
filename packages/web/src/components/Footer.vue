<script setup lang="ts">
import { locale } from '~/composables/locale'
import IconLogoGithub from '~icons/carbon/logo-github'

const { t } = useI18n()
</script>

<template>
  <footer :class="$style.footer">
    <nav :class="$style.nav">
      <ul>
        <li><strong :class="$style['font-small']">{{ t('main.brought_to_you_by') }} <a href="https://www.frsource.org/" :data-tooltip="t('main.visit_our_website')" :title="t('main.visit_our_website')">FRSOURCE</a></strong></li>
      </ul>
      <ul>
        <li :class="$style.links">
          <RouterLink :to="{ name: 'lang-terms', params: { lang: locale } }">
            <small :class="$style['font-small']">Terms and Conditions</small>
          </RouterLink>
          <RouterLink :to="{ name: 'lang-privacy-policy', params: { lang: locale } }">
            <small :class="$style['font-small']">Privacy Policy</small>
          </RouterLink>
        </li>
        <li>
          <a
            rel="noreferrer"
            href="https://github.com/FRSOURCE/fast-angle"
            :aria-label="t('main.star_us_on_github')"
            :data-tooltip="t('main.star_us_on_github')"
            data-placement="left"
            target="_blank"
            title="GitHub"
          >
            <IconLogoGithub />
          </a>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<style lang="scss" module>
.footer {
  --block-spacing-vertical: 0!important;
}

.nav {
  --nav-element-spacing-vertical: 0.25rem;

  @media (min-width: 768px) {
  --nav-element-spacing-vertical: 1rem;
  }
}

.links {
  margin-inline-end: .5rem;
  display: flex;
  flex-flow: column;
  width: max-content;
  text-align: right;

  &::before {
    display: none;
  }

  @media (min-width: 768px) {
    flex-flow: row;
    gap: 1rem;
  }
}

.font-small {
  font-size: 0.75em;
}
</style>

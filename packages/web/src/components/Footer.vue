<script setup lang="ts">
import { locale } from '~/composables/locale';
import IconLogoGithub from '~icons/carbon/logo-github';

const { t } = useI18n();
</script>

<template>
  <footer>
    <nav :class="$style.nav">
      <ul>
        <li>
          <strong :class="$style['font-small']"
            >{{ t('main.brought_to_you_by') }}
            <a
              :href="`${host}/`"
              :data-tooltip="t('main.visit_our_website')"
              :title="t('main.visit_our_website')"
              >FRSOURCE</a
            ></strong
          >
        </li>
      </ul>
      <ul :class="$style['right-col']">
        <li :class="$style.links">
          <RouterLink :to="{ name: `lang-${locale}-terms` }">
            <small
              :class="$style['font-small']"
              v-text="t('main.terms_and_conditions')"
            />
          </RouterLink>
          <RouterLink :to="{ name: `lang-${locale}-privacy-policy` }">
            <small
              :class="$style['font-small']"
              v-text="t('main.privacy_policy')"
            />
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
.nav {
  align-items: flex-start;
  --nav-element-spacing-vertical: 0.25rem;

  @media (min-width: 768px) {
    --nav-element-spacing-vertical: 1rem;
  }
}

.right-col {
  margin-right: 0 !important;
}

.links {
  margin-inline-end: 0.5rem;
  display: flex;
  flex-flow: column;
  width: max-content;
  text-align: right;

  &::before {
    display: none;
  }

  @media (min-width: 640px) {
    flex-flow: row;
    gap: 1rem;
  }
}

.font-small {
  font-size: 0.75em;
}
</style>

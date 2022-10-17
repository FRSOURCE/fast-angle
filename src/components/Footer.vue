<script setup lang="ts">
import IconLogoGithub from '~icons/carbon/logo-github'

const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <nav>
      <ul>
        <li><strong class="font-small">{{ t('main.brought_to_you_by') }} <a href="https://www.frsource.org/" :data-tooltip="t('main.visit_our_website')" :title="t('main.visit_our_website')">FRSOURCE</a></strong></li>
      </ul>
      <ul>
        <li>
          <a
            rel="noreferrer"
            href="https://github.com/FRSOURCE/fast-angle"
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

<style lang="scss">
.footer {
  --block-spacing-vertical: 0!important;
}

.font-small {
  font-size: 0.75em;
}
</style>

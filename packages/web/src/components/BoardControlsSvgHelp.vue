<script lang="ts" setup>
import type { MessageFunction, VueMessageType } from 'vue-i18n'
import IconHelp from '~icons/carbon/help'
import { locale } from '~/composables/locale'
import IconLogoGithub from '~icons/carbon/logo-github'
import FavoriteFilled from '~icons/carbon/favorite-filled'

const { t, tm, rt } = useI18n()
const isModalOpen = ref(false)
const content = computed(() => tm('board.nav.help.content') as MessageFunction<VueMessageType>[])
</script>

<template>
  <li>
    <Button
      :tooltip="t('board.nav.help.action')"
      tooltip-placement="left"
      @click="isModalOpen = true"
      @touchstart.prevent.stop.capture="isModalOpen = true"
    >
      <IconHelp />
      <Modal
        v-model="isModalOpen"
        :heading="t('board.nav.help.heading')"
        :class="$style.modal"
      >
        <ul>
          <li v-for="helpItem in content" :key="rt(helpItem)">
            {{ rt(helpItem) }}
          </li>
        </ul>

        <hr>

        <div :class="$style['hide-mobile']">
          <h4 v-text="t('board.nav.help.key_bindings.heading')" />
          <table rol="grid">
            <thead>
              <tr>
                <th scope="col" v-text="'Win'" />
                <th scope="col" v-text="'Mac'" />
                <th scope="col" v-text="t('board.nav.help.key_bindings.description')" />
              </tr>
            </thead>
            <tr>
              <td scope="col" :class="$style['binding-item-wrapper']">
                <div :class="$style['binding-item']">
                  <kbd>ctrl</kbd><small :class="$style['binding-item-plus']">+</small><kbd>z</kbd>
                </div>
              </td>
              <td scope="col" :class="$style['binding-item-wrapper']">
                <div :class="$style['binding-item']">
                  <kbd>⌘</kbd><small :class="$style['binding-item-plus']">+</small><kbd>z</kbd>
                </div>
              </td>
              <td scope="col" v-text="t('board.nav.undo')" />
            </tr>
            <tr>
              <td scope="col" :class="$style['binding-item-wrapper']">
                <div :class="$style['binding-item']">
                  <kbd>ctrl</kbd><small :class="$style['binding-item-plus']">+</small><kbd>shift</kbd><small :class="$style['binding-item-plus']">+</small><kbd>z</kbd>
                </div>
              </td>
              <td scope="col" :class="$style['binding-item-wrapper']">
                <div :class="$style['binding-item']">
                  <kbd>⌘</kbd><small :class="$style['binding-item-plus']">+</small><kbd>shift</kbd><small :class="$style['binding-item-plus']">+</small><kbd>z</kbd>
                </div>
              </td>
              <td scope="col" v-text="t('board.nav.download_image.action')" />
            </tr>
            <tr>
              <td scope="col" :class="$style['binding-item-wrapper']">
                <div :class="$style['binding-item']">
                  <kbd>ctrl</kbd><small :class="$style['binding-item-plus']">+</small><kbd>s</kbd>
                </div>
              </td>
              <td scope="col" :class="$style['binding-item-wrapper']">
                <div :class="$style['binding-item']">
                  <kbd>⌘</kbd><small :class="$style['binding-item-plus']">+</small><kbd>s</kbd>
                </div>
              </td>
              <td scope="col" v-text="t('board.nav.redo')" />
            </tr>
            <tr>
              <td scope="col" :class="$style['binding-item-wrapper']">
                <div :class="$style['binding-item']">
                  <kbd>f</kbd>
                </div>
              </td>
              <td scope="col" :class="$style['binding-item-wrapper']">
                <div :class="$style['binding-item']">
                  <kbd>f</kbd>
                </div>
              </td>
              <td scope="col" v-text="t('board.nav.toggle_fullscreen')" />
            </tr>
          </table>
        </div>

        <h4 v-text="t('board.nav.help.heading_authors')" />
        <p>
          {{ t('main.brought_to_you_by') }} <a :href="`${host}/`" :data-tooltip="t('main.visit_our_website')" :title="t('main.visit_our_website')">FRSOURCE</a>
        </p>
        <p>
          <a
            rel="noreferrer"
            href="https://github.com/FRSOURCE/fast-angle"
            target="_blank"
            title="GitHub"
          >
            <IconLogoGithub />
            {{ t('main.star_us_on_github') }}
          </a>
        </p>
        <p>
          <a
            rel="noreferrer"
            href="https://www.frsource.org/blog/sponsoring"
            target="_blank"
            title="Sponsoring"
          >
            <FavoriteFilled />
            {{ t('main.donate_us') }}
          </a>
        </p>

        <hr>

        <p :class="$style.terms">
          <RouterLink :to="{ name: `lang-${locale}-terms` }">
            <small v-text="t('main.terms_and_conditions')" />
          </RouterLink>
          <RouterLink :to="{ name: `lang-${locale}-privacy-policy` }">
            <small v-text="t('main.privacy_policy')" />
          </RouterLink>
        </p>
        <template #footer-pre>
          <a
            rel="noreferrer"
            href="https://github.com/FRSOURCE/fast-angle"
            target="_blank"
            title="GitHub"
            :class="$style.donate"
          >
            <FavoriteFilled />
            <small>{{ t('main.donate_us') }}</small>
          </a>
        </template>
      </Modal>
    </Button>
  </li>
</template>

<style lang="scss" module>
.modal {
  min-width: 94%;

  @media (min-width: 768px){
    min-width: 720px;
  }
}

.hide-mobile {
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
}

.binding-item {
  display: inline-flex;
  flex-wrap: wrap;
  gap: .25em;
}

.binding-item-plus {
  font-size: .75em;
  line-height: 2.5em;
}

.list-item {
  list-style: none;
}

.terms {
  display: flex;
  gap: 2rem;
}

.donate {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 2em;
  gap: .5em;
}
</style>

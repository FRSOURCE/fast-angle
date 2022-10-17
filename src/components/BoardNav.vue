<script lang="ts" setup>
import type { PropType } from 'vue'
import type { MaybeElement } from '@vueuse/core'
import IconMaximize from '~icons/carbon/maximize'
import IconMinimize from '~icons/carbon/minimize'
import IconUpload from '~icons/carbon/cloud-upload'
import IconHelp from '~icons/carbon/help'
import IconAngle from '~icons/carbon/angle'
import IconUndo from '~icons/carbon/undo'
import IconRedo from '~icons/carbon/redo'
import IconAngleConcave from '~icons/custom/angle-concave'

const props = defineProps({
  boardRef: {
    type: Object as PropType<MaybeElement>,
    default: undefined,
  },
  info: {
    type: Array as PropType<(string | { value: number; type: 'convex' | 'concave' })[]>,
    required: true,
  },
  canUndo: {
    type: Boolean,
    default: false,
  },
  canRedo: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'update:files', src: File[]): void
  (e: 'undo'): void
  (e: 'redo'): void
}>()

const { t } = useI18n()
const smallMobile = breakpoints.smaller('xs')
const { toggle, isFullscreen, isSupported } = useFullscreen(toRef(props, 'boardRef'))
const { files, open } = useFileDialog({ multiple: false, accept: 'image/*', capture: 'environment' })

whenever(files, (files) => {
  emit('update:files', Array.from(files))
})

onKeyStroke('F', toggle)
</script>

<template>
  <nav class="pointer-none" :class="$style.nav">
    <ul :class="[$style.relative, $style.info]">
      <template v-for="text in info">
        <li v-if="typeof text === 'string'" :key="text" :class="$style.relative">
          <span>{{ text }}</span>
        </li>
        <li v-else-if="text.type === 'convex'" :key="`convex|${text.value}`" :class="$style.relative">
          <span><IconAngle /> {{ text.value }}</span>
        </li>
        <li v-else :key="`concave|${text.value}`" :class="$style.relative">
          <span><IconAngleConcave /> {{ text.value }}</span>
        </li>
      </template>
    </ul>
    <ul class="pointer-all" :class="$style.nav__btns">
      <li>
        <a
          href="#"
          :data-tooltip="t('board.nav.help')"
          :class="$style['cursor-help']"
          :data-placement="smallMobile ? 'top' : 'left'"
        >
          <IconHelp />
        </a>
      </li>
      <li>
        <button
          role="button"
          type="button"
          :disabled="!canUndo"
          :data-tooltip="`${t('board.nav.undo')} [ctrl + z]`"
          data-placement="left"
          @click="$emit('undo')"
        >
          <IconUndo />
        </button>
      </li>
      <li>
        <button
          role="button"
          type="button"
          :disabled="!canRedo"
          :data-tooltip="`${t('board.nav.redo')} [ctrl + shift + z]`"
          data-placement="left"
          @click="$emit('redo')"
        >
          <IconRedo />
        </button>
      </li>
      <li>
        <button
          role="button"
          type="button"
          :data-tooltip="t('board.nav.upload_file')"
          data-placement="left"
          @click="open()"
        >
          <IconUpload />
        </button>
      </li>
      <li v-if="isSupported">
        <button
          role="button"
          type="button"
          :data-tooltip="`${t('board.nav.toggle_fullscreen')} [F]`"
          data-placement="left"
          @click="toggle"
        >
          <IconMinimize v-if="isFullscreen" />
          <IconMaximize v-else />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" module>
.relative {
  position: relative;
}

.info::before {
  content: '';
  position: absolute;
  inset: 20% 0;
  background: var(--background-color);
  display: block;
  opacity: .8;
  mix-blend-mode: luminosity;
}

.cursor-help {
  cursor: help;
}

.nav {
  align-items: flex-end;

  &__btns {
    margin-left: auto;
    flex-flow: column;
    --nav-element-spacing-vertical: var(--nav-element-spacing-horizontal);

    @media (min-width: 768px) {
      flex-flow: row;
    }
  }
}
</style>

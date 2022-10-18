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
    type: Array as PropType<string[]>,
    required: true,
  },
})

const { t } = useI18n()

const { lines } = useLines()
const angle = useAngle(lines)

const { toggle, isFullscreen, isSupported } = useFullscreen(toRef(props, 'boardRef'))
const { undo, redo, canUndo, canRedo } = useLines()
const { processFiles } = useBoardImage()
const { files, open } = useFileDialog({ multiple: false, accept: 'image/*' })

whenever(files, (files) => {
  processFiles(Array.from(files))
})

onKeyStroke('f', toggle)
</script>

<template>
  <div :class="$style.bar" class="pointer-none">
    <div :class="[$style.relative, $style['result-box']]">
      <template v-if="angle">
        <small :class="$style['mr-2']"><IconAngle :class="$style.success" /> {{ angle.toFixed(3) }}&deg;</small>
        <small><IconAngleConcave :class="$style.delete" /> {{ (180 - angle).toFixed(3) }}&deg;</small>
      </template>
      <BoardResult :class="$style.result" :board-ref="boardRef" />
    </div>
    <li v-for="text in info" :key="text" :class="$style.relative">
      <span>{{ text }}</span>
    </li>
    <nav :class="$style.nav">
      <ul class="pointer-all" :class="$style.nav__btns">
        <li>
          <a
            href="#"
            :data-tooltip="t('board.nav.help')"
            :class="$style['cursor-help']"
            data-placement="left"
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
            @click="undo"
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
            @click="redo"
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
  </div>
</template>

<style lang="scss" module>
.info::before {
  content: '';
  position: absolute;
  inset: 20% 0;
  background: var(--background-color);
  display: block;
  opacity: .8;
  mix-blend-mode: luminosity;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
}

.nav {
  &__btns {
    margin-left: auto;
    flex-flow: column;
    --nav-element-spacing-vertical: var(--nav-element-spacing-horizontal);

    @media (min-width: 768px) {
      flex-flow: row;
    }
  }
}

.result-box {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

.result {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  max-height: 30vh
}

.success {
  color: var(--ins-color);
  stroke: var(--ins-color);
}

.delete {
  color: var(--del-color);
  stroke: var(--del-color);
}

.cursor-help {
  cursor: help;
}

.relative {
  position: relative;
}

.mr-2 {
  margin-right: var(--spacing);
}
</style>

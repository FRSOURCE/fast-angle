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
import IconAngleObtuse from '~icons/custom/angle-obtuse'

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

const { toggle, isFullscreen, isSupported: isFullscreenSupported } = useFullscreen(toRef(props, 'boardRef'))
const { undo, redo, canUndo, canRedo } = useLines()
// eslint-disable-next-line vue/no-irregular-whitespace, no-irregular-whitespace
const undoTooltip = computed(() => `${t('board.nav.undo')} [ctrl + z][⌘ + z]`)
// eslint-disable-next-line vue/no-irregular-whitespace, no-irregular-whitespace
const redoTooltip = computed(() => `${t('board.nav.redo')} [ctrl + shift + z][⌘ + z]`)
const acuteAngle = ref<number>()
watch(angle, (angle) => {
  if (angle === undefined)
    return acuteAngle.value = undefined
  return acuteAngle.value = angle > 90 ? 180 - angle : angle
})
const obtuseAngle = computed(() => acuteAngle.value ? 180 - acuteAngle.value : undefined)

const { processFiles } = useBoardImage()
const { files, open } = useFileDialog({ multiple: false, accept: 'image/*' })
whenever(files, (files) => {
  processFiles(Array.from(files))
})

onKeyStroke('f', toggle)
</script>

<template>
  <div :class="$style.bar" class="pointer-none">
    <div
      class="pointer-all bg-bg-transparent-inverse text-inverse whitespace-nowrap"
      :class="$style['info-box']"
      @mousemove.prevent.stop
    >
      <BoardSummaryItem :value="acuteAngle">
        <IconAngle />
      </BoardSummaryItem>
      <BoardSummaryItem :value="obtuseAngle">
        <IconAngleObtuse />
      </BoardSummaryItem>
    </div>
    <li
      v-for="text in info"
      :key="text"
      class="bg-bg-transparent-inverse text-inverse min-w-0"
      :class="$style['info-box']"
    >
      <small>{{ text }}</small>
    </li>
    <nav :class="$style.nav">
      <ul class="pointer-all" :class="$style.nav__btns">
        <li>
          <button
            role="button"
            type="button"
            :aria-label="t('board.nav.help')"
            :data-tooltip="t('board.nav.help')"
            class="bg-bg-transparent-inverse b-bg-transparent-inverse text-inverse cursor-help"
            data-placement="left"
          >
            <IconHelp />
          </button>
        </li>
        <li>
          <button
            role="button"
            type="button"
            :disabled="!canUndo"
            :aria-label="undoTooltip"
            :data-tooltip="undoTooltip"
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
            :aria-label="redoTooltip"
            :data-tooltip="redoTooltip"
            data-placement="left"
            @click="redo"
          >
            <IconRedo />
          </button>
        </li>
        <BoardControlsSvgDownload :disabled="canUndo" />
        <li>
          <button
            role="button"
            type="button"
            :aria-label="t('board.nav.upload_file')"
            :data-tooltip="t('board.nav.upload_file')"
            data-placement="left"
            @click="open()"
          >
            <IconUpload />
          </button>
        </li>
        <li v-if="isFullscreenSupported">
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
.bar {
  display: flex;
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

.info-box {
  display: flex;
  flex-flow: column;
  gap: .5rem;
  align-items: center;
  margin: var(--nav-element-spacing-horizontal);
  margin-left: 0;
  padding: var(--nav-link-spacing-vertical) var(--nav-link-spacing-horizontal);
  border-radius: 4.5px;
}
</style>

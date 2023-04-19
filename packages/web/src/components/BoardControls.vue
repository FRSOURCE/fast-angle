<script lang="ts" setup>
import type { PropType } from 'vue'
import IconMaximize from '~icons/carbon/maximize'
import IconMinimize from '~icons/carbon/minimize'
import IconZoomIn from '~icons/carbon/zoom-in'
import IconZoomOut from '~icons/carbon/zoom-out'
import IconImageReference from '~icons/carbon/image-reference'
import IconAngle from '~icons/carbon/angle'
import IconUndo from '~icons/carbon/undo'
import IconRedo from '~icons/carbon/redo'
import IconAngleObtuse from '~icons/custom/angle-obtuse'

defineProps({
  info: {
    type: Array as PropType<string[]>,
    required: true,
  },
})

const { t } = useI18n()
const { lines } = useLines()
const angle = useAngle(lines)
const { zoom, transformOrigin } = useBoardSvgPanzoom()
const boardRef = useBoardRef()
const boardSvgRef = useBoardSvgRef()
const boardSvgViewBox = computed(() => {
  const board = unrefElement(boardSvgRef)
  if (!board)
    return { x: 0, y: 0, width: 0, height: 0 }
  return board.viewBox.baseVal
})
const updateZoomOrigin = () => {
  transformOrigin.value = [
    (boardSvgViewBox.value.width / 2 - (boardSvgViewBox.value.x + boardSvgViewBox.value.width / 2) / 2) * zoom.value,
    (boardSvgViewBox.value.height / 2 - (boardSvgViewBox.value.y + boardSvgViewBox.value.height / 2) / 2) * zoom.value,
  ]
}

const zoomIn = () => {
  updateZoomOrigin()
  zoom.value += 0.1
}
const zoomOut = () => {
  updateZoomOrigin()
  zoom.value -= 0.1
}

const { toggle, isFullscreen, isSupported: isFullscreenSupported } = useFullscreen(boardRef)
const { undo, redo, canUndo, canRedo } = useLines()
// eslint-disable-next-line vue/no-irregular-whitespace, no-irregular-whitespace
const undoTooltip = computed(() => `${t('board.nav.undo')} [ctrl + z][⌘ + z]`)
// eslint-disable-next-line vue/no-irregular-whitespace, no-irregular-whitespace
const redoTooltip = computed(() => `${t('board.nav.redo')} [ctrl + shift + z][⌘ + shift + z]`)
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
      @mousemove.prevent.stop.capture
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
        <BoardControlsSvgHelp />
        <li>
          <Button
            :disabled="!canUndo"
            :tooltip="undoTooltip"
            tooltip-placement="left"
            @click="undo"
            @touchstart.prevent.stop.capture="undo"
          >
            <IconUndo />
          </Button>
        </li>
        <li>
          <Button
            :disabled="!canRedo"
            :tooltip="redoTooltip"
            tooltip-placement="left"
            @click="redo"
            @touchstart.prevent.stop.capture="redo"
          >
            <IconRedo />
          </Button>
        </li>
        <BoardControlsSvgDownload :disabled="canUndo" />
        <li>
          <Button
            :tooltip="t('board.nav.upload_file')"
            tooltip-placement="left"
            @click="open()"
            @touchstart.prevent.stop.capture="open()"
          >
            <IconImageReference />
          </Button>
        </li>
        <li class="d-none md-d-inline-block">
          <Button
            :disabled="!canUndo"
            :tooltip="`${t('board.result.zoom_out')} [-]`"
            tooltip-placement="left"
            @click="zoomOut()"
            @touchstart.prevent.stop.capture="zoomOut()"
          >
            <IconZoomOut />
          </Button>
        </li>
        <li class="d-none md-d-inline-block">
          <Button
            :disabled="!canUndo"
            :tooltip="`${t('board.result.zoom_in')} [+]`"
            tooltip-placement="left"
            @click="zoomIn()"
            @touchstart.prevent.stop.capture="zoomIn()"
          >
            <IconZoomIn />
          </Button>
        </li>
        <li v-if="isFullscreenSupported">
          <Button
            :tooltip="`${t('board.nav.toggle_fullscreen')} [f]`"
            tooltip-placement="left"
            @click="toggle"
            @touchstart.prevent.stop.capture="toggle"
          >
            <IconMinimize v-if="isFullscreen" />
            <IconMaximize v-else />
          </Button>
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

<script lang="ts" setup>
import IconZoomInArea from '~icons/carbon/zoom-in-area'
import IconZoomOutArea from '~icons/carbon/zoom-out-area'
import { OVERFLOW_LABELS_DIRECTION } from '~/composables/useOutOfBoundLabels'

const { t } = useI18n()
const isOpen = ref(false)

function close() {
  if (isOpen.value)
    isOpen.value = false
}

const el = ref<HTMLElement>()
onClickOutside(el, close)
onKeyStroke('Escape', close)

const { height: elementHeight, width: elementWidth } = useElementSize(useBoardRef())
const svgSize = computed(() => ({
  width: 300,
  height: 300 * elementHeight.value / elementWidth.value,
}))

const { outOfBoundLabels } = useOutOfBoundLabels()
const resultSizing = computed(() => {
  const size = isOpen.value ? 260 : 50
  return { width: size, height: size }
})
const bounding = computed(() => ({
  minY: resultSizing.value.height,
  maxY: elementHeight.value - resultSizing.value.height,
  minX: resultSizing.value.width,
  maxX: elementWidth.value - resultSizing.value.width,
}))
const positionStyling = computed(() => {
  const { minX, maxX, minY, maxY } = bounding.value
  const normalizeVerticalPosition = (y: number) => y > maxY ? maxY : y < minY ? minY : y
  const normalizeHorizontalPosition = (x: number) => x > maxX ? maxX : x < minX ? minX : x

  if (!outOfBoundLabels.value)
    return

  const sizeStyling = { height: `${resultSizing.value.height}px`, width: `${resultSizing.value.width}px` }
  switch (outOfBoundLabels.value.direction) {
    case OVERFLOW_LABELS_DIRECTION.DOWN:
      return { ...sizeStyling, bottom: '1rem', left: `${normalizeHorizontalPosition(outOfBoundLabels.value.x)}px`, transform: 'translateX(-50%)' }
    case OVERFLOW_LABELS_DIRECTION.UP:
      return { ...sizeStyling, top: '1rem', left: `${normalizeHorizontalPosition(outOfBoundLabels.value.x)}px`, transform: 'translateX(-50%)' }
    case OVERFLOW_LABELS_DIRECTION.LEFT:
      return { ...sizeStyling, top: `${normalizeVerticalPosition(outOfBoundLabels.value.y)}px`, left: '1rem', transform: 'translateY(-50%)' }
    case OVERFLOW_LABELS_DIRECTION.RIGHT:
      return { ...sizeStyling, top: `${normalizeVerticalPosition(outOfBoundLabels.value.y)}px`, right: '1rem', transform: 'translateY(-50%)' }
  }
})

const { lines } = useLines()
const angle = useAngle(lines)
const segment1 = computed(() => lines.value[0] || [])
const segment2 = computed(() => lines.value[1] || [])
const line1Variables = useLinearFnVariables(segment1)
const line2Variables = useLinearFnVariables(segment2)
const intersectionOffset = useLinesIntersectionPosition(line1Variables, line2Variables)
const anglesBisectors = useAnglesBisectors(angle, intersectionOffset, line1Variables, line2Variables)
const labels = useAnglesLabels(angle, intersectionOffset, anglesBisectors)
const lineXCoords = computed(() => intersectionOffset.value && ({
  x1: intersectionOffset.value.x - svgSize.value.width,
  x2: intersectionOffset.value.x + svgSize.value.width,
}))
const line1 = useLine(line1Variables, lineXCoords)
const line2 = useLine(line2Variables, lineXCoords)

const color1 = useColor(segment1)
const color2 = useColor(segment2)

const tooltipDirectionsMap = {
  [OVERFLOW_LABELS_DIRECTION.UP]: 'bottom',
  [OVERFLOW_LABELS_DIRECTION.DOWN]: undefined,
  [OVERFLOW_LABELS_DIRECTION.LEFT]: 'right',
  [OVERFLOW_LABELS_DIRECTION.RIGHT]: 'left',
} as const
</script>

<template>
  <section
    v-if="line1Variables && line2Variables && intersectionOffset && outOfBoundLabels"
    ref="el"
    class="bg-bg-transparent-inverse text-inverse"
    :class="[
      $style.result,
      { [$style['result--open']]: isOpen },
    ]"
    :style="positionStyling"
    @mousemove.prevent.stop
    @click="isOpen = !isOpen"
  >
    <Button :class="$style.btn" :tooltip="isOpen ? t('board.result.zoom_out') : t('board.result.zoom_in')" :tooltip-placement="isOpen ? 'left' : tooltipDirectionsMap[outOfBoundLabels.direction]">
      <component :is="isOpen ? IconZoomOutArea : IconZoomInArea" />
    </Button>

    <svg
      :viewBox="`${svgSize.width * .1} ${svgSize.height * .1} ${svgSize.width * .8} ${svgSize.height * .8}`"
      :class="$style.svg"
    >
      <g :transform="`translate(${-intersectionOffset.x + svgSize.width * .5} ${-intersectionOffset.y + svgSize.height * .5})`">
        <Line v-if="line1" stroke-width="4" stroke-linecap="round" v-bind="$attrs" :stroke="color1" :path-width="4" :points="line1" stroke-dasharray="5 10" filter="saturate(2.5)" />
        <Line v-if="line2" stroke-width="4" stroke-linecap="round" v-bind="$attrs" :stroke="color2" :path-width="4" :points="line2" stroke-dasharray="5 10" filter="saturate(2.5)" />
        <text v-for="label in labels" :key="`${label.x}|${label.y}`" :x="label.x" :y="label.y" text-anchor="middle" dominant-baseline="middle" stroke="transparent">{{ label.value.toFixed(3) }}&deg;</text>
      </g>
    </svg>
  </section>
</template>

<style lang="scss" module>
.result {
  position: absolute;
  z-index: 1;
  border-radius: .25rem;
  box-sizing: content-box;
  margin: 0;
  padding: 0;
  transition: height .4s ease-in-out, width .4s ease-in-out, top .2s ease-in-out, left .2s ease-in-out, bottom .2s ease-in-out, right .2s ease-in-out;

  &:not(.result--open){
    &:hover .svg {
      opacity: .2;
    }

    .btn {
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      border-color: transparent;
      color: inherit;
    }
  }
}

.btn {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  align-items: center;
  justify-content: center;

  transition: none;
}

.result--open {

  .svg {
    opacity: 1;
  }

  .btn {
    margin: .5rem;
    padding: .5rem;
    width: auto;
  }
}

.svg {
  height: 100%;
  width: 100%;
  opacity: .5;
  transition: opacity .2s ease-in-out;
}
</style>

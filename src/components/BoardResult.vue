<script lang="ts" setup>
import type { MaybeElement } from '@vueuse/core'
import type { PropType } from 'vue'
import { getAngle } from '~/composables/useAngle'
import type { Lines, Point } from '~/composables/useLines'

const props = defineProps({
  boardRef: {
    type: Object as PropType<MaybeElement>,
    default: undefined,
  },
})
const { lines } = useLines()
const angle = useAngle(lines)
const svgRef = ref<SVGElement>()
const { height: elementHeight, width: elementWidth } = useElementSize(toRef(props, 'boardRef'))
const svgSize = computed(() => ({
  width: 300, height: 300 * elementHeight.value / elementWidth.value,
}))
const segment1 = computed(() => lines.value[0] || [])
const segment2 = computed(() => lines.value[1] || [])
const line1Variables = useLinearFnVariables(segment1)
const line2Variables = useLinearFnVariables(segment2)
const interceptionOffset = computed(() => {
  if (!line1Variables.value || !line2Variables.value || !svgSize.value)
    return

  const { slope: slope1, intercept: intercept1 } = line1Variables.value
  const { slope: slope2, intercept: intercept2 } = line2Variables.value

  let x: number
  if (slope1 === slope2)
    x = intercept2 - intercept1
  else
    x = (intercept1 - intercept2) / (slope2 - slope1)

  return { x, y: slope1 * x + intercept1 }
})
const line1 = computed(() => {
  if (!interceptionOffset.value || !line1Variables.value)
    return

  const { slope, intercept } = line1Variables.value
  const x1 = interceptionOffset.value.x - svgSize.value.width
  const x2 = interceptionOffset.value.x + svgSize.value.width

  const calculatePoint = (x: number) => slope * x + intercept

  return [[x1, calculatePoint(x1)], [x2, calculatePoint(x2)]] as [Point, Point]
})
const line2 = computed(() => {
  if (!interceptionOffset.value || !line2Variables.value)
    return

  const { slope, intercept } = line2Variables.value
  const x1 = interceptionOffset.value.x - svgSize.value.width
  const x2 = interceptionOffset.value.x + svgSize.value.width

  const calculatePoint = (x: number) => slope * x + intercept

  return [[x1, calculatePoint(x1)], [x2, calculatePoint(x2)]] as [Point, Point]
})
const labelPoses = computed(() => {
  if (!interceptionOffset.value || !line1Variables.value || !line2Variables.value || !angle.value || !interceptionOffset.value)
    return []

  const line1Vars = line1Variables.value
  const line2Vars = line2Variables.value

  let slope1 = Math.tan((Math.atan(line1Vars.slope) + Math.atan(line2Vars.slope)) / 2)
  let slope2 = -1 / slope1
  let intercept1 = line1Vars.slope * interceptionOffset.value.x + line1Vars.intercept - slope1 * interceptionOffset.value.x
  let intercept2 = line1Vars.slope * interceptionOffset.value.x + line1Vars.intercept - slope2 * interceptionOffset.value.x

  const isCorrectBisection = getAngle([
    [[0, line1Vars.intercept], [interceptionOffset.value.x, line1Vars.slope * interceptionOffset.value.x + line1Vars.intercept]],
    [[0, intercept1], [interceptionOffset.value.x, slope1 * interceptionOffset.value.x + intercept1]],
  ] as Lines) * 2 <= 90 && angle.value <= 90

  let x1 = interceptionOffset.value.x + angle.value / 90 * 25 + 10
  let x2 = (interceptionOffset.value.y - ((180 - angle.value) / 90 * 25) - 10 - intercept2) / slope2

  if (!isCorrectBisection)
    ([slope1, intercept1, x1, slope2, intercept2, x2] = [slope2, intercept2, x2, slope1, intercept1, x1])

  return [{
    x: x1,
    y: slope1 * x1 + intercept1,
    color: 'var(--ins-color)',
  }, {
    x: x2,
    y: slope2 * x2 + intercept2,
    color: 'var(--del-color)',
  }]
})
const color1 = useColor(segment1)
const color2 = useColor(segment2)
</script>

<template>
  <svg
    v-if="line1Variables && line2Variables && interceptionOffset"
    ref="svgRef"
    :viewBox="`${svgSize.width * .1} ${svgSize.height * .1} ${svgSize.width * .8} ${svgSize.height * .8}`"
    :class="$style.result"
  >
    <g :transform="`translate(${-interceptionOffset.x + svgSize.width * .5} ${-interceptionOffset.y + svgSize.height * .5})`">
      <Segment v-if="line1" stroke-width="1" v-bind="$attrs" :stroke="color1" :point-start="line1[0]" :point-stop="line1[1]" />
      <Segment v-if="line2" stroke-width="1" v-bind="$attrs" :stroke="color2" :point-start="line2[0]" :point-stop="line2[1]" />
      <circle v-for="labelPos in labelPoses" :key="JSON.stringify(labelPos)" :cx="labelPos.x" :cy="labelPos.y" r="8" :fill="labelPos.color" />
    </g>
  </svg>
</template>

<style lang="scss" module>
.result {
  background: rgba(0,0,0,.5);
  border-radius: 0.25rem;
}
</style>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { Line, Point } from '~/composables/useLines'

const props = defineProps({
  points: {
    type: Array as unknown as PropType<Line>,
    default: () => [],
  },
  pathWidth: {
    type: Number,
    default: 1,
  },
  svgSize: {
    type: Object as PropType<{ width: number; height: number }>,
    default: undefined,
  },
  svgOffset: {
    type: Object as PropType<{ x: number; y: number }>,
    default: undefined,
  },
})

const linearFnVariables = useLinearFnVariables(toRef(props, 'points'))

const color = useColor(toRef(props, 'points'))
const line = computed(() => {
  const { svgSize, svgOffset } = props
  if (!svgSize || !svgOffset || !linearFnVariables.value || (props.points[0]?.[0] === props.points[1]?.[0] && props.points[0]?.[1] === props.points[1]?.[1]))
    return

  const { slope, intercept } = linearFnVariables.value

  const x1 = svgOffset.x
  const x2 = svgSize.width + svgOffset.x

  return [[x1, slope * x1 + intercept], [x2, slope * x2 + intercept]] as [Point, Point]
})
const strokeDasharray = computed(() => `${props.pathWidth} ${2 * props.pathWidth}`)
</script>

<template>
  <template v-if="line">
    <Segment v-bind="$attrs" :stroke-width="pathWidth * 0.8" stroke="var(--background-color-transparent)" :point-start="line[0]" :point-stop="line[1]" :stroke-dasharray="strokeDasharray" stroke-linecap="round" opacity=".2" />
    <Segment :stroke-width="pathWidth * 0.4" :stroke="color" v-bind="$attrs" :point-start="line[0]" :point-stop="line[1]" :stroke-dasharray="strokeDasharray" stroke-linecap="round" />
  </template>
  <Segment v-bind="$attrs" :stroke-width="pathWidth * 1.2" stroke="var(--background-color-transparent)" :point-start="points[0]" :point-stop="points[1]" stroke-linecap="round" opacity=".3" />
  <Segment :stroke="color" v-bind="$attrs" stroke-linecap="round" :point-start="points[0]" :point-stop="points[1]" />
</template>

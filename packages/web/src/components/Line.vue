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
})

const linearFnVariables = useLinearFnVariables(toRef(props, 'points'))

const color = useColor(toRef(props, 'points'))
const line = computed(() => {
  const { svgSize } = props
  if (!svgSize || !linearFnVariables.value || (props.points[0]?.[0] === props.points[1]?.[0] && props.points[0]?.[1] === props.points[1]?.[1]))
    return

  const { slope, intercept } = linearFnVariables.value

  return [[0, intercept], [svgSize.width, slope * svgSize.width + intercept]] as [Point, Point]
})
</script>

<template>
  <template v-if="line">
    <Segment v-bind="$attrs" stroke-width="4" stroke="var(--background-color-transparent)" :point-start="line[0]" :point-stop="line[1]" stroke-dasharray="5 10" stroke-linecap="round" opacity=".2" />
    <Segment stroke-width="2" :stroke="color" v-bind="$attrs" :point-start="line[0]" :point-stop="line[1]" stroke-dasharray="5 10" stroke-linecap="round" />
  </template>
  <Segment v-bind="$attrs" :stroke-width="pathWidth + 2" stroke="var(--background-color-transparent)" :point-start="points[0]" :point-stop="points[1]" stroke-linecap="round" opacity=".3" />
  <Segment :stroke="color" v-bind="$attrs" stroke-linecap="round" :point-start="points[0]" :point-stop="points[1]" />
</template>

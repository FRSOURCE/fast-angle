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
  centerX: {
    type: Number,
    default: undefined,
  },
})

const linearFnVariables = useLinearFnVariables(toRef(props, 'points'))

const color = useColor(toRef(props, 'points'))
const line = computed(() => {
  const { svgSize } = props
  if (!svgSize || !linearFnVariables.value)
    return

  const { slope, intercept } = linearFnVariables.value

  if (!slope || !intercept)
    return

  const calculatePoint = (x: number) => slope * x + intercept

  if (props.centerX) {
    const x1 = props.centerX - svgSize.width
    const x2 = props.centerX + svgSize.width

    return [[x1, calculatePoint(x1)], [x2, calculatePoint(x2)]] as [Point, Point]
  }
  else {
    return [[0, intercept], [svgSize.width, slope * svgSize.width + intercept]] as [Point, Point]
  }
})
</script>

<template>
  <Segment v-if="!centerX" v-bind="$attrs" :stroke="color" :point-start="points[0]" :point-stop="points[1]" />
  <Segment v-if="line" stroke-width="1" v-bind="$attrs" :stroke="color" :point-start="line[0]" :point-stop="line[1]" stroke-dasharray="4" />
</template>

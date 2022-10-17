<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import Segment from './Segment.vue'
import type { Line, Point } from '~/composables/usePoints'

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

const line = computed(() => {
  const { points, svgSize } = props
  if (!points[0] || !points[1] || !svgSize)
    return

  let [[x1, y1], [x2, y2]] = points
  if (x1 < x2)
    ([[x2, y2], [x1, y1]] = points)
  else if (x1 === x2)
    ++x1

  const a = (y1 - y2) / (x1 - x2)
  const b = y2 - x2 * a

  return [[0, b], [svgSize.width, a * svgSize.width + b]] as [Point, Point]
})
</script>

<template>
  <Segment v-bind="$attrs" :point-start="points[0]" :point-stop="points[1]" />
  <Segment v-if="line" v-bind="$attrs" :point-start="line[0]" :point-stop="line[1]" stroke-dasharray="4" stroke-width="1" />
</template>

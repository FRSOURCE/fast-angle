<script lang="ts" setup>
const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits<{
  (e: 'pressed'): void
}>()
const pathWidth = 5
const svgRef = useBoardSvgRef()
const initialized = ref(false)

const { elementX, elementY } = useMouseInElement(svgRef, { handleOutside: false })
const { undo: elementXUndo, redo: elementXRedo } = useRefHistory(elementX)
const { undo: elementYUndo, redo: elementYRedo } = useRefHistory(elementY)

const svgSize = computed(() => ({ width: props.width, height: props.height }))
const { lines, predictNextPoint, drawNextPoint, step, registerOnRedo, registerOnUndo } = useLines()
registerOnRedo(() => {
  elementXRedo()
  elementYRedo()
})
registerOnUndo(() => {
  elementXUndo()
  elementYUndo()
})
watch([elementX, elementY] as const, ([elementX, elementY]) => {
  if (step.value === 2)
    predictNextPoint(elementX, elementY)
})

const angle = useAngle(lines)
const segment1 = computed(() => lines.value[0] || [])
const segment2 = computed(() => lines.value[1] || [])
const line1Variables = useLinearFnVariables(segment1)
const line2Variables = useLinearFnVariables(segment2)
const intersectionOffset = useLinesIntersectionPosition(line1Variables, line2Variables)
const anglesBisectors = useAnglesBisectors(angle, intersectionOffset, line1Variables, line2Variables)
const labels = useAnglesLabels(angle, intersectionOffset, anglesBisectors)
const { outOfBoundLabels, setOutBoundLabels } = useOutOfBoundLabels()

watch([labels, svgSize] as const, ([labels, svgSize]) => {
  setOutBoundLabels(labels, svgSize)
})

const pressed = () => {
  drawNextPoint(elementX.value, elementY.value)
  emit('pressed')
}
</script>

<template>
  <svg
    ref="svgRef"
    :viewBox="`0 0 ${svgSize.width} ${svgSize.height}`"
    :stroke-width="pathWidth"
    @touchend.prevent="pressed"
    @mouseup.prevent="pressed"
    @mousedown.once="initialized = true"
    @mousemove.passive.once="initialized = true"
    @touchstart.passive.once="initialized = true"
  >
    <slot />
    <circle v-show="initialized" v-if="step % 2" :cx="`${elementX}px`" :cy="`${elementY}px`" :r="pathWidth" :stroke-width="1" />
    <Line v-else :points="[lines[Math.floor(step / 2)][0], [elementX, elementY]]" :svg-size="svgSize" :path-width="pathWidth" />

    <Line :points="lines[0]" :svg-size="svgSize" :path-width="pathWidth" />
    <Line :points="lines[1]" :svg-size="svgSize" :path-width="pathWidth" />
    <template v-if="!outOfBoundLabels">
      <template v-for="label in labels" :key="`${label.x}|${label.y}`">
        <text :x="label.x" :y="label.y" text-anchor="middle" dominant-baseline="middle" stroke="var(--background-color-transparent)" stroke-width="5">{{ label.value.toFixed(3) }}&deg;</text>
        <text :x="label.x" :y="label.y" text-anchor="middle" dominant-baseline="middle" stroke="transparent">{{ label.value.toFixed(3) }}&deg;</text>
      </template>
    </template>
  </svg>
</template>

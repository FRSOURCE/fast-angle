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
const pathWidth = 3
const svgRef = ref<SVGElement>()

const { elementX, elementY } = useMouseInElement(svgRef)
const svgSize = computed(() => ({ width: props.width, height: props.height }))
const { lines, drawNextPoint, step } = useLines()
</script>

<template>
  <svg
    ref="svgRef"
    :viewBox="`0 0 ${svgSize.width} ${svgSize.height}`"
    :style="{ strokeWidth: pathWidth }"
    @click="drawNextPoint({ elementX, elementY })"
  >
    <slot />

    <circle v-if="step % 2" :class="$style['blend-exclusion']" :cx="`${elementX}px`" :cy="`${elementY}px`" :r="pathWidth" :stroke-width="1" />
    <Line v-else :class="$style['blend-exclusion']" :points="[lines[Math.floor(step / 2)][0], [elementX, elementY]]" :svg-size="svgSize" :path-width="pathWidth" />

    <Line :class="$style['blend-exclusion']" label="line A" :points="lines[0]" :svg-size="svgSize" :path-width="pathWidth" />
    <Line :class="$style['blend-exclusion']" label="line B" :points="lines[1]" :svg-size="svgSize" :path-width="pathWidth" />
  </svg>
</template>

<style lang="scss" module>
  .blend-exclusion  {
    mix-blend-mode: exclusion;
  }
</style>

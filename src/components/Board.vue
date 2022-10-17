<script lang="ts" setup>
import { ref } from 'vue'
import Line from './Line.vue'

const { t } = useI18n()

const pathWidth = 3
const boardRef = ref<HTMLDivElement>()
const svgRef = ref<SVGElement>()
const { elementX, elementY } = useMouseInElement(svgRef)
const { height: elementHeight, width: elementWidth } = useElementSize(boardRef)
const imageSrc = ref('')

const processFiles = (files: File[] | null) => {
  if (files?.[0] instanceof File)
    imageSrc.value = URL.createObjectURL(files[0])
}

const { points, drawNextPoint, step } = usePoints({ elementX, elementY })
const angle = useAngle(points)

const svgSize = computed(() => ({ width: elementWidth.value, height: elementHeight.value }))

const { isOverDropZone } = useDropZone(boardRef, processFiles)
const info = computed(() => {
  if (isOverDropZone.value)
    return [t('board.drop_file_here')]
  if (angle.value) {
    return [
      t('board.angle_convex', { value: angle.value }),
      t('board.angle_concave', { value: 360 - angle.value }),
    ]
  }

  return []
})
</script>

<template>
  <div ref="boardRef" class="board">
    <svg
      ref="svgRef"
      class="board__svg"
      :viewBox="`0 0 ${svgSize.width} ${svgSize.height}`"
      :style="{ strokeWidth: pathWidth }"
      @click="drawNextPoint"
    >
      <image v-if="imageSrc" :href="imageSrc" height="100%" width="100%" />
      <circle class="blend-exclusion" :cx="`${elementX}px`" :cy="`${elementY}px`" :r="pathWidth" :stroke-width="1" />

      <Line class="blend-exclusion" :points="points[0]" :svg-size="svgSize" :path-width="pathWidth" />
      <Line class="blend-exclusion" :points="points[1]" :svg-size="svgSize" :path-width="pathWidth" />
    </svg>

    <div v-if="step === -1 && !imageSrc" class="board__hint">
      {{ t('board.click_this_button_or_drop') }}
    </div>

    <BoardNav class="board__nav" :board-ref="boardRef" :info="info" @update:files="processFiles" />
  </div>
</template>

<style lang="scss">
  .board {
    position: relative;
    border: solid thin #999;
    display: flex;
    flex-flow: column;
    stroke: #fff;
    width: 100%;
    min-height: 200px;
    height: 60vh;

    &__svg {
      flex-grow: 1;
      min-height: 0;
      width: 100%;
    }

    &__nav {
      position: absolute;
      bottom: 0;
      left: 1rem;
      right: 1rem;
    }

    &__hint {
      position: absolute;
      top: 50%;
      left: 10px;
      right: 10px;
      margin: auto;
      max-width: 600px;
      transform: translateY(-50%);
      text-align: justify;
    }
  }

  .blend-exclusion  {
    mix-blend-mode: exclusion;
  }

  .m-0 {
    margin: 0;
  }

  .angle {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 20px;
  }
</style>

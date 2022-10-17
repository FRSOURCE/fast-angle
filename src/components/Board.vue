<script lang="ts" setup>
import { ref } from 'vue'
import Line from './Line.vue'

const { t } = useI18n()

const pathWidth = 3
const showHint = ref(true)
const boardRef = ref<HTMLDivElement>()
const svgRef = ref<SVGElement>()
const { elementX, elementY } = useMouseInElement(svgRef)
const { height: elementHeight, width: elementWidth } = useElementSize(boardRef)
const svgSize = computed(() => ({ width: elementWidth.value, height: elementHeight.value }))

const { points, drawNextPoint, step, undo, redo, canUndo, canRedo } = usePoints({ elementX, elementY })
const angle = useAngle(points)

const imageSrc = ref('')
const processFiles = (files: File[] | null) => {
  if (files?.[0] instanceof File)
    imageSrc.value = URL.createObjectURL(files[0])
}
const { isOverDropZone } = useDropZone(boardRef, processFiles)

const info = computed(() => {
  if (isOverDropZone.value)
    return [t('board.drop_file_here')]
  if (angle.value) {
    return [
      { type: 'convex', value: angle.value },
      { type: 'concave', value: 360 - angle.value },
    ] as { type: 'convex' | 'concave'; value: number }[]
  }

  return []
})
</script>

<template>
  <div ref="boardRef" :class="$style.board">
    <svg
      ref="svgRef"
      :class="$style.board__svg"
      :viewBox="`0 0 ${svgSize.width} ${svgSize.height}`"
      :style="{ strokeWidth: pathWidth }"
      @click="drawNextPoint(), showHint = false"
    >
      <image v-if="imageSrc" :href="imageSrc" height="100%" width="100%" />
      <circle v-if="step % 2" :class="$style['blend-exclusion']" :cx="`${elementX}px`" :cy="`${elementY}px`" :r="pathWidth" :stroke-width="1" />
      <Line v-else :class="$style['blend-exclusion']" :points="[points[Math.floor(step / 2)][0], [elementX, elementY]]" :svg-size="svgSize" :path-width="pathWidth" />

      <Line :class="$style['blend-exclusion']" :points="points[0]" :svg-size="svgSize" :path-width="pathWidth" />
      <Line :class="$style['blend-exclusion']" :points="points[1]" :svg-size="svgSize" :path-width="pathWidth" />
    </svg>

    <div v-if="showHint && !imageSrc" :class="$style.board__hint">
      {{ t('board.click_this_button_or_drop') }}
    </div>

    <BoardNav
      :class="$style.board__nav"
      :board-ref="boardRef"
      :info="info"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @update:files="processFiles"
      @undo="undo"
      @redo="redo"
    />
  </div>
</template>

<style lang="scss" module>
  .board {
    position: relative;
    border: solid thin var(--card-border-color);
    border-radius: 2px;
    display: flex;
    flex-flow: column;
    stroke: #fff;
    width: 100%;
    height: 300px;
    background: var(--card-background-color);

    &__svg {
      flex-grow: 1;
      min-height: 0;
      width: 100%;
    }

    &__nav {
      flex-wrap: wrap;
      position: absolute;
      bottom: 0;
      left: 1rem;
      right: 1rem;
    }

    &__hint {
      position: absolute;
      top: 50%;
      left: 20px;
      right: 70px;
      margin: auto;
      max-width: 600px;
      transform: translateY(-50%);
      text-align: justify;

      @media (min-width: 768px) {
        right: 20px;
      }
    }
  }

  .blend-exclusion  {
    mix-blend-mode: exclusion;
  }
</style>

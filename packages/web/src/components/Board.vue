<script lang="ts" setup>
const { t } = useI18n()

const showHint = ref(true)
const boardRef = useBoardRef()
const { height, width } = useElementSize(boardRef)

const { imageSrc, processFiles } = useBoardImage()
const { isOverDropZone } = useDropZone(boardRef, processFiles)

const info = computed(() => {
  if (isOverDropZone.value)
    return [t('board.drop_file_here')]

  return []
})
</script>

<template>
  <div ref="boardRef" :class="$style.board">
    <BoardSvg :class="$style.board__svg" :width="width" :height="height" @pressed="showHint = false">
      <image v-if="imageSrc" :href="imageSrc" height="100%" width="100%" />
    </BoardSvg>

    <div v-if="showHint && !imageSrc" :class="$style.board__hint">
      {{ t('board.click_this_button_or_drop') }}
    </div>

    <BoardResult :board-ref="boardRef" />

    <BoardControls
      :class="$style.board__nav"
      :board-ref="boardRef"
      :info="info"
      @update:files="processFiles"
    />
  </div>
</template>

<style lang="scss" module>
  .board {
    position: relative;
    margin: 0 calc(-1 * var(--block-spacing-horizontal));
    border: solid thin var(--card-border-color);
    border-radius: 2px;
    display: flex;
    flex-flow: column;
    width: calc(100% + 2 * var(--block-spacing-horizontal));
    height: 260px;
    background: var(--card-background-color);

    @media (min-width: 768px) {
      margin: 0;
      width: 100%;
    }

    &__svg {
      flex-grow: 1;
      min-height: 0;
      width: 100%;
      stroke: #fff;
      touch-action: none;
    }

    &__nav {
      position: absolute;
      bottom: 0;
      left: var(--nav-element-spacing-horizontal);
      right: var(--nav-element-spacing-horizontal);
    }

    &__hint {
      position: absolute;
      top: 40%;
      left: 20px;
      right: 70px;
      margin: auto;
      max-width: 600px;
      transform: translateY(-50%);
      text-align: justify;
      white-space: pre-line;
      pointer-events: none;

      @media (min-width: 768px) {
        right: 20px;
      }
    }
  }
</style>

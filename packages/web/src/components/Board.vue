<script lang="ts" setup>
const { t } = useI18n();

const showHint = ref(true);
const boardRef = useBoardRef();
const { height, width } = useElementSize(boardRef);

const {
  src: imageSrc,
  width: imageWidth,
  height: imageHeight,
  processFiles,
} = useBoardImage();
const scaledImgHeight = ref(0);
const scaledImgWidth = ref(0);

watch(imageSrc, () => {
  if (imageHeight && imageWidth) {
    if (imageWidth.value > width.value || imageHeight.value > height.value) {
      const maxRatio = Math.min(
        width.value / imageWidth.value,
        height.value / imageHeight.value,
      );
      scaledImgHeight.value = imageHeight.value * maxRatio;
      scaledImgWidth.value = imageWidth.value * maxRatio;
    } else {
      scaledImgHeight.value = imageHeight.value;
      scaledImgWidth.value = imageWidth.value;
    }
  }
});
const { isOverDropZone } = useDropZone(boardRef, processFiles);

const info = computed(() => {
  if (isOverDropZone.value) return [t('board.drop_file_here')];

  return [];
});
</script>

<template>
  <div ref="boardRef" :class="$style.board">
    <BoardSvg
      :class="$style.board__svg"
      :width="width"
      :height="height"
      @pressed="showHint = false"
    >
      <image
        v-if="imageSrc"
        :href="imageSrc"
        :x="scaledImgWidth / -2"
        :y="scaledImgHeight / -2"
        :height="`${scaledImgHeight}`"
        :width="`${scaledImgWidth}`"
      />
    </BoardSvg>

    <div v-if="showHint && !imageSrc" :class="$style.board__hint">
      {{ t('board.click_this_button_or_drop') }}
    </div>

    <BoardResult />

    <BoardControls
      :class="$style.board__nav"
      :info="info"
      @update:files="processFiles"
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
  width: 100%;
  height: 260px;
  background: var(--card-background-color);

  &__svg {
    flex-grow: 1;
    min-height: 0;
    width: 100%;
    stroke: #fff;
    touch-action: none;

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: solid 2px var(--primary-focus);
    }
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

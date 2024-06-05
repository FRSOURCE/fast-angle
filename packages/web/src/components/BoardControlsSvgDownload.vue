<script lang="ts" setup>
import IconDownload from '~icons/carbon/download';

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const { isSupported: isSvgDownloadSupported } = useBoardSvgDownload();
const boardRef = useBoardRef();
const { height: boardHeight, width: boardWidth } = useElementSize(boardRef);
const isModalOpen = ref(false);
const isSubmittingForm = ref(false);
const formId = 'board_svg_download_form';

useMagicKeys({
  onEventFired(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      isModalOpen.value = true;
    }
  },
  passive: false,
});
</script>

<template>
  <li v-if="isSvgDownloadSupported">
    <Button
      :tooltip="`${t('board.nav.download_image.action')} [ctrl + s][⌘ + s]`"
      tooltip-placement="left"
      :disabled="!disabled ? true : undefined"
      @click="isModalOpen = true"
      @touchstart.stop.prevent="isModalOpen = true"
    >
      <IconDownload />
      <Modal
        v-model="isModalOpen"
        :heading="t('board.nav.download_image.heading')"
      >
        <BoardControlsSvgDownloadModalContent
          :id="formId"
          :board-height="boardHeight"
          :board-width="boardWidth"
          @submit="isSubmittingForm = true"
          @download-finish="(isSubmittingForm = false), (isModalOpen = false)"
        />

        <template #footer>
          <Button
            type="submit"
            role="button"
            :form="formId"
            :disabled="isSubmittingForm"
            :aria-busy="isSubmittingForm"
            :class="$style['button-submit']"
            autofocus
          >
            {{ t('board.nav.download_image.save') }}
          </Button>
        </template>
      </Modal>
    </Button>
  </li>
</template>

<style lang="scss" module>
.button-submit {
  width: auto !important;
}
</style>

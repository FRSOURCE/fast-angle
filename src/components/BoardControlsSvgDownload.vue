<script lang="ts" setup>
import IconDownload from '~icons/carbon/download'

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const { isSupported: isSvgDownloadSupported } = useBoardSvgDownload()
const isModalOpen = ref(false)
const isSubmittingForm = ref(false)
const formId = 'board_svg_download_form'

useMagicKeys({
  onEventFired(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      isModalOpen.value = true
    }
  },
  passive: false,
})
</script>

<template>
  <li v-if="isSvgDownloadSupported">
    <button
      type="button"
      role="button"
      class="vertical-middle"
      :data-tooltip="`${t('board.nav.download_image.action')} [ctrl + s][⌘ + s]`"
      data-placement="left"
      :disabled="!disabled ? true : undefined"
      @click="isModalOpen = true"
    >
      <IconDownload />
      <Modal
        v-model="isModalOpen"
        :heading="t('board.nav.download_image.heading')"
      >
        <BoardControlsSvgDownloadModalContent :id="formId" @submit="isSubmittingForm = true, isModalOpen = false" @download-finish="isSubmittingForm = false" />

        <template #footer>
          <button
            type="submit"
            role="button"
            :form="formId"
            :disabled="isSubmittingForm"
            v-text="t('board.nav.download_image.save')"
          />
        </template>
      </Modal>
    </button>
  </li>
</template>

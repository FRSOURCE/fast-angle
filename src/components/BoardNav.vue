<script lang="ts" setup>
import type { PropType } from 'vue'
import type { MaybeElement } from '@vueuse/core'
import IconMaximize from '~icons/carbon/maximize'
import IconMinimize from '~icons/carbon/minimize'
import IconUpload from '~icons/carbon/cloud-upload'

const props = defineProps({
  boardRef: {
    type: Object as PropType<MaybeElement>,
    default: undefined,
  },
  info: {
    type: Array as PropType<string[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update:files', src: File[]): void
}>()

const { t } = useI18n()
const { toggle, isFullscreen, isSupported } = useFullscreen(toRef(props, 'boardRef'))
const { files, open } = useFileDialog({ multiple: false, accept: 'image/*', capture: 'environment' })

whenever(files, (files) => {
  emit('update:files', Array.from(files))
})
</script>

<template>
  <nav clas="pointer-none">
    <ul class="info">
      <li v-for="text in info" :key="text">
        <span>{{ text }}</span>
      </li>
    </ul>
    <ul class="pointer-all" @mousemove.prevent.stop>
      <li>
        <button role="button" type="button" :data-tooltip="t('board.nav.upload_file')" @click="open()">
          <IconUpload />
        </button>
      </li>
      <li v-if="isSupported">
        <button role="button" type="button" :data-tooltip="t('board.nav.toggle_fullscreen')" @click="toggle">
          <IconMinimize v-if="isFullscreen" />
          <IconMaximize v-else />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.info {
  mix-blend-mode: exclusion;
}
</style>

<script lang="ts">
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component'
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const { t } = useI18n()
const dialog = ref<HTMLDialogElement>()

const close = () => emit('update:modelValue', false)

watch(dialog, (dialog) => {
  dialog?.showModal()
})
</script>

<template>
  <Teleport v-if="modelValue" to="body">
    <UseFocusTrap :options="{ immediate: true, initialFocus: false }">
      <dialog ref="dialog" aria-modal @click="close" @close="close">
        <article v-bind="$attrs" @click.stop>
          <h3 v-text="heading" />
          <slot />
          <footer :class="$style.footer">
            <slot name="footer-pre" />
            <Button
              class="secondary"
              @click="close"
            >
              {{ t('main.close') }}
            </Button>
            <slot name="footer" />
          </footer>
        </article>
      </dialog>
    </UseFocusTrap>
  </Teleport>
</template>

<style lang="scss" module>
.footer {
  position: sticky;
  bottom: calc(-1 * var(--block-spacing-vertical));
}
</style>

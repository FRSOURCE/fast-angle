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

onKeyStroke('Escape', (e) => {
  if (props.modelValue) {
    e.preventDefault()
    emit('update:modelValue', false)
  }
})
</script>

<template>
  <Teleport v-if="modelValue" to="body">
    <UseFocusTrap :options="{ immediate: true, initialFocus: false }">
      <dialog open @click="$emit('update:modelValue', false)">
        <article v-bind="$attrs" @click.prevent.stop>
          <h3 v-text="heading" />
          <slot />
          <footer :class="$style.footer">
            <slot name="footer-pre" />
            <Button
              class="secondary"
              @click.prevent="$emit('update:modelValue', false)"
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

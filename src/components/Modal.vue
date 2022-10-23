<script lang="ts" setup>
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component'

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
    <UseFocusTrap :options="{ immediate: true }">
      <dialog open>
        <article>
          <h3 v-text="heading" />
          <slot />
          <footer>
            <button
              type="button"
              role="button"
              class="secondary"
              @click.prevent="$emit('update:modelValue', false)"
              v-text="t('main.close')"
            />
            <slot name="footer" />
          </footer>
        </article>
      </dialog>
    </UseFocusTrap>
  </Teleport>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
  tooltip: {
    type: String,
    default: undefined,
  },
  tooltipPlacement: {
    type: String as PropType<'bottom' | 'left' | 'right'>,
    default: undefined,
  },
  size: {
    type: String as PropType<'small'>,
    default: undefined,
  },
});
</script>

<template>
  <button
    type="button"
    role="button"
    class="vertical-middle"
    :class="{ [$style.small]: size === 'small' }"
    :aria-label="tooltip"
    :data-tooltip="tooltip"
    :data-placement="tooltipPlacement"
  >
    <slot />
  </button>
</template>

<style lang="scss" module>
.small {
  --form-element-spacing-vertical: 0.5rem;
  --form-element-spacing-horizontal: 0.5rem;
}
</style>

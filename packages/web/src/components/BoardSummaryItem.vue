<script lang="ts" setup>
import IconCopy from '~icons/carbon/copy';
import IconCheckmark from '~icons/carbon/checkmark';

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
});
const formattedValue = computed(() =>
  props.value ? props.value.toFixed(3) : '',
);
const { copy, copied, isSupported } = useClipboard({ source: formattedValue });
</script>

<template>
  <small :class="$style.item" @click="() => copy()">
    <div>
      <slot />
      <span :class="$style.text">
        <template v-if="formattedValue">{{ formattedValue }}&deg;</template>
        <template v-else>?</template>
      </span>
    </div>
    <Button
      v-if="isSupported && formattedValue"
      :class="$style.btn"
      :disabled="copied"
    >
      <IconCheckmark v-if="copied" />
      <IconCopy v-else />
    </Button>
  </small>
</template>

<style lang="scss" module>
.item {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
}

.text {
  margin-left: 0.25rem;
  vertical-align: middle;
}

.btn {
  justify-content: flex-end;
  border: none;
  margin: 0;
  font-size: 0.75em;
  padding: 0;
  vertical-align: middle;
  background: none;
  color: inherit;
}
</style>

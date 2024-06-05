<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Point } from '~/composables/useLines';

defineProps({
  pointStart: {
    type: Array as unknown as PropType<Point>,
    default: undefined,
  },
  pointStop: {
    type: Array as unknown as PropType<Point>,
    default: undefined,
  },
});
</script>

<template>
  <line
    v-if="pointStart && pointStop"
    :x1="pointStart[0]"
    :y1="pointStart[1]"
    :x2="pointStop[0]"
    :y2="pointStop[1]"
  />
</template>

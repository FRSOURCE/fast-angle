<script lang="ts" setup>
const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits<{
  (e: 'pressed'): void;
}>();

const { width, height } = toRefs(props);
const svgRef = useBoardSvgRef();
const initialized = ref(false);
const { ctrl, meta, option } = useMagicKeys();

const cursorStyle = computed(() => {
  if (meta.value) return 'move';
});

const {
  offset: panzoomOffset,
  active: panzoomActive,
  zoom,
  transformOrigin,
} = useBoardSvgPanzoom();
const pathWidth = computed(() => 5 / zoom.value);
const svgSize = computed(() => ({
  width: width.value / zoom.value,
  height: height.value / zoom.value,
}));
const svgOffset = computed(() => ({
  x: -panzoomOffset.value[0] / zoom.value,
  y: -panzoomOffset.value[1] / zoom.value,
}));

const { elementX, elementY } = useMouseInElement(svgRef, {
  handleOutside: false,
});
const currentPointX = computed(
  () => (elementX.value - panzoomOffset.value[0]) / zoom.value,
);
const currentPointY = computed(
  () => (elementY.value - panzoomOffset.value[1]) / zoom.value,
);
const { undo: elementXUndo, redo: elementXRedo } = useRefHistory(elementX);
const { undo: elementYUndo, redo: elementYRedo } = useRefHistory(elementY);
const {
  lines,
  predictNextPoint,
  drawNextPoint,
  step,
  registerOnRedo,
  registerOnUndo,
} = useLines();

registerOnRedo(() => {
  elementXRedo();
  elementYRedo();
});
registerOnUndo(() => {
  elementXUndo();
  elementYUndo();
});
watch(
  [currentPointX, currentPointY] as const,
  ([currentPointX, currentPointY]) => {
    if (step.value === 2) predictNextPoint(currentPointX, currentPointY);
  },
);

const angle = useAngle(lines);
const segment1 = computed(() => lines.value[0] || []);
const segment2 = computed(() => lines.value[1] || []);
const line1Variables = useLinearFnVariables(segment1);
const line2Variables = useLinearFnVariables(segment2);
const intersectionOffset = useLinesIntersectionPosition(
  line1Variables,
  line2Variables,
);
const anglesBisectors = useAnglesBisectors(
  angle,
  intersectionOffset,
  line1Variables,
  line2Variables,
);
const labels = useAnglesLabels(angle, intersectionOffset, anglesBisectors);
const { setOutBoundLabels } = useOutOfBoundLabels();

watch([labels, svgSize, svgOffset] as const, ([labels, svgSize, svgOffset]) =>
  setOutBoundLabels(labels, svgSize, svgOffset),
);

watch([width, height] as const, ([width, height], [oldWidth, oldHeight]) => {
  transformOrigin.value = [
    transformOrigin.value[0] + (width - oldWidth) / 2,
    transformOrigin.value[1] + (height - oldHeight) / 2,
  ];
});

function pressed() {
  if (panzoomActive.value) return;
  drawNextPoint(currentPointX.value, currentPointY.value);

  emit('pressed');
}
</script>

<template>
  <svg
    ref="svgRef"
    :viewBox="`${svgOffset.x} ${svgOffset.y} ${svgSize.width} ${svgSize.height}`"
    :stroke-width="pathWidth"
    tabindex="0"
    :style="{
      cursor: cursorStyle,
    }"
    @touchend.prevent="pressed"
    @mouseup.left.prevent="pressed"
    @mousedown.left.once="initialized = true"
    @mousemove.passive.once="initialized = true"
    @touchstart.passive.once="initialized = true"
  >
    <slot />
    <circle
      v-show="initialized && !ctrl && !meta && !option"
      v-if="step % 2"
      :cx="`${currentPointX}px`"
      :cy="`${currentPointY}px`"
      :r="pathWidth"
      :stroke-width="1"
    />
    <Line
      v-else
      :points="[lines[Math.floor(step / 2)][0], [currentPointX, currentPointY]]"
      :svg-size="svgSize"
      :svg-offset="svgOffset"
      :path-width="pathWidth"
    />

    <Line
      :points="lines[0]"
      :svg-size="svgSize"
      :svg-offset="svgOffset"
      :path-width="pathWidth"
    />
    <Line
      :points="lines[1]"
      :svg-size="svgSize"
      :svg-offset="svgOffset"
      :path-width="pathWidth"
    />
    <template v-for="label in labels" :key="`${label.x}|${label.y}`">
      <text
        :x="label.x"
        :y="label.y"
        text-anchor="middle"
        dominant-baseline="middle"
        stroke="var(--background-color-transparent)"
        :stroke-width="pathWidth"
        :style="`font-size:${pathWidth / 5}em`"
      >
        {{ label.value.toFixed(3) }}&deg;
      </text>
      <text
        :x="label.x"
        :y="label.y"
        text-anchor="middle"
        dominant-baseline="middle"
        stroke="transparent"
        :style="`font-size:${pathWidth / 5}em`"
      >
        {{ label.value.toFixed(3) }}&deg;
      </text>
    </template>
  </svg>
</template>

<script lang="ts" setup>
import type { ValueOf } from 'type-fest';
import { SVG_DOWNLOAD_FILETYPE } from '~/composables/useBoardSvgDownload';
import { SIZING_UNIT } from '~/composables/usePixelToUnit';
import IconLocked from '~icons/carbon/locked';
import IconUnlocked from '~icons/carbon/unlocked';

const props = defineProps({
  boardWidth: {
    type: Number,
    required: true,
  },
  boardHeight: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'downloadFinish'): void;
}>();

const { t } = useI18n();
const { triggerDownload: triggerSvgDownload } = useBoardSvgDownload();
const filename = useLocalStorage('FA_FILENAME', 'fast-angle-image');

const { boardHeight, boardWidth } = toRefs(props);
const height = ref(boardHeight.value);
const width = ref(boardWidth.value);
const unit = useLocalStorage<ValueOf<typeof SIZING_UNIT>>(
  'FA_SIZE_UNIT',
  SIZING_UNIT.px,
);
const keepAspectRatio = ref(true);
const aspectRatio = ref(boardWidth.value / boardHeight.value);

if (breakpoints.isGreaterOrEqual('xl')) {
  watch([boardWidth, boardHeight] as const, ([boardWidth, boardHeight]) => {
    width.value = boardWidth;
    height.value = boardHeight;
    aspectRatio.value = boardWidth / boardHeight;
  });
}

const heightUnit = usePixelToUnit(height, unit, boardHeight);
const widthUnit = usePixelToUnit(width, unit, boardWidth);

watch(
  [widthUnit, heightUnit] as const,
  ([widthUnit, heightUnit]) => {
    if (!keepAspectRatio.value) aspectRatio.value = widthUnit / heightUnit;
  },
  { flush: 'sync', immediate: true },
);

watch(
  heightUnit,
  () => {
    if (heightUnit.value < 0) heightUnit.value = 1;
    if (
      keepAspectRatio.value &&
      heightUnit.value !== +(widthUnit.value / aspectRatio.value).toFixed(3)
    )
      widthUnit.value = +(heightUnit.value * aspectRatio.value).toFixed(3);
  },
  { flush: 'sync' },
);
watch(
  widthUnit,
  () => {
    if (widthUnit.value < 0) widthUnit.value = 1;
    if (
      keepAspectRatio.value &&
      widthUnit.value !== +(heightUnit.value * aspectRatio.value).toFixed(3)
    )
      heightUnit.value = +(widthUnit.value / aspectRatio.value).toFixed(3);
  },
  { flush: 'sync' },
);

const filetype = useLocalStorage<ValueOf<typeof SVG_DOWNLOAD_FILETYPE>>(
  'FA_FILETYPE',
  SVG_DOWNLOAD_FILETYPE.PNG,
);

const quality = useLocalStorage('FA_QUALITY', 100);
watch(quality, () => {
  if (quality.value > 100) quality.value = 100;
  if (quality.value < 0) quality.value = 0;
});

async function submit() {
  await triggerSvgDownload({
    filename: filename.value,
    filetype: filetype.value,
    quality: quality.value / 100,
    width: width.value,
    height: height.value,
  }).catch(() => {});

  emit('downloadFinish');
}
</script>

<template>
  <form @submit.prevent="submit">
    <div :class="$style.name">
      <label class="flex-grow">
        {{ t('board.nav.download_image.name_label') }}
        <input
          v-model="filename"
          type="text"
          name="name"
          required
          :aria-invalid="!filename"
        />
      </label>

      <label :class="$style['label--big']">
        {{ t('board.nav.download_image.format_label') }}
        <select v-model="filetype" required>
          <option
            v-for="format in Object.keys(SVG_DOWNLOAD_FILETYPE)"
            :key="format"
            :value="
              SVG_DOWNLOAD_FILETYPE[
                format as keyof typeof SVG_DOWNLOAD_FILETYPE
              ]
            "
            v-text="format"
          />
        </select>
      </label>
    </div>
    <fieldset :class="$style.sizing">
      <legend>
        <small>{{ t('board.nav.download_image.sizing_label') }}</small>
      </legend>
      <label :class="$style.label">
        {{ t('board.nav.download_image.width_label') }}
        <input
          v-model.number="widthUnit"
          min="1"
          type="number"
          step="0.000001"
          name="width"
          required
          :aria-invalid="!widthUnit || widthUnit < 1"
        />
      </label>
      <label :class="$style.label">
        {{ t('board.nav.download_image.height_label') }}
        <input
          v-model.number="heightUnit"
          min="1"
          type="number"
          step="0.000001"
          name="height"
          required
          :aria-invalid="!heightUnit || heightUnit < 1"
        />
      </label>
      <label>
        &nbsp;
        <div
          :class="$style['aspect-ratio']"
          :data-tooltip="t('board.nav.download_image.keep_aspect_ratio')"
          data-placement="left"
        >
          <Button
            :aria-label="t('board.nav.download_image.keep_aspect_ratio')"
            :class="[
              $style['aspect-ratio-btn'],
              { [$style['aspect-ratio-btn--inactive']]: !keepAspectRatio },
            ]"
            @click="keepAspectRatio = !keepAspectRatio"
          >
            <IconLocked v-if="keepAspectRatio" />
            <IconUnlocked v-else />
          </Button>
        </div>
      </label>
      <label :class="[$style.label, $style['label--small']]">
        {{ t('board.nav.download_image.unit_label') }}
        <select v-model="unit" required>
          <option
            v-for="unitItem in Object.keys(SIZING_UNIT)"
            :key="unitItem"
            :value="SIZING_UNIT[unitItem as keyof typeof SIZING_UNIT]"
            v-text="unitItem"
          />
        </select>
      </label>
    </fieldset>
    <label>
      <span :class="$style.quality">
        {{ t('board.nav.download_image.quality_label') }}
        <input
          v-model.number="quality"
          type="number"
          min="1"
          max="100"
          :class="$style.quality__input"
          name="quality"
          :aria-invalid="!quality || quality > 100 || quality < 1"
        />
        %
      </span>
      <input
        v-model.number="quality"
        type="range"
        min="1"
        max="100"
        name="quality"
      />
    </label>
  </form>
</template>

<style lang="scss" module>
.label {
  flex-shrink: 1;
  flex-grow: 1;
  width: 100px;
  min-width: 0;
}

.label--big {
  width: 160px;
}

.label--small {
  width: 80px;
}

.sizing,
.name {
  display: flex;
  gap: 0.5rem;
}

.sizing {
  flex-wrap: wrap;
}

.aspect-ratio {
  border-bottom: none !important;
  margin-top: calc(var(--spacing) * 0.25 + 0.375rem);
  cursor: default !important;
}

.aspect-ratio-btn {
  --form-element-spacing-vertical: 0.5rem;
  --form-element-spacing-horizontal: 0.25rem;
  margin-right: 0;
}

.aspect-ratio-btn--inactive {
  opacity: 0.5;
}

.quality {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  .quality__input {
    margin: 0 0.5rem 0 auto;
    width: 100px;
    --line-height: 9px;
    --form-element-spacing-vertical: 0.5rem;
    --form-element-spacing-horizontal: 0.75rem;

    @media (min-width: 1024px) {
      width: 115px;
    }
  }
}
</style>

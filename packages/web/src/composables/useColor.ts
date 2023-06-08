import type { Ref } from 'vue'
import ColorHash from 'color-hash'

const SPECTRUM_401_950 = Array.from({ length: 550 }, (_, i) => (i + 401) / 1000)
const SPECTRUM_50_600 = Array.from({ length: 551 }, (_, i) => (i + 50) / 1000)

export function useColor(value: Ref<unknown>) {
  return computed(() => {
    const text = JSON.stringify(value.value)
    const lightnessSpectrum = isDark.value ? SPECTRUM_401_950 : SPECTRUM_50_600
    const [hue, saturation, lightness] = new ColorHash({ lightness: lightnessSpectrum }).hsl(text)

    return `hsl(${[
    hue,
    `${
      (isDark.value && lightness < 0.3)
      || (!isDark.value && lightness > 0.7)
        ? Math.min(saturation + 0.4, 1) * 100
        : saturation * 100
    }%`,
    `${lightness * 100}%`,
  ].join(',')})`
  })
}

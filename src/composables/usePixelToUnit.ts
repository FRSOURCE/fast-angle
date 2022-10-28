import type { ValueOf } from 'type-fest'
import type { Ref } from 'vue'

export const SIZING_UNIT = {
  'px': 1,
  '%': 2,
  'in': 3,
  'mm': 4,
} as const

const convertPxToUnit = (valuePx: number, unit: ValueOf<typeof SIZING_UNIT>, originalSize: number) => {
  let result = valuePx
  switch (unit) {
    case SIZING_UNIT['%']: result = valuePx * 100 / originalSize
      break
    case SIZING_UNIT.in: result = valuePx / window.devicePixelRatio
      break
    case SIZING_UNIT.mm: result = valuePx * 25.4 / window.devicePixelRatio
      break
  }

  return +(result.toFixed(6))
}

const convertUnitToPx = (value: number, unit: ValueOf<typeof SIZING_UNIT>, originalSize: number) => {
  let result = value
  switch (unit) {
    case SIZING_UNIT['%']: result = value / 100 * originalSize
      break
    case SIZING_UNIT.in: result = value * window.devicePixelRatio
      break
    case SIZING_UNIT.mm: result = value * window.devicePixelRatio / 25.4
      break
  }

  return +(result.toFixed(5))
}

export const usePixelToUnit = (valuePx: Ref<number>, unit: Ref<ValueOf<typeof SIZING_UNIT>>, originalSize: Ref<number>) => {
  const value = ref(0)
  const innerPxValue = ref(valuePx.value - 1)
  const inputValue = ref(0)

  watch([valuePx, unit], ([valuePx, unit], [, oldUnit]) => {
    if (innerPxValue.value !== valuePx || unit !== oldUnit) {
      innerPxValue.value = valuePx
      value.value = convertPxToUnit(valuePx, unit, originalSize.value)
    }
  }, { immediate: true })

  watch(inputValue, (inputValue) => {
    if (value.value !== inputValue)
      innerPxValue.value = convertUnitToPx(inputValue, unit.value, originalSize.value)
  })

  watch(value, value => inputValue.value = value, { immediate: true })

  return inputValue
}

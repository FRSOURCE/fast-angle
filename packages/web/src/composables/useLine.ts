import type { Ref } from 'vue'
import type { Point } from '~/composables/useLines'

export function useLine(lineVariables: ReturnType<typeof useLinearFnVariables>, coords: Ref<{ x1: number; x2: number } | undefined>) {
  return computed(() => {
    if (!coords.value || !lineVariables.value)
      return

    const { slope, intercept } = lineVariables.value
    const { x1, x2 } = coords.value

    return [[x1, slope * x1 + intercept], [x2, slope * x2 + intercept]] as [Point, Point]
  })
}

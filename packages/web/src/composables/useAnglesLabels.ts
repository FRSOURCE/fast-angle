import type { ComputedRef } from 'vue'
import type { useLinesIntersectionPosition } from '~/composables/useLinesIntersectionPosition'

interface AngleLabel { x: number; y: number; value: number }

export function useAnglesLabels(angle: ComputedRef<number>, intersectionPosition: ReturnType<typeof useLinesIntersectionPosition>, anglesBisectors: ReturnType<typeof useAnglesBisectors>) {
  const labels = ref<[AngleLabel, AngleLabel] | []>([])

  // throttled to not recalculate on drag
  watchThrottled([intersectionPosition, anglesBisectors, angle], () => {
    if (!intersectionPosition.value || !anglesBisectors.value || !angle.value)
      return labels.value = []

    const {
      acute: { slope: acuteSlope, intercept: acuteIntercept },
      obtuse: { slope: obtuseSlope, intercept: obtuseIntercept },
    } = anglesBisectors.value

    const distance = 70

    const acuteAngle = angle.value

    const acuteX = Math.cos(Math.atan(acuteSlope)) * (distance + (90 - acuteAngle) * 0.4) + intersectionPosition.value.x

    const obtuseAngle = 180 - acuteAngle
    const obtuseX = -Math.cos(Math.atan(obtuseSlope)) * (distance + (90 - obtuseAngle) * 0.4) + intersectionPosition.value.x

    labels.value = [{
      x: acuteX,
      y: acuteSlope * acuteX + acuteIntercept,
      value: acuteAngle,
    }, {
      x: obtuseX,
      y: obtuseSlope * obtuseX + obtuseIntercept,
      value: obtuseAngle,
    }]
  }, { throttle: 20, immediate: true })

  return labels
}

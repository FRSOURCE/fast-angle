import type { ComputedRef } from 'vue'
import type { useLinesIntersectionPosition } from '~/composables/useLinesIntersectionPosition'

export const useAnglesLabels = (
  angle: ComputedRef<number>,
  intersectionPosition: ReturnType<typeof useLinesIntersectionPosition>,
  anglesBisectors: ReturnType<typeof useAnglesBisectors>,
) =>
  computed(() => {
    if (!intersectionPosition.value || !anglesBisectors.value || !angle.value)
      return []

    const {
      acute: { slope: acuteSlope, intercept: acuteIntercept },
      obtuse: { slope: obtuseSlope, intercept: obtuseIntercept },
    } = anglesBisectors.value

    const distance = 70

    const acuteAngle = angle.value

    const acuteX = Math.cos(Math.atan(acuteSlope)) * (distance + (90 - acuteAngle) * 0.4) + intersectionPosition.value.x

    const obtuseAngle = 180 - acuteAngle
    const obtuseX = -Math.cos(Math.atan(obtuseSlope)) * (distance + (90 - obtuseAngle) * 0.4) + intersectionPosition.value.x

    return [{
      x: acuteX,
      y: acuteSlope * acuteX + acuteIntercept,
      value: acuteAngle,
    }, {
      x: obtuseX,
      y: obtuseSlope * obtuseX + obtuseIntercept,
      value: obtuseAngle,
    }]
  })

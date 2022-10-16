import type { Ref } from 'vue'
import { computed } from 'vue'
import type { Point, Points } from '~/composables/usePoints'

export const useAngle = (points: Ref<Points>) =>
  computed(() => {
    if (
      (points.value[0]?.length || 0) < 2
      || (points.value[1]?.length || 0) < 2
    ) return 0

    const [[[x11, y11], [x12, y12]], [[x21, y21], [x22, y22]]] = points.value as [[Point, Point], [Point, Point]]
    const dAx = x12 - x11
    const dAy = y12 - y11
    const dBx = x22 - x21
    const dBy = y22 - y21
    let angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy)

    if (angle < 0)
      angle *= -1

    return Math.round(angle * (180 / Math.PI) * 1000) / 1000
  })

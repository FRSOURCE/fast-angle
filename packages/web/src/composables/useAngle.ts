import type { Ref } from 'vue'
import { computed } from 'vue'
import type { Lines, Point } from '~/composables/useLines'

export function getAngle(lines: Lines) {
  const [[[x11, y11], [x12, y12]], [[x21, y21], [x22, y22]]] = lines as [[Point, Point], [Point, Point]]
  const dAx = x12 - x11
  const dAy = y12 - y11
  const dBx = x22 - x21
  const dBy = y22 - y21
  const angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy)

  return Math.abs(angle) * (180 / Math.PI)
}

export function useAngle(lines: Ref<Lines>) {
  return computed(() => {
    if (
      (lines.value[0]?.length || 0) < 2
      || (lines.value[1]?.length || 0) < 2
    ) return 0

    return getAngle(lines.value)
  })
}

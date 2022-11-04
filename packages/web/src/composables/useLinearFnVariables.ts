import type { Ref } from 'vue'
import { computed } from 'vue'
import type { Line } from '~/composables/useLines'

const getLinearFnVariables = useMemoize((
  x1?: number, y1?: number, x2?: number, y2?: number,
) => {
  if (!x1 || !y1 || !x2 || !y2)
    return

  if (x1 === x2)
    ++x1

  const slope = (y1 - y2) / (x1 - x2)
  const intercept = y2 - x2 * slope

  return { slope, intercept }
})

export const useLinearFnVariables = (points: Ref<Line>) =>
  computed(() =>
    getLinearFnVariables(...(points.value[0] || []), ...(points.value[1] || [])),
  )

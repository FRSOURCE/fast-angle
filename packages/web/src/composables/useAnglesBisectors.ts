import type { ComputedRef } from 'vue'
import type { Lines } from '~/composables/useLines'
import type { useLinesIntersectionPosition } from '~/composables/useLinesIntersectionPosition'

export function useAnglesBisectors(angle: ComputedRef<number>,
  intersectionPosition: ReturnType<typeof useLinesIntersectionPosition>,
  line1Variables: ReturnType<typeof useLinearFnVariables>,
  line2Variables: ReturnType<typeof useLinearFnVariables>) {
  return computed(() => {
    if (!intersectionPosition.value || !line1Variables.value || !line2Variables.value || !angle.value)
      return

    const line1Vars = line1Variables.value
    const line2Vars = line2Variables.value

    let slope1 = Math.tan((Math.atan(line1Vars.slope) + Math.atan(line2Vars.slope)) / 2)
    let slope2 = -1 / slope1
    let intercept1 = line1Vars.slope * intersectionPosition.value.x + line1Vars.intercept - slope1 * intersectionPosition.value.x
    let intercept2 = line1Vars.slope * intersectionPosition.value.x + line1Vars.intercept - slope2 * intersectionPosition.value.x

    const bisect1Angle = getAngle([
      [[0, line1Vars.intercept], [intersectionPosition.value.x, line1Vars.slope * intersectionPosition.value.x + line1Vars.intercept]],
      [[0, intercept1], [intersectionPosition.value.x, slope1 * intersectionPosition.value.x + intercept1]],
    ] as Lines) * 2

    if (bisect1Angle - 1 > angle.value || bisect1Angle + 1 < angle.value)
      ([slope1, intercept1, slope2, intercept2] = [slope2, intercept2, slope1, intercept1])

    return {
      acute: {
        slope: slope1,
        intercept: intercept1,
      },
      obtuse: {
        slope: slope2,
        intercept: intercept2,
      },
    }
  })
}

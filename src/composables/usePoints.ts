import type { Ref } from 'vue'
import { ref } from 'vue'

export type Point = [number, number]
export type Line = [Point?, Point?]
export type Points = Line[]

export const usePoints = ({ elementX, elementY }: { elementX: Ref<number>; elementY: Ref<number> }) => {
  const points = ref<Points>([])
  const step = ref(-1)

  const drawNextPoint = () => {
    switch (++step.value) {
      case 1:
        if (!points.value[0])
          return
        points.value[0] = [points.value[0][0], [elementX.value, elementY.value]]
        break
      case 2:
        points.value[1] = [[elementX.value, elementY.value] as Point]
        break
      case 3:
        if (!points.value[1])
          return
        points.value[1] = [points.value[1][0], [elementX.value, elementY.value]]
        break
      default:
        step.value = 0
        points.value = []
        points.value[0] = [[elementX.value, elementY.value]]
        break
    }
  }

  return {
    points,
    drawNextPoint,
  }
}

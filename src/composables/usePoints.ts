import type { Ref } from 'vue'
import { ref } from 'vue'

export type Point = [number, number]
export type Line = [Point?, Point?]
export type Points = Line[]

const MAX_STEP = 4

export const usePoints = ({ elementX, elementY }: { elementX: Ref<number>; elementY: Ref<number> }) => {
  const points = ref<Points>([])
  const step = ref(MAX_STEP - 1)

  const drawNextPoint = () => {
    if (++step.value >= MAX_STEP) {
      step.value = 0
      points.value = []
    }

    const pointNo = Math.floor(step.value / 2)
    if (step.value % 2) {
      if (points.value[pointNo])
        points.value[pointNo] = [points.value[pointNo][0], [elementX.value, elementY.value]]
    }
    else {
      points.value[pointNo] = [[elementX.value, elementY.value]]
    }
  }

  const { undo: stepUndo, redo: stepRedo, canUndo: stepCanUndo, canRedo: stepCanRedo } = useRefHistory(step)
  const { undo: pointsUndo, redo: pointsRedo, canUndo: pointsCanUndo, canRedo: pointsCanRedo } = useRefHistory(points, { deep: true })

  const undo = () => {
    pointsUndo()
    stepUndo()
  }
  const redo = () => {
    pointsRedo()
    stepRedo()
  }

  const keys = useMagicKeys()
  const ctrlZ = keys['Ctrl+Z']
  const shiftCtrlZ = keys['Shift+Ctrl+Z']

  whenever(ctrlZ, undo)
  whenever(shiftCtrlZ, redo)

  return {
    step,
    points,
    drawNextPoint,
    undo,
    redo,
    canUndo: computed(() => stepCanUndo.value && pointsCanUndo.value),
    canRedo: computed(() => stepCanRedo.value && pointsCanRedo.value),
  }
}

import { ref } from 'vue'

export type Point = [number, number]
export type Line = [Point?, Point?]
export type Lines = Line[]

const MAX_STEP = 4

export const useLines = createSharedComposable(() => {
  const lines = ref<Lines>([])
  const step = ref(MAX_STEP - 1)

  const drawNextPoint = ({ elementX, elementY }: { elementX: number; elementY: number }) => {
    if (++step.value >= MAX_STEP) {
      step.value = 0
      lines.value = []
    }

    const pointNo = Math.floor(step.value / 2)
    if (step.value % 2) {
      if (lines.value[pointNo])
        lines.value[pointNo] = [lines.value[pointNo][0], [elementX, elementY]]
    }
    else {
      lines.value[pointNo] = [[elementX, elementY]]
    }
  }

  const { undo: stepUndo, redo: stepRedo, canUndo: stepCanUndo, canRedo: stepCanRedo } = useRefHistory(step)
  const { undo: pointsUndo, redo: pointsRedo, canUndo: pointsCanUndo, canRedo: pointsCanRedo } = useRefHistory(lines, { deep: true })

  const undo = () => {
    pointsUndo()
    stepUndo()
  }
  const redo = () => {
    pointsRedo()
    stepRedo()
  }

  useMagicKeys({
    onEventFired(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey)
          redo()
        else undo()
      }
    },
  })

  return {
    step,
    lines,
    drawNextPoint,
    undo,
    redo,
    canUndo: computed(() => stepCanUndo.value && pointsCanUndo.value),
    canRedo: computed(() => stepCanRedo.value && pointsCanRedo.value),
  }
})

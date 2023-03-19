import { ref } from 'vue'

export type Point = [number, number]
export type Line = [Point?, Point?]
export type Lines = Line[]

const MAX_STEP = 4

export const useLines = createSharedComposable(() => {
  const internalLines = ref<Lines>([])
  const lines = ref<Lines>([])
  const step = ref(MAX_STEP - 1)
  let onUndo = () => {}
  let onRedo = () => {}

  watch(internalLines, (internalLines) => {
    lines.value = [...internalLines]
  }, { deep: true, flush: 'sync' })

  const drawNextPoint = (x: number, y: number) => {
    if (++step.value >= MAX_STEP) {
      step.value = 0
      internalLines.value = []
    }

    const pointNo = Math.floor(step.value / 2)
    if (step.value % 2) {
      const previousPoint = internalLines.value[pointNo][0]
      if (!previousPoint)
        return
      internalLines.value[pointNo] = [previousPoint, [x, y]]
    }
    else {
      internalLines.value[pointNo] = [[x, y]]
    }
  }

  const predictNextPoint = (x: number, y: number) => {
    const nextStep = step.value + 1 >= MAX_STEP ? 0 : step.value + 1
    const pointNo = Math.floor(nextStep / 2)

    if (nextStep % 2) {
      const previousPoint = lines.value[pointNo][0]
      if (!previousPoint)
        return
      lines.value[pointNo] = [previousPoint, [x, y]]
    }
    else {
      lines.value[pointNo] = [[x, y]]
    }
  }

  const { undo: stepUndo, redo: stepRedo, canUndo: stepCanUndo, canRedo: stepCanRedo } = useRefHistory(step)
  const { undo: pointsUndo, redo: pointsRedo, canUndo: pointsCanUndo, canRedo: pointsCanRedo } = useRefHistory(internalLines, { deep: true })

  const undo = () => {
    pointsUndo()
    onUndo()
    stepUndo()
  }
  const redo = () => {
    pointsRedo()
    onRedo()
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
    predictNextPoint,
    undo,
    redo,
    canUndo: computed(() => stepCanUndo.value && pointsCanUndo.value),
    canRedo: computed(() => stepCanRedo.value && pointsCanRedo.value),
    registerOnUndo: (newOnUndo: typeof onUndo) => onUndo = newOnUndo,
    registerOnRedo: (newOnRedo: typeof onRedo) => onRedo = newOnRedo,
  }
})

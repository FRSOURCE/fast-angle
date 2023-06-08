import { type MaybeComputedRef, type MaybeElementRef } from '@vueuse/core'
import { type GenericOptions, useDrag, usePinch, useWheel } from '@vueuse/gesture'

export function usePanzoom(elementRef: MaybeElementRef, options?: MaybeComputedRef<GenericOptions | undefined>) {
  const optionsRef = resolveRef(options)
  const enabled = computed(() => unref(optionsRef)?.enabled ?? true)
  const active = ref(false)
  const offset = ref<[number, number]>([0, 0])
  const zoomInternal = ref(1)
  const zoom = computed({
    set(v: number) {
      if (v > 10)
        zoomInternal.value = 10
      else if (v < 0.1)
        zoomInternal.value = 0.1
      else
        zoomInternal.value = v
      return zoomInternal.value
    },
    get() {
      return zoomInternal.value
    },
  })
  const origin = ref<[number, number]>([0, 0])
  const boundingRect = computed(() => unrefElement(elementRef)?.getBoundingClientRect())

  const mapZoomValue = (zoomValue: number) => {
    zoomValue = (zoomValue + 1800) / 1800
    if (zoomValue <= 0)
      return 0.01
    return zoomValue
  }

  const updateActiveState = ({ wheeling, dragging, pinching, intentional, enabled, touches, ctrlKey, event }: { wheeling: boolean; dragging: boolean; pinching: boolean; intentional: boolean; enabled: boolean; touches: number; ctrlKey: boolean; event: PointerEvent }) => {
    const nextActiveValue = !enabled || !intentional
      ? false
      : (dragging && (touches === 2 || event.pointerType === 'mouse')) || pinching || (wheeling && !ctrlKey)

    if (active.value)
      requestAnimationFrame(() => active.value = nextActiveValue)
    else
      active.value = nextActiveValue

    return nextActiveValue
  }

  useDrag(({ wheeling, dragging, pinching, touches, intentional, delta, metaKey, ctrlKey, altKey, event }) => {
    if (!updateActiveState({ wheeling, dragging, pinching, intentional, enabled: enabled.value, metaKey, ctrlKey, altKey, touches, event }))
      return

    offset.value[0] += delta[0]
    offset.value[1] += delta[1]
  }, {
    domTarget: elementRef,
    filterTaps: true,
  })

  useWheel(({ event, delta, wheeling, dragging, pinching, touches, intentional, metaKey, ctrlKey, altKey }) => {
    if (!updateActiveState({ dragging, pinching, wheeling, intentional, enabled: enabled.value, touches, metaKey, ctrlKey, altKey, event }))
      return

    event.preventDefault()

    offset.value[0] += delta[0]
    offset.value[1] += delta[1]
  }, {
    domTarget: elementRef,
    eventOptions: {
      passive: false,
    },
  })

  usePinch(({ offset: [zoomValue], origin: originValue, pinching, dragging, wheeling, metaKey, ctrlKey, altKey, touches, intentional, event }) => {
    if (!updateActiveState({ dragging, pinching, wheeling, intentional, enabled: enabled.value, touches, metaKey, altKey, ctrlKey, event }))
      return

    const oldZoomValue = zoom.value

    zoom.value = mapZoomValue(zoomValue)

    if (boundingRect.value) {
      originValue[0] -= boundingRect.value.x
      originValue[1] -= boundingRect.value.y

      offset.value[0] -= (originValue[0] - boundingRect.value.width / 2) * (zoom.value - oldZoomValue)
      offset.value[1] -= (originValue[1] - boundingRect.value.height / 2) * (zoom.value - oldZoomValue)
    }

    offset.value[0] -= originValue[0] - origin.value[0]
    offset.value[1] -= originValue[1] - origin.value[1]
    origin.value = originValue
  }, {
    domTarget: elementRef,
    eventOptions: {
      passive: false,
    },
    distanceBounds: () => ({
      min: -1800,
      max: 16200,
    }),
  })

  return {
    offset: computed(() => [
      offset.value[0] + origin.value[0],
      offset.value[1] + origin.value[1],
    ]),
    zoom,
    transformOrigin: origin,
    active,
  }
}

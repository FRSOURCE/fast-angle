import type { UnwrapRef } from 'vue';

export enum OVERFLOW_LABELS_DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export const useOutOfBoundLabels = createSharedComposable(() => {
  const outOfBoundLabels = ref<
    | {
        y: number;
        direction:
          | OVERFLOW_LABELS_DIRECTION.LEFT
          | OVERFLOW_LABELS_DIRECTION.RIGHT;
      }
    | {
        x: number;
        direction:
          | OVERFLOW_LABELS_DIRECTION.UP
          | OVERFLOW_LABELS_DIRECTION.DOWN;
      }
    | false
  >(false);

  return {
    outOfBoundLabels,
    setOutBoundLabels(
      labels: UnwrapRef<ReturnType<typeof useAnglesLabels>>,
      svgSize: { width: number; height: number },
      svgOffset: { x: number; y: number },
    ) {
      const labelMargins = { x: 30, y: 4.5 };
      const outOfBoundsLabel = labels.find(({ x, y }) => {
        x -= svgOffset.x;
        y -= svgOffset.y;
        return (
          x < labelMargins.x ||
          x > svgSize.width - labelMargins.x ||
          y < labelMargins.y + 3 ||
          y > svgSize.height - labelMargins.y
        );
      });

      if (!outOfBoundsLabel) return (outOfBoundLabels.value = false);

      let { x, y } = outOfBoundsLabel;
      x -= svgOffset.x;
      y -= svgOffset.y;

      if (x < labelMargins.x)
        return (outOfBoundLabels.value = {
          direction: OVERFLOW_LABELS_DIRECTION.LEFT,
          y,
        });
      if (x > svgSize.width - labelMargins.x)
        return (outOfBoundLabels.value = {
          direction: OVERFLOW_LABELS_DIRECTION.RIGHT,
          y,
        });

      if (y < labelMargins.y + 3)
        return (outOfBoundLabels.value = {
          direction: OVERFLOW_LABELS_DIRECTION.UP,
          x,
        });

      return (outOfBoundLabels.value = {
        direction: OVERFLOW_LABELS_DIRECTION.DOWN,
        x,
      });
    },
  };
});

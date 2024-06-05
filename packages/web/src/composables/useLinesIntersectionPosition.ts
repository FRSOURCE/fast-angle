export function useLinesIntersectionPosition(
  line1Variables: ReturnType<typeof useLinearFnVariables>,
  line2Variables: ReturnType<typeof useLinearFnVariables>,
) {
  return computed(() => {
    if (!line1Variables.value || !line2Variables.value) return;

    const { slope: slope1, intercept: intercept1 } = line1Variables.value;
    const { slope: slope2, intercept: intercept2 } = line2Variables.value;

    let x: number;
    if (slope1 === slope2) x = intercept2 - intercept1;
    else x = (intercept1 - intercept2) / (slope2 - slope1);

    return { x, y: slope1 * x + intercept1 };
  });
}

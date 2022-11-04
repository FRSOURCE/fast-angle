import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const breakpoints = useBreakpoints({
  ...breakpointsTailwind,
  xs: 480,
})

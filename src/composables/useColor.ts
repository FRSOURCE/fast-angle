import type { Ref } from 'vue'
import stc from 'string-to-color'

export const useColor = (text: Ref<unknown>) => computed(() => stc(JSON.stringify(text.value)))

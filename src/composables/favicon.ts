export const favicon = computed(() => `${import.meta.env.PROD ? '/fast-angle/' : '/'}${preferredDark.value ? 'favicon-dark.svg' : 'favicon.svg'}`)

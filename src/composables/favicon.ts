export const favicon = computed(() => `${import.meta.env.PROD ? '/fast-angle/' : '/'}${isDark.value ? 'favicon-dark.svg' : 'favicon.svg'}`)

export const favicon = computed(
  () => `${basePath}${isDark.value ? 'favicon-dark.svg' : 'favicon.svg'}`,
);

export function useUriLocale() {
  const currentRoute = useRoute()
  return computed(() => currentRoute.path.split('/')[1])
}

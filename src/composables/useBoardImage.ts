export const useBoardImage = createSharedComposable(() => {
  const imageSrc = ref('')
  const processFiles = (files: File[] | null) => {
    if (files?.[0] instanceof File)
      imageSrc.value = URL.createObjectURL(files[0])
  }

  return { imageSrc, processFiles }
})

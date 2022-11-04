export const useBoardImage = createSharedComposable(() => {
  const imageSrc = ref('')
  const processFiles = (files: File[] | null) => {
    if (!(files?.[0] instanceof File))
      return

    const FR = new FileReader()

    FR.addEventListener('load', (evt) => {
      if (evt.target?.result)
        imageSrc.value = evt.target.result.toString()
    })

    FR.readAsDataURL(files[0])
  }

  return { imageSrc, processFiles }
})

export const useBoardImage = createSharedComposable(() => {
  const src = ref('')
  const width = ref(0)
  const height = ref(0)
  const processFiles = (files: File[] | null) => {
    if (!(files?.[0] instanceof File))
      return

    const FR = new FileReader()

    FR.addEventListener('load', (evt) => {
      if (evt.target?.result) {
        const imageObj = new Image()
        imageObj.onload = () => {
          src.value = imageObj.src
          width.value = imageObj.width
          height.value = imageObj.height
        }
        imageObj.src = evt.target.result.toString()
      }
    })

    FR.readAsDataURL(files[0])
  }

  return { src, width, height, processFiles }
})

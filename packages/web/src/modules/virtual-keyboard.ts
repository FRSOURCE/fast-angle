import { type UserModule } from '~/types'

// makes the keyboard show as an overlay in Android Chrome
// https://developer.chrome.com/docs/web-platform/virtual-keyboard/#opting-in-to-the-new-virtual-keyboard-behavior
export const install: UserModule = async ({ isClient }) => {
  if (!isClient)
    return

  if ('virtualKeyboard' in navigator)
    (navigator as any).virtualKeyboard.overlaysContent = true
}

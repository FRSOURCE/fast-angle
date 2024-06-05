import type { UserModule } from '~/types';

const isVirtualKeyboardApiSupported = (
  navigator: Navigator,
): navigator is Navigator & { virtualKeyboard: { overlaysContent: boolean } } =>
  'virtualKeyboard' in navigator;

// makes the keyboard show as an overlay in Android Chrome
// https://developer.chrome.com/docs/web-platform/virtual-keyboard/#opting-in-to-the-new-virtual-keyboard-behavior
export const install: UserModule = async ({ isClient }) => {
  if (!isClient) return;

  if (isVirtualKeyboardApiSupported(navigator))
    navigator.virtualKeyboard.overlaysContent = true;
};

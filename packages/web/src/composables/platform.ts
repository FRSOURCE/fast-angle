// The iOS app wrapper identifies itself via the "app-platform" cookie
// (see packages/ios/Fast Angle/Settings.swift) and a "PWAShell" UA suffix.
// Donation links must be hidden there per App Store guideline 3.1.1.
export const isIosAppStore = ref(false);

if (typeof document !== 'undefined') {
  isIosAppStore.value =
    document.cookie.includes('app-platform=iOS App Store') ||
    navigator.userAgent.includes('PWAShell');
}

import type { UserModule } from '~/types';

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = async ({ isClient }) => {
  if (!isClient) return;

  const { registerSW } = await import('virtual:pwa-register');
  registerSW({ immediate: true });
};

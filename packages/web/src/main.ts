import { ViteSSG } from 'vite-ssg';
import { setupLayouts } from 'virtual:generated-layouts';
import './styles/main.scss';
import App from './App.vue';
import type { UserModule } from './types';
import generatedRoutes from '~pages';

const routes = setupLayouts(generatedRoutes);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(App, { routes, base: basePath }, (ctx) => {
  // install all modules under `modules/`
  Object.values(
    import.meta.glob<{ install: UserModule }>('./modules/*.ts', {
      eager: true,
    }),
  ).forEach((i) => i.install?.(ctx));
});

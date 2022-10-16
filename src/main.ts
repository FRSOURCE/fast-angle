import { ViteSSG } from 'vite-ssg/single-page'
import Previewer from 'virtual:vue-component-preview'
import App from './App.vue'
import type { UserModule } from './types'

import './styles/main.scss'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
    ctx.app.use(Previewer)
  },
)

import type { ViteSSGContext } from 'vite-ssg/single-page'

export type UserModule = (ctx: ViteSSGContext<true>) => void

import { type ViteSSGContext } from 'vite-ssg/single-page'

export type UserModule = (ctx: ViteSSGContext<false>) => void

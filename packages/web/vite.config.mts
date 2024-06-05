import path from 'node:path';
import process from 'node:process';
import { promises as fs } from 'node:fs';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import generateSitemap from 'vite-ssg-sitemap';
import Layouts from 'vite-plugin-vue-layouts';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Markdown from 'unplugin-vue-markdown/vite';
import { VitePWA } from 'vite-plugin-pwa';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import Inspect from 'vite-plugin-inspect';
import LinkAttributes from 'markdown-it-link-attributes';
import Shiki from '@shikijs/markdown-it';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import incstr from 'incstr';

const isProd = process.env.NODE_ENV === 'production';
const prefix = 'f_';
const nextClassName = incstr.idGenerator({
  alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789_-',
  prefix,
});
const classNameMap = {} as Record<string, string>;

function productionClassGenerator(name: string, filename: string) {
  const id = `${filename}_>_${name}`;
  let classname = classNameMap[id];

  if (!classname) {
    classname = nextClassName();

    classNameMap[id] = classname;
  }

  return classname;
}

const availableLocalesPromise = new Promise<string[]>((resolve) => {
  fs.readdir('./locales').then((files) => {
    resolve(
      files
        .filter((file) =>
          ['.yml', '.json', '.yaml'].includes(path.extname(file).toLowerCase()),
        )
        .map((file) => file.substring(0, file.lastIndexOf('.'))),
    );
  });
});

const baseArg = process.argv.find((v) => v.includes('--base='));
const base = baseArg ? baseArg.replace('--base=', '') : '/';

export default defineConfig({
  base,
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['hgroup'].includes(tag),
        },
      },
    }),

    {
      name: 'Remove unused CSS code',
      transform(code, id) {
        if (id.includes('main.scss')) {
          return {
            code: [
              '--icon-close',
              '--icon-date',
              '--icon-search',
              '--icon-time',
            ].reduce((p, cssVar) => {
              return p.replace(
                new RegExp(`${cssVar.replaceAll('-', '\\-')}:.+?;`),
                '',
              );
            }, code),
          };
        }
      },
    },

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
      async onRoutesGenerated(routes) {
        const availableLocales = await availableLocalesPromise;

        return routes.flatMap((route) => {
          if (route.name === 'all') {
            return [
              {
                ...route,
                name: '404',
                path: '/404',
              },
              route,
            ];
          }

          if (route.name === 'lang') {
            return availableLocales.map((locale) => ({
              ...route,
              name: `lang-${locale}`,
              path: `/${locale}`,
            }));
          }

          if (route.name.substring(0, 5) === 'lang-') {
            const pageName = route.name.substring(5);
            return availableLocales.map((locale) => ({
              ...route,
              name: `lang-${locale}-${pageName}`,
              path: `/${locale}/${pageName}`,
            }));
          }

          return route;
        });
      },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'vue/macros',
        '@vueuse/head',
        '@vueuse/math',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables'],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
      resolvers: [
        IconsResolver({
          customCollections: ['custom'],
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-vue-markdown
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: 'prose prose-sm m-auto text-left',
      headEnabled: true,
      async markdownItSetup(md) {
        // https://prismjs.com/
        md.use(
          await Shiki({
            themes: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
          }),
        );
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        });
      },
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['*.svg', '*.png'],
      manifest: {
        id: '/fast-angle/',
        name: 'Fast Angle',
        short_name: 'Fast Angle',
        description:
          'Simple online protractor - measure any angle directly on your image!',
        theme_color: '#0189e9',
        background_color: '#11191f',
        orientation: 'natural',
        display: 'standalone',
        display_override: [
          'window-controls-overlay',
          'standalone',
          'fullscreen',
          'minimal-ui',
          'browser',
        ],
        shortcuts: [],
        screenshots: [
          {
            src: '/fast-angle/fast-angle-og-image.jpg',
            sizes: '1200x630',
            type: 'image/jpeg',
            platform: 'wide',
            label:
              'Example of the angle measurement on top of an image in FastAngle app.',
          },
        ],
        icons: [
          {
            src: '/fast-angle/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/fast-angle/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/fast-angle/pwa-monochrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'monochrome',
          },
          {
            src: '/fast-angle/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/fast-angle/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        categories: ['graphics', 'utilities'],
        // @ts-expect-error VitePWA is missing some properties in their typings
        dir: 'auto',
        launch_handler: {
          client_mode: ['navigate-existing', 'auto'],
        },
        handle_links: 'auto',
        edge_side_panel: {
          preferred_width: 400,
        },
      },
    }),

    // https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    Icons({
      compiler: 'vue3',
      customCollections: {
        custom: FileSystemIconLoader('./src/assets/icons'),
      },
    }),

    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3333/__inspect/ to see the inspector
    Inspect(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },

  css: {
    modules: {
      ...(isProd ? { generateScopedName: productionClassGenerator } : {}),
    },
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      publicPath: '/fast-angle/',
    },
    onFinished() {
      generateSitemap({
        hostname: 'https://www.frsource.org/fast-angle/',
        exclude: ['/'],
      });
    },
  },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/, 'color-hash'],
  },
});

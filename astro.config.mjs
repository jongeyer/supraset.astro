// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import partytown from '@astrojs/partytown'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { satteri } from '@astrojs/markdown-satteri'
import mixBlocksPlugin from './src/utils/mix-blocks-plugin.ts'

// https://astro.build/config
export default defineConfig({
  site: 'https://supraset.com',
  trailingSlash: 'always',
  compressHTML: true,
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [partytown(), sitemap()],
  markdown: {
    // Marks the text blocks the personalizer can rewrite
    processor: satteri({ hastPlugins: [mixBlocksPlugin] }),
  },
  // Downloaded at build time and served from the site
  fonts: [
    {
      name: 'Lexend',
      cssVariable: '--font-lexend',
      provider: fontProviders.google(),
      weights: [200, 400, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})

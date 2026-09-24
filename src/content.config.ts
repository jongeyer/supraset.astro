import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/pages' }),
})
export const collections = {
  pages: pagesCollection,
}

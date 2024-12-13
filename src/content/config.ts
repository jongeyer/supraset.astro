import { defineCollection } from 'astro:content';

const pagesCollection = defineCollection({ /* ... */ })
export const collections = {
  'pages': pagesCollection,
};
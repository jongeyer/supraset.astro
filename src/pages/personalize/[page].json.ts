// The blocks each personalizable page offers, read by the personalize function
import type { APIRoute, GetStaticPaths } from 'astro'
import { getEntry } from 'astro:content'
import { mixPages, type MixBlock } from '@/utils/personalize'

export const getStaticPaths = (() =>
  mixPages.map(page => ({ params: { page } }))) satisfies GetStaticPaths

export const GET: APIRoute = async ({ params }) => {
  const entry = await getEntry('pages', params.page as string)
  // Recorded by the mix-blocks Markdown plugin
  const frontmatter = entry?.rendered?.metadata?.frontmatter as
    { mixBlocks?: MixBlock[] } | undefined
  const blocks = frontmatter?.mixBlocks
  if (!blocks?.length) throw new Error(`No mix blocks for ${params.page}`)
  return Response.json({ blocks })
}

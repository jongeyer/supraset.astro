// Sätteri hast plugin: tags each text block of rendered Markdown with
// `data-mix="<id>"` and records its inline HTML as `mixBlocks` in the entry's
// frontmatter, so the page and the personalize function agree on the blocks.
import type { Element, ElementContent } from 'hast'
import { toHtml } from 'hast-util-to-html'
import type { MixBlock } from './personalize'

const blockTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li']
const inlineTags = new Set(['a', 'strong', 'em', 'code', 'br'])

const isInline = (node: ElementContent): boolean =>
  node.type !== 'element' ||
  (inlineTags.has(node.tagName) && node.children.every(isInline))

interface VisitContext {
  data: { astro?: { frontmatter: Record<string, unknown> } }
  setProperty(node: Element, key: string, value: unknown): void
}

export default function mixBlocksPlugin() {
  const blocks: MixBlock[] = []
  return {
    name: 'mix-blocks',
    element: {
      filter: blockTags,
      visit(node: Element, ctx: VisitContext) {
        // A block holding other blocks (a loose list item) isn't one itself
        if (!node.children.every(isInline)) return

        const id = String(blocks.length)
        ctx.setProperty(node, 'data-mix', id)
        blocks.push({ id, html: toHtml(node.children).trim() })
        if (ctx.data.astro) ctx.data.astro.frontmatter.mixBlocks = blocks
      },
    },
  }
}

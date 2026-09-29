import type { Element, ElementContent } from 'hast'
import { describe, expect, it } from 'vitest'
import mixBlocksPlugin from './mix-blocks-plugin'

const text = (value: string): ElementContent => ({ type: 'text', value })
const el = (tagName: string, ...children: ElementContent[]): Element => ({
  type: 'element',
  tagName,
  properties: {},
  children,
})

// Runs the plugin over nodes in document order, as Sätteri's visitor does
function run(nodes: Element[]) {
  const plugin = mixBlocksPlugin()
  const astro = { frontmatter: {} as Record<string, unknown> }
  const ids = new Map<Element, unknown>()
  const ctx = {
    data: { astro },
    setProperty: (node: Element, _key: string, value: unknown) =>
      ids.set(node, value),
  }
  nodes.forEach(node => plugin.element.visit(node, ctx))
  return { blocks: astro.frontmatter.mixBlocks, ids }
}

describe('mixBlocksPlugin', () => {
  it('numbers blocks in order and records their inline HTML', () => {
    const heading = el('h1', text('Work'))
    const para = el(
      'p',
      text('See my '),
      el('a', el('strong', text('profile'))),
      text('.')
    )
    const item = el('li', text('Tags: '), el('code', text('d3')))
    const { blocks, ids } = run([heading, para, item])

    expect(blocks).toEqual([
      { id: '0', html: 'Work' },
      { id: '1', html: 'See my <a><strong>profile</strong></a>.' },
      { id: '2', html: 'Tags: <code>d3</code>' },
    ])
    expect([ids.get(heading), ids.get(para), ids.get(item)]).toEqual([
      '0',
      '1',
      '2',
    ])
  })

  it('skips list items that hold other blocks', () => {
    const inner = el('p', text('Loose item'))
    const loose = el('li', inner)
    const nested = el('li', text('Parent'), el('ul', el('li', text('Child'))))
    const { blocks, ids } = run([loose, inner, nested])

    expect(blocks).toEqual([{ id: '0', html: 'Loose item' }])
    expect(ids.has(loose)).toBe(false)
    expect(ids.has(nested)).toBe(false)
  })
})

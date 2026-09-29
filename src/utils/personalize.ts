// Shared by the Personalizer component and the personalize Netlify function.
// The server only rewrites known pages in known styles; clients name them by id.

/** A run of inline HTML from one Markdown block (heading, paragraph, list item). */
export interface MixBlock {
  id: string
  html: string
}

export const mixPages = ['about', 'work'] as const
export type MixPage = (typeof mixPages)[number]

export const mixStyles = {
  funny: { label: 'Make it funny', temperature: 0.9 },
  dramatic: { label: 'Make it dramatic', temperature: 0.9 },
  poetic: { label: 'Make it poetic', temperature: 1 },
  romantic: { label: 'Make it romantic', temperature: 0.9 },
  silly: { label: 'Make it silly', temperature: 1.1 },
  professional: { label: 'Make it professional', temperature: 0.4 },
  spooky: { label: 'Make it spooky', temperature: 0.9 },
} as const
export type MixStyle = keyof typeof mixStyles

export const isMixPage = (value: unknown): value is MixPage =>
  mixPages.includes(value as MixPage)

export const isMixStyle = (value: unknown): value is MixStyle =>
  typeof value === 'string' && Object.hasOwn(mixStyles, value)

/** Structured output schema: the model returns every block, by id. */
export const mixResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['blocks'],
  properties: {
    blocks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'html'],
        properties: {
          id: { type: 'string' },
          html: { type: 'string' },
        },
      },
    },
  },
}

/**
 * Pairs rewritten blocks with the expected ones. Returns them in the expected
 * order, or null unless every expected id comes back exactly once with
 * non-empty text and nothing else is added.
 */
export function matchBlocks(
  expected: readonly MixBlock[],
  output: unknown
): MixBlock[] | null {
  const blocks = (output as { blocks?: unknown } | null)?.blocks
  if (!Array.isArray(blocks) || blocks.length !== expected.length) return null

  const byId = new Map<string, string>()
  for (const block of blocks) {
    const { id, html } = (block ?? {}) as Partial<MixBlock>
    if (typeof id !== 'string' || typeof html !== 'string') return null
    if (!html.trim() || byId.has(id)) return null
    byId.set(id, html)
  }

  const matched: MixBlock[] = []
  for (const { id } of expected) {
    const html = byId.get(id)
    if (html === undefined) return null
    matched.push({ id, html })
  }
  return matched
}

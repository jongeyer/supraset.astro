// Rewrites a known page in a known style. Clients send only ids: the text comes
// from the page's own blocks, published at build time as /personalize/<page>.json
import {
  isMixPage,
  isMixStyle,
  matchBlocks,
  mixResponseSchema,
  mixStyles,
} from '../../src/utils/personalize.ts'

const model = 'gpt-6-luna'
const timeoutMs = 25_000

const systemPrompt = `You are a content personalizer. Rewrite each block of the page in the requested style.

Each block is a fragment of inline HTML with an id. Return every block exactly once, with the same id, in the same order.
- Keep the meaning and roughly the length of each block, but change its style, tone, and word choice.
- Keep all proper nouns, names, dates, and numbers the same. Do not add or remove information.
- Keep each <a href="..."> link with its exact href, around words with the same meaning.
- Keep <code> contents exactly as they are. Use only <a>, <strong>, <em>, <code>, and <br> tags.`

const json = (status, body) => Response.json(body, { status })

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { page, style } = await req.json().catch(() => ({}))
  if (!isMixPage(page) || !isMixStyle(style)) {
    return json(400, { error: 'Unknown page or style' })
  }

  try {
    const source = await fetch(new URL(`/personalize/${page}.json`, req.url))
    if (!source.ok) throw new Error(`Blocks for ${page}: ${source.status}`)
    const { blocks } = await source.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        // No reasoning: fast replies, and temperature is only honoured without it
        reasoning_effort: 'none',
        temperature: mixStyles[style].temperature,
        max_completion_tokens: 4000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'blocks',
            strict: true,
            schema: mixResponseSchema,
          },
        },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: JSON.stringify({ style: mixStyles[style].label, blocks }),
          },
        ],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })

    const data = await response.json()

    // OpenAI reports failures (quota, bad key, retired model) in `data.error`
    const choice = data.choices?.[0]
    if (!response.ok || !choice) {
      const { code, type, message } = data.error ?? {}
      console.error(
        'OpenAI request failed:',
        response.status,
        code ?? type,
        message
      )
      return json(502, { error: 'Personalization service unavailable' })
    }

    // A reply cut off by the token limit, or with blocks missing, is unusable
    const matched =
      choice.finish_reason === 'stop' &&
      matchBlocks(blocks, JSON.parse(choice.message.content))
    if (!matched) {
      console.error(
        'OpenAI reply did not match the page:',
        choice.finish_reason
      )
      return json(502, { error: 'Personalization came back incomplete' })
    }

    return json(200, { blocks: matched })
  } catch (error) {
    console.error('Error:', error)
    return json(500, { error: 'Failed to process request' })
  }
}

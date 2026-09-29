import type { APIRoute } from 'astro'

/**
 * Search engines, answer engines and user-initiated AI agents may read the
 * site; crawlers that collect content for AI model training may not. Each
 * blocked agent is its vendor's documented training-only crawler, separate
 * from that vendor's search and user agents. Google-Extended stays allowed:
 * it also controls Gemini grounding, and blocking it would stop Gemini from
 * citing the site.
 */
const trainingCrawlers = [
  'GPTBot', // OpenAI
  'ClaudeBot', // Anthropic
  'Applebot-Extended', // Apple
  'Meta-ExternalAgent', // Meta
  'CCBot', // Common Crawl, a common source of training datasets
]

const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

${trainingCrawlers.map(agent => `User-agent: ${agent}`).join('\n')}
Disallow: /

Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site)
  return new Response(getRobotsTxt(sitemapURL))
}

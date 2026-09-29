// Turns a rewritten block's inline HTML into safe DOM. Only a few inline tags
// survive, rebuilt without attributes; a link keeps its href only when the
// original block linked to the same place. Everything else is reduced to text.
const keptTags = new Set(['strong', 'em', 'code', 'br'])
const droppedTags = new Set(['script', 'style', 'template', 'iframe', 'object'])

function parse(html: string): DocumentFragment {
  // Template content is inert: no scripts run and nothing loads
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content
}

function rebuild(from: Node, into: Node, hrefs: Set<string>) {
  for (const node of Array.from(from.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      into.appendChild(document.createTextNode(node.textContent ?? ''))
      continue
    }
    if (!(node instanceof Element)) continue

    const tag = node.tagName.toLowerCase()
    if (droppedTags.has(tag)) continue

    const href = tag === 'a' ? node.getAttribute('href') : null
    let target: Node = into
    if (href !== null && hrefs.has(href)) {
      const link = document.createElement('a')
      link.setAttribute('href', href)
      target = into.appendChild(link)
    } else if (keptTags.has(tag)) {
      target = into.appendChild(document.createElement(tag))
    }
    rebuild(node, target, hrefs)
  }
}

export function sanitizeInline(
  html: string,
  original: string
): DocumentFragment {
  const hrefs = new Set(
    Array.from(parse(original).querySelectorAll('a[href]'), a =>
      a.getAttribute('href')!
    )
  )
  const safe = document.createDocumentFragment()
  rebuild(parse(html), safe, hrefs)
  return safe
}

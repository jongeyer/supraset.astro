// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { sanitizeInline } from './mix-html'

const original =
  'See my <a href="https://example.com/me"><strong>profile</strong></a> - <code>Vue</code>'

const clean = (html: string) => {
  const box = document.createElement('div')
  box.append(sanitizeInline(html, original))
  return box.innerHTML
}

describe('sanitizeInline', () => {
  it('keeps inline formatting and the original links', () => {
    const html =
      'Gaze upon my <a href="https://example.com/me"><strong>legend</strong></a> - <code>Vue</code>, <em>truly</em>'
    expect(clean(html)).toBe(html)
  })

  it('unwraps links the original block did not have', () => {
    expect(clean('Visit <a href="https://evil.example">here</a>')).toBe(
      'Visit here'
    )
  })

  it('strips attributes from kept tags', () => {
    expect(
      clean(
        '<strong class="x" onclick="alert(1)">Hi</strong> <a href="https://example.com/me" onmouseover="alert(1)" target="_top">me</a>'
      )
    ).toBe('<strong>Hi</strong> <a href="https://example.com/me">me</a>')
  })

  it('drops scripts and reduces other tags to their text', () => {
    expect(
      clean(
        'A<script>alert(1)</script> <img src=x onerror="alert(1)"><span>B</span> <div><p>C</p></div>'
      )
    ).toBe('A B C')
  })

  it('treats markup-like text as text', () => {
    expect(clean('1 &lt; 2 &amp;&amp; <b>bold</b>')).toBe(
      '1 &lt; 2 &amp;&amp; bold'
    )
  })
})

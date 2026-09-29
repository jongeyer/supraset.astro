import { describe, expect, it } from 'vitest'
import { isMixPage, isMixStyle, matchBlocks } from './personalize'

const expected = [
  { id: '0', html: 'Work' },
  { id: '1', html: 'See my <a href="https://example.com">profile</a>.' },
]

describe('matchBlocks', () => {
  it('returns rewritten blocks in page order', () => {
    const output = {
      blocks: [
        { id: '1', html: 'Behold my <a href="https://example.com">saga</a>!' },
        { id: '0', html: 'Toil' },
      ],
    }
    expect(matchBlocks(expected, output)).toEqual([
      { id: '0', html: 'Toil' },
      { id: '1', html: 'Behold my <a href="https://example.com">saga</a>!' },
    ])
  })

  it.each([
    ['a missing block', { blocks: [{ id: '0', html: 'Toil' }] }],
    [
      'an extra block',
      {
        blocks: [
          { id: '0', html: 'Toil' },
          { id: '1', html: 'Saga' },
          { id: '2', html: 'Bonus' },
        ],
      },
    ],
    [
      'a duplicated id',
      {
        blocks: [
          { id: '0', html: 'Toil' },
          { id: '0', html: 'Again' },
        ],
      },
    ],
    [
      'an unknown id',
      {
        blocks: [
          { id: '0', html: 'Toil' },
          { id: '7', html: 'Saga' },
        ],
      },
    ],
    [
      'an empty block',
      {
        blocks: [
          { id: '0', html: 'Toil' },
          { id: '1', html: '  ' },
        ],
      },
    ],
    [
      'a non-string field',
      {
        blocks: [
          { id: '0', html: 'Toil' },
          { id: 1, html: 'Saga' },
        ],
      },
    ],
    ['no blocks array', { text: 'Toil ||| Saga' }],
    ['null', null],
  ])('rejects %s', (_, output) => {
    expect(matchBlocks(expected, output)).toBeNull()
  })
})

describe('request ids', () => {
  it('accepts known pages and styles only', () => {
    expect(isMixPage('about')).toBe(true)
    expect(isMixPage('admin')).toBe(false)
    expect(isMixStyle('spooky')).toBe(true)
    expect(isMixStyle('Make it spooky')).toBe(false)
  })

  it('does not treat inherited object keys as styles', () => {
    expect(isMixStyle('toString')).toBe(false)
    expect(isMixStyle('__proto__')).toBe(false)
  })
})

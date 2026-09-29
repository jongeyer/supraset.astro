// Lucide icons as data for morphicons, looked up by export name
import * as lucide from 'lucide'
import type { IconNode } from 'morphicons/astro'

export type LucideName = {
  [K in keyof typeof lucide]: (typeof lucide)[K] extends IconNode ? K : never
}[keyof typeof lucide]

export const lucideIcons = (names: readonly LucideName[]): IconNode[] =>
  names.map(name => lucide[name] as IconNode)

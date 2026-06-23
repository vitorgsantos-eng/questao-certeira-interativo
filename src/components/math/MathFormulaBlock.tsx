'use client'

import katex from 'katex'
import { cn } from '@/lib/utils'

interface MathFormulaBlockProps {
  latex: string
  className?: string
}

/**
 * Renders a single KaTeX formula in display mode (centered, larger, block-level).
 * Use for standalone important formulas — not for inline math or formula lists.
 *
 * dangerouslySetInnerHTML is safe: LaTeX source comes exclusively from
 * our controlled content JSON, never from user input.
 */
export function MathFormulaBlock({ latex, className }: MathFormulaBlockProps) {
  try {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      output: 'html',
      displayMode: true,
      strict: false,
    })
    return (
      <div
        className={cn('overflow-x-auto py-1 text-center', className)}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  } catch {
    return <span className="font-mono text-red-700">{latex}</span>
  }
}

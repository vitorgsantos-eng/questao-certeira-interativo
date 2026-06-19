'use client'

import { Fragment } from 'react'
import katex from 'katex'
import { cn } from '@/lib/utils'

// Pipe separator used in highlight blocks to list multiple formulas
const PIPE_SEP = '   |   '

// Legacy: unicode chars that appear in math expressions (fallback for un-migrated text)
const HAS_MATH_UNICODE = /[²³√·×÷→≈°α−]/
const SENTENCE_BOUNDARY = /((?:[.!?]\s+))/

interface MathTextProps {
  text: string
  className?: string
}

type Segment = { type: 'text' | 'math'; content: string }

/**
 * Split text at $...$ delimiters into alternating text/math segments.
 * Segments with type 'math' should be rendered with KaTeX.
 */
function parseSegments(text: string): Segment[] {
  const parts = text.split(/\$([^$]+)\$/)
  return parts
    .map((content, i) => ({ type: (i % 2 === 0 ? 'text' : 'math') as 'text' | 'math', content }))
    .filter((s) => s.content !== '')
}

/**
 * Render a single KaTeX expression. Falls back to raw text on parse error.
 * dangerouslySetInnerHTML is safe here: the LaTeX source comes exclusively from
 * our controlled content JSON — it is never derived from user input.
 */
function KaTeXSpan({ latex }: { latex: string }) {
  let html: string
  try {
    html = katex.renderToString(latex, {
      throwOnError: false,
      output: 'html',
      displayMode: false,
      strict: false,
    })
  } catch {
    html = latex
  }
  return (
    <span
      className="katex-inline"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/** Render a list of parsed segments (text + math interleaved). */
function Segments({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'math' ? (
          <KaTeXSpan key={i} latex={seg.content} />
        ) : (
          <Fragment key={i}>{seg.content}</Fragment>
        )
      )}
    </>
  )
}

/**
 * Renders educational text with real mathematical typography via KaTeX.
 *
 * Priority order:
 * 1. Pipe-separated formulas ("$h^2 = m \cdot n$   |   $a^2 = m \cdot c$") → stacked chips
 * 2. Text with $...$ delimiters → KaTeX inline rendering
 * 3. Text with math unicode (²³√·×÷→≈°α−) → subtle sentence-level highlight (legacy fallback)
 * 4. Plain text → renders as-is
 */
export function MathText({ text, className }: MathTextProps) {
  const hasPipe = text.includes(PIPE_SEP)
  const hasDollar = text.includes('$')

  // ── Case 1: pipe-separated formula chips ──────────────────────────────────
  if (hasPipe) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {text.split(PIPE_SEP).map((chip, i) => {
          const trimmed = chip.trim()
          const segments = parseSegments(trimmed)
          const hasAnyMath = segments.some((s) => s.type === 'math')
          return (
            <span
              key={i}
              className="block bg-white/60 border border-brand-navy/15 rounded-lg px-3 py-2 text-sm font-semibold text-brand-navy tabular-nums"
            >
              {hasAnyMath ? <Segments segments={segments} /> : trimmed}
            </span>
          )
        })}
      </div>
    )
  }

  // ── Case 2: inline KaTeX ($...$ delimiters present) ───────────────────────
  if (hasDollar) {
    const segments = parseSegments(text)
    return (
      <span className={className}>
        <Segments segments={segments} />
      </span>
    )
  }

  // ── Case 3: legacy unicode math highlight (no $ delimiters) ───────────────
  if (HAS_MATH_UNICODE.test(text)) {
    const parts = text.split(SENTENCE_BOUNDARY)
    return (
      <span className={className}>
        {parts.map((seg, i) => {
          if (!seg) return null
          if (/^[.!?]\s+$/.test(seg)) return <Fragment key={i}>{seg}</Fragment>
          if (HAS_MATH_UNICODE.test(seg))
            return (
              <span key={i} className="bg-brand-navy/5 rounded px-0.5 tabular-nums">
                {seg}
              </span>
            )
          return <Fragment key={i}>{seg}</Fragment>
        })}
      </span>
    )
  }

  // ── Case 4: plain text ─────────────────────────────────────────────────────
  return <span className={className}>{text}</span>
}

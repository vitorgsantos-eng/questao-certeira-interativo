'use client'

import { Fragment } from 'react'
import { cn } from '@/lib/utils'

// Unicode chars that appear exclusively in mathematical expressions in our content.
// Plain Portuguese text never contains these characters.
const HAS_MATH = /[²³√·×÷→≈°α−]/
// ²  ³  √      ·       ×       ÷       →       ≈       °       α       −

// Pipe separator used in highlight blocks to list multiple formulas
const PIPE_SEP = '   |   '

// Split at sentence boundaries (. ? ! followed by space) to keep math clauses intact
const SENTENCE_BOUNDARY = /((?:[.!?]\s+))/

interface MathTextProps {
  /** The string to render, possibly containing math expressions */
  text: string
  className?: string
}

/**
 * Renders educational text with improved math typography.
 *
 * Three behaviors:
 * 1. Pipe-separated formulas ("h² = m·n   |   a² = m·c") → stacked formula chips
 * 2. Clauses containing math-specific unicode → subtle bg-brand-navy/5 highlight
 * 3. Plain text → renders as-is
 *
 * No dangerouslySetInnerHTML. No external dependencies.
 */
export function MathText({ text, className }: MathTextProps) {
  // ── Case 1: pipe-separated formula list ─────────────────────────────────────
  if (text.includes(PIPE_SEP)) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {text.split(PIPE_SEP).map((formula, i) => (
          <span
            key={i}
            className="block bg-white/60 border border-brand-navy/15 rounded-lg px-3 py-2 text-sm font-semibold text-brand-navy tabular-nums"
          >
            {formula.trim()}
          </span>
        ))}
      </div>
    )
  }

  // ── Case 2 & 3: inline text ──────────────────────────────────────────────────
  if (!HAS_MATH.test(text)) {
    // No math-specific chars → plain rendering
    return <span className={className}>{text}</span>
  }

  // Split at sentence boundaries; highlight clauses that contain math chars
  const segments = text.split(SENTENCE_BOUNDARY)

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (!seg) return null
        // Sentence separator (". ", "? ", "! ") → pass through unchanged
        if (/^[.!?]\s+$/.test(seg)) {
          return <Fragment key={i}>{seg}</Fragment>
        }
        // Clause with math chars → subtle highlight
        if (HAS_MATH.test(seg)) {
          return (
            <span key={i} className="bg-brand-navy/5 rounded px-0.5 tabular-nums">
              {seg}
            </span>
          )
        }
        return <Fragment key={i}>{seg}</Fragment>
      })}
    </span>
  )
}

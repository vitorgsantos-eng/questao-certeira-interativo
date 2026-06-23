import React from 'react'
import { MathText } from '@/components/math/MathText'
import { MathFormulaBlock } from '@/components/math/MathFormulaBlock'
import { SimilarTrianglesDiagram } from '@/components/visuals/SimilarTrianglesDiagram'
import { RightTriangleMetricsDiagram } from '@/components/visuals/RightTriangleMetricsDiagram'
import { TrigonometryDiagram } from '@/components/visuals/TrigonometryDiagram'
import { SystemsStrategyCard } from '@/components/visuals/SystemsStrategyCard'
import type { ContentBlockData } from '@/types'

const PIPE_SEP = '   |   '

/** True when the highlight string is a single $...$ formula (no chips, use display mode). */
function isSingleFormula(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.includes(PIPE_SEP)) return false
  const dollarCount = (trimmed.match(/\$/g) ?? []).length
  return dollarCount === 2 && trimmed.startsWith('$') && trimmed.endsWith('$')
}

interface LessonBlockProps {
  block: ContentBlockData
}

export function LessonBlock({ block }: LessonBlockProps) {
  switch (block.type) {
    case 'intro':
      return (
        <div className="bg-brand-navy rounded-2xl p-6 text-white space-y-2 animate-fade-in">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">
            {block.title}
          </span>
          <p className="text-sm leading-relaxed text-white/90">
            <MathText text={block.text} />
          </p>
        </div>
      )

    case 'concept':
      return (
        <div className="card border-l-4 border-brand-gold space-y-2 animate-fade-in">
          <h3 className="text-sm font-bold text-brand-gold uppercase tracking-wide">
            {block.title}
          </h3>
          <p className="text-sm text-brand-navy leading-relaxed">
            <MathText text={block.text} />
          </p>
          {block.highlight && (
            <div className="bg-brand-gold/10 rounded-lg p-3 mt-2">
              {isSingleFormula(block.highlight) ? (
                <MathFormulaBlock
                  latex={block.highlight.slice(1, -1)}
                  className="text-brand-navy"
                />
              ) : (
                <MathText
                  text={block.highlight}
                  className="text-sm font-semibold text-brand-navy"
                />
              )}
            </div>
          )}
        </div>
      )

    case 'visual_explanation':
      return (
        <div className="card space-y-3 animate-fade-in">
          <h3 className="section-title">{block.title}</h3>
          <p className="text-sm text-brand-navy leading-relaxed">
            <MathText text={block.text} />
          </p>
          {block.items && block.items.length > 0 && (
            <ul className="space-y-1.5">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-brand-navy">
                  <span className="text-brand-gold font-bold mt-0.5">▸</span>
                  <span>
                    <MathText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )

    case 'worked_example':
      return (
        <div className="card border border-brand-navy/20 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wide">
            Exemplo resolvido
          </h3>
          <div className="bg-brand-bg-light rounded-xl p-4">
            <p className="text-sm font-medium text-brand-navy">
              <MathText text={block.problem} />
            </p>
          </div>
          <ol className="space-y-2">
            {block.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-navy">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed pt-0.5">
                  <MathText text={step} />
                </span>
              </li>
            ))}
          </ol>
          {block.conclusion && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-sm font-semibold text-green-800">
                <MathText text={block.conclusion} />
              </p>
            </div>
          )}
        </div>
      )

    case 'hint':
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 text-lg flex-shrink-0">💡</span>
            <p className="text-sm text-amber-900 leading-relaxed">
              <MathText text={block.text} />
            </p>
          </div>
        </div>
      )

    case 'summary':
      return (
        <div className="card bg-brand-navy/5 border-brand-navy/20 space-y-3 animate-fade-in">
          <h3 className="section-title">{block.title}</h3>
          <ul className="space-y-2">
            {block.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-brand-navy">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>
                  <MathText text={point} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'diagram': {
      const diagrams: Record<string, React.ReactElement> = {
        'similar-triangles': <SimilarTrianglesDiagram />,
        'metric-relations': <RightTriangleMetricsDiagram />,
        'trigonometry': <TrigonometryDiagram />,
        'systems-strategy': <SystemsStrategyCard />,
      }
      const diagram = diagrams[block.diagramId]
      if (!diagram) return null
      return (
        <div className="card space-y-2 animate-fade-in">
          {diagram}
          {block.caption && (
            <p className="text-xs text-brand-gray-mid text-center italic">
              {block.caption}
            </p>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

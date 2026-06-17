import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercent?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'navy' | 'gold' | 'green'
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  size = 'md',
  color = 'navy',
  className,
}: ProgressBarProps) {
  const percent = Math.round(Math.min((value / max) * 100, 100))

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
  const fills = {
    navy: 'bg-brand-navy',
    gold: 'bg-brand-gold',
    green: 'bg-green-500',
  }

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-brand-gray-mid">{label}</span>}
          {showPercent && (
            <span className="text-xs font-bold text-brand-navy">{percent}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-brand-gray-soft rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            fills[color]
          )}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

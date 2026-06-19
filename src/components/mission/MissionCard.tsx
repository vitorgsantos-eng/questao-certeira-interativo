import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ProgressBar } from '@/components/progress/ProgressBar'
import type { MissionWithProgress } from '@/types'

interface MissionCardProps {
  mission: MissionWithProgress
  revisionSlug: string
  index: number
}

const statusConfig = {
  completed: {
    badge: 'Concluída',
    badgeClass: 'badge-success',
    icon: '✓',
    iconClass: 'bg-green-500 text-white',
    cardClass: 'border-green-200',
  },
  in_progress: {
    badge: 'Em andamento',
    badgeClass: 'badge-warning',
    icon: '▶',
    iconClass: 'bg-brand-gold text-brand-navy',
    cardClass: 'border-brand-gold/40',
  },
  not_started: {
    badge: 'Não iniciada',
    badgeClass: 'badge-neutral',
    icon: '',
    iconClass: 'bg-brand-gray-soft text-brand-gray-mid',
    cardClass: 'border-brand-gray-border',
  },
}

export function MissionCard({ mission, revisionSlug, index }: MissionCardProps) {
  const status = mission.progress?.status ?? 'not_started'
  const score = mission.progress?.score ?? 0
  const config = statusConfig[status]

  return (
    <Link
      href={`/revisao/${revisionSlug}/missao/${mission.slug}`}
      className={cn(
        'card-hover flex items-start gap-4 transition-all duration-200 border-2 group',
        config.cardClass
      )}
    >
      {/* Order / status icon */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
          config.iconClass
        )}
      >
        {config.icon || index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-brand-navy text-sm group-hover:text-brand-navy-mid transition-colors">
              {mission.title}
            </h3>
            <p className="text-xs text-brand-gray-mid mt-0.5">{mission.goal}</p>
          </div>
          <span className={cn('badge flex-shrink-0', config.badgeClass)}>
            {config.badge}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-gray-mid">
          <span>⏱ {mission.estimated_minutes} min</span>
          {mission.is_optional && <span className="badge-neutral">Opcional</span>}
        </div>

        {status !== 'not_started' && (
          <ProgressBar value={score} showPercent size="sm" color={score >= 80 ? 'green' : 'navy'} />
        )}
      </div>
    </Link>
  )
}

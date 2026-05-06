import React from 'react'
import { Opportunity } from '@/types'
import {
  STAGE_ORDER,
  STAGE_LABELS,
  STAGE_COLORS,
  canAdvance,
  getNextStage,
  getResultLabel,
  calcOpportunityHealth,
} from '@/skills/opportunity'
import { Button } from '@/components/ui/Button'
import {
  TrendingUp,
  TrendingDown,
  XCircle,
  ChevronRight,
  CalendarDays,
  DollarSign,
} from 'lucide-react'
import clsx from 'clsx'

interface OpportunityCardProps {
  opportunity: Opportunity
  onAdvance?: (opp: Opportunity) => void
  onMarkWon?: (opp: Opportunity) => void
  onMarkLost?: (opp: Opportunity) => void
}

function HealthBadge({ score }: { score: number }) {
  const color =
    score >= 70 ? 'bg-emerald-100 text-emerald-700' :
    score >= 40 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-600'
  return (
    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', color)}>
      健康度&nbsp;{score}
    </span>
  )
}

function StagePipeline({ current }: { current: Opportunity['stage'] }) {
  const currentIdx = STAGE_ORDER.indexOf(current)
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STAGE_ORDER.map((stage, idx) => {
        const isPast   = idx < currentIdx
        const isActive = idx === currentIdx
        const { bg, text } = STAGE_COLORS[stage]
        return (
          <React.Fragment key={stage}>
            <div
              className={clsx(
                'px-2 py-0.5 rounded text-xs font-medium transition-all',
                isActive  ? clsx(bg, text, 'ring-1 ring-offset-1 ring-current') :
                isPast    ? 'bg-slate-100 text-slate-500' :
                            'bg-slate-50 text-slate-300',
              )}
            >
              {STAGE_LABELS[stage]}
            </div>
            {idx < STAGE_ORDER.length - 1 && (
              <ChevronRight
                className={clsx(
                  'w-3 h-3 flex-shrink-0',
                  isPast ? 'text-slate-400' : 'text-slate-200',
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity: opp,
  onAdvance,
  onMarkWon,
  onMarkLost,
}) => {
  const health      = calcOpportunityHealth(opp)
  const result      = getResultLabel(opp.result)
  const nextStage   = getNextStage(opp.stage)
  const advanceable = canAdvance(opp)

  const closeDate = opp.estimatedCloseDate
    ? new Date(opp.estimatedCloseDate).toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : null

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug">
            {opp.opportunityName}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <HealthBadge score={health} />
            {opp.result && (
              <span className={clsx('text-xs font-semibold', result.colorClass)}>
                {result.label}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2">
          <StagePipeline current={opp.stage} />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-600">
        {opp.estimatedAmount !== undefined && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-800">
              {opp.estimatedAmount.toLocaleString('zh-CN')}&nbsp;万元
            </span>
          </div>
        )}
        {closeDate && (
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{closeDate}</span>
          </div>
        )}
        {opp.competitors && opp.competitors.length > 0 && (
          <div className="col-span-2 flex items-center gap-1.5">
            <span className="text-slate-400">竞争对手：</span>
            <span className="text-slate-700">{opp.competitors.join('、')}</span>
          </div>
        )}
        {opp.notes && (
          <p className="col-span-2 text-slate-500 italic leading-relaxed line-clamp-2">
            {opp.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      {!opp.result && (
        <div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
          {advanceable && nextStage && (
            <Button size="sm" variant="primary" onClick={() => onAdvance?.(opp)}>
              <ChevronRight className="w-3.5 h-3.5" />
              推进至「{STAGE_LABELS[nextStage]}」
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-600 hover:bg-emerald-50"
            onClick={() => onMarkWon?.(opp)}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            标记赢单
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:bg-red-50"
            onClick={() => onMarkLost?.(opp)}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            标记输单
          </Button>
        </div>
      )}

      {opp.result && opp.lostReason && (
        <div className="px-4 pb-3 flex items-start gap-1.5 text-xs text-slate-500">
          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{opp.lostReason}</span>
        </div>
      )}
    </div>
  )
}

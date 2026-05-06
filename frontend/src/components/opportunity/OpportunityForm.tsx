import React, { useState } from 'react'
import { Bid, Opportunity, OpportunityStage } from '@/types'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useCreateOpportunity, useUpdateOpportunity } from '@/hooks/useOpportunities'
import { useUpdateBidStatus } from '@/hooks/useBids'
import {
  STAGE_ORDER,
  STAGE_LABELS,
  validateOpportunity,
} from '@/skills/opportunity'

interface OpportunityFormProps {
  bid: Bid
  existing?: Opportunity
  onSuccess?: () => void
}

const STAGE_OPTIONS = STAGE_ORDER.map(value => ({ value, label: STAGE_LABELS[value] }))

const RESULT_OPTIONS = [
  { value: 'WON',       label: '赢单' },
  { value: 'LOST',      label: '输单' },
  { value: 'ABANDONED', label: '放弃' },
]

export const OpportunityForm: React.FC<OpportunityFormProps> = ({ bid, existing, onSuccess }) => {
  const [form, setForm] = useState({
    opportunityName:    existing?.opportunityName ?? bid.projectName,
    estimatedAmount:    String(existing?.estimatedAmount ?? bid.budget ?? ''),
    estimatedCloseDate: existing?.estimatedCloseDate?.slice(0, 10) ?? '',
    competitors:        existing?.competitors?.join('、') ?? '',
    stage:              (existing?.stage ?? 'INITIAL_CONTACT') as OpportunityStage,
    notes:              existing?.notes ?? '',
    result:             existing?.result ?? '',
    lostReason:         existing?.lostReason ?? '',
  })
  const [errors, setErrors] = useState<string[]>([])

  const create       = useCreateOpportunity()
  const update       = useUpdateOpportunity()
  const updateStatus = useUpdateBidStatus()

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: Partial<Opportunity> & { bidId: string } = {
      bidId:              bid.id,
      arUserId:           bid.assignedTo ?? '',
      opportunityName:    form.opportunityName,
      estimatedAmount:    form.estimatedAmount ? Number(form.estimatedAmount) : undefined,
      estimatedCloseDate: form.estimatedCloseDate || undefined,
      competitors:        form.competitors
        ? form.competitors.split(/[，、,]/).map(s => s.trim()).filter(Boolean)
        : [],
      stage:      form.stage,
      notes:      form.notes || undefined,
      result:     (form.result as Opportunity['result']) || undefined,
      lostReason: form.lostReason || undefined,
    }

    const validationErrors = validateOpportunity(payload)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors([])

    const fullPayload = payload as Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>

    if (existing) {
      await update.mutateAsync({ id: existing.id, ...fullPayload })
    } else {
      await create.mutateAsync(fullPayload)
      await updateStatus.mutateAsync({ id: bid.id, status: 'OPPORTUNITY' })
    }
    onSuccess?.()
  }

  const isPending = create.isPending || update.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {errors.length > 0 && (
        <ul className="bg-red-50 border border-red-200 rounded-md px-3 py-2 space-y-0.5">
          {errors.map(err => (
            <li key={err} className="text-xs text-red-600">• {err}</li>
          ))}
        </ul>
      )}

      <Input
        label="商机名称"
        value={form.opportunityName}
        onChange={set('opportunityName')}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="预计金额（万元）"
          type="number"
          min="0"
          step="any"
          value={form.estimatedAmount}
          onChange={set('estimatedAmount')}
        />
        <Input
          label="预计关闭日期"
          type="date"
          value={form.estimatedCloseDate}
          onChange={set('estimatedCloseDate')}
        />
      </div>

      <Input
        label="竞争对手（逗号分隔）"
        value={form.competitors}
        onChange={set('competitors')}
        placeholder="华为、中兴..."
      />

      <Select
        label="阶段"
        value={form.stage}
        onChange={set('stage')}
        options={STAGE_OPTIONS}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-700">备注</label>
        <textarea
          value={form.notes}
          onChange={set('notes')}
          rows={3}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-slate-400"
          placeholder="补充跟进情况..."
        />
      </div>

      {existing && (
        <>
          <Select
            label="结果"
            value={form.result}
            onChange={set('result')}
            options={RESULT_OPTIONS}
            placeholder="进行中"
          />
          {form.result === 'LOST' && (
            <Input
              label="输单原因"
              value={form.lostReason}
              onChange={set('lostReason')}
            />
          )}
        </>
      )}

      <Button type="submit" loading={isPending} className="w-full">
        {existing ? '更新商机' : '上报商机'}
      </Button>
    </form>
  )
}


import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { NO_OPPORTUNITY_REASONS } from '@/constants/feedbackEnums'

interface NoOpportunityModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string, note: string) => Promise<void>
}

export const NoOpportunityModal: React.FC<NoOpportunityModalProps> = ({ open, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isOther = selectedReason === 'OTHER'

  const handleConfirm = async () => {
    if (!selectedReason) {
      setError('请选择无商机原因')
      return
    }
    if (isOther && !note.trim()) {
      setError('选择"其他"时必须填写备注说明')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const reasonLabel = NO_OPPORTUNITY_REASONS.find(r => r.value === selectedReason)?.label || selectedReason
      await onConfirm(reasonLabel, note.trim())
      setSelectedReason('')
      setNote('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedReason('')
    setNote('')
    setError('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="标记无商机"
      width="max-w-md"
      footer={
        <div className="flex items-center gap-2 justify-end">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedReason || isLoading}
            loading={isLoading}
          >
            确认提交
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-2)]">
          请选择无商机的原因（单选），选择后将无法进入商机判断流程。
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <Select
          label="无商机原因 *"
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          options={NO_OPPORTUNITY_REASONS.map(r => ({ value: r.value, label: r.label }))}
          placeholder="请选择原因..."
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--text-2)]">
            备注说明{isOther ? ' *' : ''}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="border border-[var(--border-2)] rounded-[6px] px-3 py-2 text-sm text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-6)] resize-none placeholder:text-[var(--text-3)]"
            placeholder={isOther ? '请填写具体原因（必填）...' : '补充说明（选填）...'}
          />
        </div>
      </div>
    </Modal>
  )
}

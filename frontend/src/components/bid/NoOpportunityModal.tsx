import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { NO_OPPORTUNITY_REASONS } from '@/constants/feedbackEnums'

interface NoOpportunityModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string, note: string, hasIsgProduct: string) => Promise<void>
}

export const NoOpportunityModal: React.FC<NoOpportunityModalProps> = ({ open, onClose, onConfirm }) => {
  const [hasIsgProduct, setHasIsgProduct] = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const [otherText, setOtherText] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isOther = selectedReason === 'OTHER'

  const handleConfirm = async () => {
    if (!hasIsgProduct) {
      setError('请选择是否有ISG产品')
      return
    }
    if (!selectedReason) {
      setError('请选择无商机原因')
      return
    }
    if (isOther && !otherText.trim()) {
      setError('选择"其他原因"时必须填写具体原因')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const reasonLabel = NO_OPPORTUNITY_REASONS.find(r => r.value === selectedReason)?.label || selectedReason
      const finalReason = isOther ? `${reasonLabel}：${otherText.trim()}` : reasonLabel
      await onConfirm(finalReason, note.trim(), hasIsgProduct)
      resetForm()
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setHasIsgProduct('')
    setSelectedReason('')
    setOtherText('')
    setNote('')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="反馈无商机"
      width="max-w-md"
      footer={
        <div className="flex items-center gap-2 justify-end">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasIsgProduct || !selectedReason || isLoading}
            loading={isLoading}
          >
            确认提交
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* 是否有ISG产品 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-1)]">
            <span className="text-red-500 mr-1">*</span>是否有ISG产品
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasIsgProduct"
                value="YES"
                checked={hasIsgProduct === 'YES'}
                onChange={(e) => setHasIsgProduct(e.target.value)}
                className="w-4 h-4 accent-[var(--brand-6)]"
              />
              <span className="text-sm text-[var(--text-1)]">是</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasIsgProduct"
                value="NO"
                checked={hasIsgProduct === 'NO'}
                onChange={(e) => setHasIsgProduct(e.target.value)}
                className="w-4 h-4 accent-[var(--brand-6)]"
              />
              <span className="text-sm text-[var(--text-1)]">否</span>
            </label>
          </div>
        </div>

        {/* 无商机原因 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-1)]">
            <span className="text-red-500 mr-1">*</span>无商机原因
          </label>
          <div className="flex flex-col gap-2">
            {NO_OPPORTUNITY_REASONS.map((reason) => (
              <label key={reason.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="noOpportunityReason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 accent-[var(--brand-6)]"
                />
                <span className="text-sm text-[var(--text-1)]">{reason.label}</span>
              </label>
            ))}
          </div>
          {/* 其他原因联动输入框 */}
          {isOther && (
            <textarea
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              rows={2}
              className="mt-1 bg-gray-50 border border-[var(--border-2)] rounded-[8px] px-3 py-2 text-sm text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-6)] resize-none placeholder:text-[var(--text-3)]"
              placeholder="请输入具体原因..."
            />
          )}
        </div>

        {/* 备注说明（可选） */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--text-2)]">备注说明</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="border border-[var(--border-2)] rounded-[8px] px-3 py-2 text-sm text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-6)] resize-none placeholder:text-[var(--text-3)]"
            placeholder="补充说明（选填）..."
          />
        </div>

        {/* 底部浅橙色提示条 */}
        <div className="bg-orange-50 border border-orange-200 rounded-[6px] px-3 py-2">
          <p className="text-xs text-orange-700">
            提交后该标讯将标记为「无商机」，如后续有变化可在详情页重新操作。
          </p>
        </div>
      </div>
    </Modal>
  )
}

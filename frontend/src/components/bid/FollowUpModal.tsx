import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface FollowUpModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (remark: string) => Promise<void>
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({ open, onClose, onConfirm }) => {
  const [remark, setRemark] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (!remark.trim()) {
      setError('备注内容不能为空')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await onConfirm(remark.trim())
      setRemark('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRemark('')
    setError('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="跟进中"
      width="max-w-md"
      footer={
        <div className="flex items-center gap-2 justify-end">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!remark.trim() || isLoading}
            loading={isLoading}
          >
            提交跟进
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-2)]">
          暂时无法给出明确结论，请填写当前跟进情况。后续可继续追加跟进记录或转为其他状态。
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--text-2)]">跟进备注 *</label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={4}
            className="border border-[var(--border-2)] rounded-[6px] px-3 py-2 text-sm text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-6)] resize-none placeholder:text-[var(--text-3)]"
            placeholder="请描述当前跟进情况..."
          />
        </div>
      </div>
    </Modal>
  )
}

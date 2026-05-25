import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface OpportunitySuggestion {
  id: string
  opportunityNo: string
  projectName: string
  customerName: string
  stage: string
  amount: string
}

interface LinkOpportunityModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (opportunityNo: string) => Promise<void>
  suggestions?: OpportunitySuggestion[]
}

// Mock suggestions for demo
const MOCK_SUGGESTIONS: OpportunitySuggestion[] = [
  {
    id: '1',
    opportunityNo: 'S0250521234',
    projectName: '东海县医共体信息平台建设项目',
    customerName: '四川省妇幼保健院',
    stage: '发现需求',
    amount: '¥1,500 万',
  },
  {
    id: '2',
    opportunityNo: 'T0230721234',
    projectName: '南京医科大学常州校区教学机房及实验室设备采购项目',
    customerName: '四川省妇幼保健院',
    stage: '明确需求',
    amount: '¥300 万',
  },
  {
    id: '3',
    opportunityNo: 'B400AW9B',
    projectName: '存储扩容升级',
    customerName: '四川省妇幼保健院',
    stage: '方案制定',
    amount: '¥200 万',
  },
]

export const LinkOpportunityModal: React.FC<LinkOpportunityModalProps> = ({
  open,
  onClose,
  onConfirm,
  suggestions = MOCK_SUGGESTIONS,
}) => {
  const [selectedNo, setSelectedNo] = useState('')
  const [manualNo, setManualNo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const finalNo = selectedNo || manualNo.trim()

  const handleConfirm = async () => {
    if (!finalNo) return
    setIsLoading(true)
    try {
      await onConfirm(finalNo)
      resetForm()
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedNo('')
    setManualNo('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="关联已有商机"
      width="max-w-lg"
      footer={
        <div className="flex items-center gap-2 justify-end">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!finalNo || isLoading}
            loading={isLoading}
          >
            确认关联
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-[var(--text-3)]">单选一个商机与当前标讯关联</p>

        {/* 蓝色提示栏 */}
        <div className="bg-blue-50 border border-blue-200 rounded-[6px] px-3 py-2">
          <p className="text-xs text-blue-700">
            该标讯可能关联 {suggestions.length} 条商机，请从下方列表中单选
          </p>
        </div>

        {/* 商机建议列表 */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {suggestions.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-[8px] border cursor-pointer transition-colors ${
                selectedNo === item.opportunityNo
                  ? 'border-[var(--brand-6)] bg-blue-50'
                  : 'border-[var(--border-2)] hover:border-[var(--brand-5)] hover:bg-[var(--fill-1)]'
              }`}
            >
              <input
                type="radio"
                name="linkOpportunity"
                value={item.opportunityNo}
                checked={selectedNo === item.opportunityNo}
                onChange={() => { setSelectedNo(item.opportunityNo); setManualNo('') }}
                className="mt-1 w-4 h-4 accent-[var(--brand-6)]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-1)]">{item.opportunityNo}</span>
                </div>
                <p className="text-sm text-[var(--text-1)] mt-0.5 truncate">{item.projectName}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-3)]">
                  <span>{item.customerName}</span>
                  <span>商机阶段：{item.stage}</span>
                  <span className="text-[var(--brand-6)] font-medium">{item.amount}</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* 手动填写区域 */}
        <div className="flex flex-col gap-1 pt-2 border-t border-[var(--border-2)]">
          <label className="text-xs font-medium text-[var(--text-2)]">商机编号（非必填）</label>
          <input
            type="text"
            value={manualNo}
            onChange={(e) => { setManualNo(e.target.value); setSelectedNo('') }}
            className="border border-[var(--border-2)] rounded-[8px] px-3 py-2 text-sm text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-6)] placeholder:text-[var(--text-3)]"
            placeholder="如未找到可关联商机，可手动填写"
          />
        </div>
      </div>
    </Modal>
  )
}

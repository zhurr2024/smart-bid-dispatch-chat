import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAssignBid } from '@/hooks/useBids'
import { Bid } from '@/types'

interface DispatchModalProps {
  bid: Bid | null
  open: boolean
  onClose: () => void
}

export const DispatchModal: React.FC<DispatchModalProps> = ({ bid, open, onClose }) => {
  const [itcode, setItcode] = useState('')
  const assign = useAssignBid()

  const handleConfirm = async () => {
    if (!bid || !itcode.trim()) return
    await assign.mutateAsync({ id: bid.id, userId: itcode.trim() })
    setItcode('')
    onClose()
  }

  const handleClose = () => {
    setItcode('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="分配标讯"
      width="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>取消</Button>
          <Button onClick={handleConfirm} loading={assign.isPending} disabled={!itcode.trim()}>
            确认分配
          </Button>
        </>
      }
    >
      {bid && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-sm font-semibold text-slate-900 leading-snug">{bid.projectName}</div>
          <div className="text-xs text-slate-500 mt-0.5">{bid.region} · {bid.purchaserName}</div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">客户经理 ITCode</label>
          <input
            type="text"
            value={itcode}
            onChange={e => setItcode(e.target.value)}
            placeholder="请输入ITCode..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-400 mt-1">请手工输入客户经理的ITCode</p>
        </div>
      </div>
    </Modal>
  )
}

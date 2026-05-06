import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useUsers } from '@/hooks/useUsers'
import { useAssignBid } from '@/hooks/useBids'
import { suggestDispatch } from '@/skills/bid-dispatch/dispatchEngine'
import { Bid, User } from '@/types'
import clsx from 'clsx'

interface DispatchModalProps {
  bid: Bid | null
  open: boolean
  onClose: () => void
}

export const DispatchModal: React.FC<DispatchModalProps> = ({ bid, open, onClose }) => {
  const [selectedUserId, setSelectedUserId] = useState('')
  const { data: users = [] } = useUsers({ role: 'AR' })
  const assign = useAssignBid()

  const suggestions = bid ? suggestDispatch(bid, users, 3) : []

  const allArOptions = users.map(u => ({ value: u.id, label: `${u.name}（${u.region ?? '—'}）` }))

  const handleSelect = (userId: string) => {
    setSelectedUserId(prev => (prev === userId ? '' : userId))
  }

  const handleManualSelect = (userId: string) => {
    setSelectedUserId(userId)
  }

  const handleConfirm = async () => {
    if (!bid || !selectedUserId) return
    await assign.mutateAsync({ id: bid.id, userId: selectedUserId })
    setSelectedUserId('')
    onClose()
  }

  const handleClose = () => {
    setSelectedUserId('')
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
          <Button onClick={handleConfirm} loading={assign.isPending} disabled={!selectedUserId}>
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

      {suggestions.length > 0 && (
        <>
          <div className="text-xs font-medium text-slate-500 mb-2">推荐客户经理</div>
          <div className="space-y-2 mb-4">
            {suggestions.map(({ user, reason, score }) => (
              <SuggestCard
                key={user.id}
                user={user}
                reason={reason}
                score={score}
                selected={selectedUserId === user.id}
                onClick={() => handleSelect(user.id)}
              />
            ))}
          </div>
        </>
      )}

      <div className="text-xs font-medium text-slate-500 mb-2">或手动选择</div>
      <Select
        options={allArOptions}
        placeholder="选择客户经理…"
        value={selectedUserId}
        onChange={e => handleManualSelect(e.target.value)}
      />
    </Modal>
  )
}

const SuggestCard: React.FC<{
  user: User
  reason: string
  score: number
  selected: boolean
  onClick: () => void
}> = ({ user, reason, selected, onClick }) => (
  <div
    onClick={onClick}
    className={clsx(
      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
      selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
    )}
  >
    {/* Avatar initial */}
    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold flex-shrink-0">
      {user.name[0]}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-slate-900">{user.name}</div>
      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
        <MapPin size={11} />
        <span>{user.region ?? '—'}</span>
      </div>
    </div>

    {/* Reason badge */}
    <span className={clsx(
      'text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0',
      reason.startsWith('同大区')
        ? 'bg-indigo-100 text-indigo-700'
        : reason.startsWith('同团队')
        ? 'bg-teal-100 text-teal-700'
        : 'bg-slate-100 text-slate-500'
    )}>
      {reason}
    </span>

    {/* Radio indicator */}
    <div className={clsx(
      'w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors',
      selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'
    )} />
  </div>
)

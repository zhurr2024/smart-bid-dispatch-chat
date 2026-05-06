import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUsers } from '@/hooks/useUsers'
import { useAssignBid } from '@/hooks/useBids'
import { Bid, User } from '@/types'
import { MapPin, User as UserIcon } from 'lucide-react'
import clsx from 'clsx'

interface AssignModalProps {
  bid: Bid | null
  open: boolean
  onClose: () => void
}

export const AssignModal: React.FC<AssignModalProps> = ({ bid, open, onClose }) => {
  const [selectedUserId, setSelectedUserId] = React.useState('')
  const { data: users = [] } = useUsers({ role: 'AR' })
  const assign = useAssignBid()

  // Prioritize same-region ARs
  const sorted = [...users].sort((a, b) => {
    const aMatch = a.region === bid?.region ? -1 : 1
    const bMatch = b.region === bid?.region ? -1 : 1
    return aMatch - bMatch
  })

  const handleConfirm = async () => {
    if (!bid || !selectedUserId) return
    await assign.mutateAsync({ id: bid.id, userId: selectedUserId })
    onClose()
    setSelectedUserId('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="分配标讯"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleConfirm} loading={assign.isPending} disabled={!selectedUserId}>
            确认分配
          </Button>
        </>
      }
    >
      {bid && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg text-sm">
          <div className="font-medium text-slate-900 truncate">{bid.projectName}</div>
          <div className="text-slate-500 mt-0.5">{bid.region} · {bid.purchaserName}</div>
        </div>
      )}
      <div className="text-xs font-medium text-slate-500 mb-2">选择客户经理（同大区优先）</div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sorted.map(user => (
          <ARItem
            key={user.id}
            user={user}
            selected={selectedUserId === user.id}
            sameRegion={user.region === bid?.region}
            onClick={() => setSelectedUserId(user.id)}
          />
        ))}
      </div>
    </Modal>
  )
}

const ARItem: React.FC<{
  user: User; selected: boolean; sameRegion: boolean; onClick: () => void
}> = ({ user, selected, sameRegion, onClick }) => (
  <div
    onClick={onClick}
    className={clsx(
      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
      selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
    )}
  >
    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold flex-shrink-0">
      {user.name[0]}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-slate-900">{user.name}</div>
      <div className="text-xs text-slate-500 flex items-center gap-1">
        <MapPin size={11} />
        {user.region}
        {sameRegion && <span className="ml-1 text-indigo-600">·同大区</span>}
      </div>
    </div>
    {selected && <div className="w-4 h-4 rounded-full bg-indigo-600 flex-shrink-0" />}
  </div>
)

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { BidType, TenderType } from '@/types'

export const BidTypeBadge: React.FC<{ bidType: BidType }> = ({ bidType }) => (
  <Badge color={bidType === 'ISG' ? 'indigo' : 'purple'}>{bidType}</Badge>
)

export const TenderTypeBadge: React.FC<{ tenderType: TenderType }> = ({ tenderType }) => (
  <Badge color={tenderType === 'INTENT' ? 'sky' : 'slate'}>
    {tenderType === 'INTENT' ? '意向招标' : '实时招标'}
  </Badge>
)

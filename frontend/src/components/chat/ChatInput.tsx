import React, { useState } from 'react'
import { Search, Send } from 'lucide-react'

interface ChatInputProps {
  onSearch: (q: string) => void
}

const QUICK_CHIPS: { label: string; emoji: string }[] = [
  { emoji: '🔴', label: '高优标讯' },
  { emoji: '📋', label: '待分配' },
  { emoji: '📅', label: '今日新增' },
  { emoji: '⏰', label: '即将截止' },
  { emoji: '🏢', label: 'ISG' },
  { emoji: '📦', label: 'SSG' },
]

export const ChatInput: React.FC<ChatInputProps> = ({ onSearch }) => {
  const [value, setValue] = useState('')
  const [selectedChip, setSelectedChip] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value.trim())
    setValue('')
    setSelectedChip(null)
  }

  const handleChipClick = (chip: typeof QUICK_CHIPS[number]) => {
    const chipText = `${chip.emoji} ${chip.label}`
    const isAlreadySelected = selectedChip === chipText
    if (isAlreadySelected) {
      setSelectedChip(null)
      onSearch('')
    } else {
      setSelectedChip(chipText)
      setValue('')
      onSearch(chip.label)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (e.target.value) setSelectedChip(null)
  }

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3 flex-shrink-0">
      {/* Quick command chips — horizontally scrollable */}
      <div className="flex gap-1.5 mb-2.5 overflow-x-auto scrollbar-none pb-0.5">
        {QUICK_CHIPS.map(chip => {
          const chipText = `${chip.emoji} ${chip.label}`
          const isSelected = selectedChip === chipText
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleChipClick(chip)}
              className={[
                'flex-shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap',
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
              ].join(' ')}
            >
              <span>{chip.emoji}</span>
              <span>{chip.label}</span>
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            value={value}
            onChange={handleInputChange}
            placeholder="搜索标讯项目名、采购方..."
            className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg p-2 cursor-pointer transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

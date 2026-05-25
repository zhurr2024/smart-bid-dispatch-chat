import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface SearchableSelectProps {
  options: { value: string; label: string }[]
  placeholder?: string
  value?: string
  onChange?: (e: { target: { value: string } }) => void
  className?: string
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = '请选择...',
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find(o => o.value === value)
  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (val: string) => {
    onChange?.({ target: { value: val } })
    setIsOpen(false)
    setSearch('')
  }

  const handleClear = () => {
    onChange?.({ target: { value: '' } })
    setSearch('')
  }

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setTimeout(() => inputRef.current?.focus(), 0) }}
        className={clsx(
          'flex items-center gap-1 border border-[var(--border-2)] rounded-[6px] px-3 py-1.5 text-sm bg-white',
          'focus:outline-none focus:ring-1 focus:ring-[var(--brand-6)] focus:border-[var(--brand-6)] cursor-pointer min-w-[120px]',
          isOpen && 'ring-1 ring-[var(--brand-6)] border-[var(--brand-6)]'
        )}
      >
        <span className={clsx('flex-1 text-left truncate', selectedOption ? 'text-[var(--text-1)]' : 'text-[var(--text-3)]')}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown size={14} className={clsx('text-[var(--text-3)] transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[180px] bg-white border border-[var(--border-2)] rounded-[6px] shadow-lg z-50 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-[var(--border-2)]">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-[var(--fill-1)] rounded-[4px] outline-none placeholder:text-[var(--text-3)]"
              placeholder="输入筛选..."
            />
          </div>
          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {/* Clear option */}
            <button
              type="button"
              onClick={handleClear}
              className="w-full text-left px-3 py-2 text-sm text-[var(--text-3)] hover:bg-[var(--fill-1)] cursor-pointer"
            >
              {placeholder}
            </button>
            {filtered.length > 0 ? (
              filtered.map(o => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => handleSelect(o.value)}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-sm cursor-pointer',
                    o.value === value
                      ? 'bg-blue-50 text-[var(--brand-6)] font-medium'
                      : 'text-[var(--text-1)] hover:bg-[var(--fill-1)]'
                  )}
                >
                  {o.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-[var(--text-3)]">无匹配项</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

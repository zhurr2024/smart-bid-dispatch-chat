import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-[var(--text-1)]">{label}</label>}
    <input
      className={clsx(
        'border border-[var(--border-2)] rounded-[6px] px-3 py-2 text-sm text-[var(--text-1)] h-10',
        'focus:outline-none focus:ring-1 focus:ring-[var(--brand-6)] focus:border-[var(--brand-6)]',
        'placeholder:text-[var(--text-3)]',
        error && 'border-[var(--danger-6)] focus:ring-[var(--danger-6)]',
        className
      )}
      {...props}
    />
    {error && <span className="text-xs text-[var(--danger-6)]">{error}</span>}
  </div>
)

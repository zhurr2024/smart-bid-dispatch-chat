import React from 'react'
import clsx from 'clsx'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select: React.FC<SelectProps> = ({ label, options, placeholder, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-[var(--text-1)]">{label}</label>}
    <select
      className={clsx(
        'border border-[var(--border-2)] rounded-[6px] px-3 py-2 text-sm text-[var(--text-1)] bg-white',
        'focus:outline-none focus:ring-1 focus:ring-[var(--brand-6)] focus:border-[var(--brand-6)] cursor-pointer',
        className
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
)

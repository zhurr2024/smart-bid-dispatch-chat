import React from 'react'
import clsx from 'clsx'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select: React.FC<SelectProps> = ({ label, options, placeholder, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-700">{label}</label>}
    <select
      className={clsx(
        'border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 bg-white',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer',
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

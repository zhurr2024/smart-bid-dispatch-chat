import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-700">{label}</label>}
    <input
      className={clsx(
        'border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
        'placeholder:text-slate-400',
        error && 'border-red-400 focus:ring-red-400',
        className
      )}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
)

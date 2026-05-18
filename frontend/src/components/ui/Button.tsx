import React from 'react'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-[4px] cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-[var(--brand-6)] text-white hover:bg-[var(--brand-5)] active:bg-[var(--brand-7)] border border-transparent',
    secondary: 'bg-white text-[var(--text-1)] border border-[var(--border-2)] hover:bg-[var(--fill-2)] hover:border-[var(--border-3)]',
    danger: 'bg-[var(--danger-6)] text-white hover:bg-[var(--danger-5)] active:bg-[var(--danger-7)] border border-transparent',
    ghost: 'bg-transparent text-[var(--text-2)] hover:bg-[var(--fill-2)] border border-transparent',
  }
  const sizes = {
    sm: 'text-xs px-2.5 h-6 leading-none',
    md: 'text-sm px-4 h-8 leading-none',
    lg: 'text-base px-5 h-9 leading-none',
  }
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

import React from 'react'
import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hoverable }) => (
  <div
    onClick={onClick}
    className={clsx(
      'bg-white rounded-[8px] border border-[var(--border-2)] shadow-card',
      hoverable && 'hover:shadow-menu transition-shadow duration-200 cursor-pointer',
      className
    )}
  >
    {children}
  </div>
)

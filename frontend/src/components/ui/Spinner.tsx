import React from 'react'

export const Spinner: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    className="animate-spin text-[var(--brand-6)]"
    style={{ width: size, height: size }}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

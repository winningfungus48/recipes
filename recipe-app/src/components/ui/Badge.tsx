import React from 'react'

export default function Badge({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#F0EBE3] px-3 py-1 text-xs font-medium text-[#8B6F47] ${className}`}
    >
      {children}
    </span>
  )
}

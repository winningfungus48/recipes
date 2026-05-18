import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const styles: Record<Variant, string> = {
  primary:
    'bg-[#D47C2E] text-white hover:bg-[#c26e28] active:scale-[0.99] disabled:opacity-50',
  secondary:
    'border border-[#8B6F47]/30 bg-white text-[#8B6F47] hover:bg-[#F0EBE3] active:scale-[0.99]',
  ghost: 'text-[#7C9A6E] hover:bg-[#7C9A6E]/10',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

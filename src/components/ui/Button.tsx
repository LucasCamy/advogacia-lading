import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'text'

const base =
  'group/btn inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap font-sans text-[13px] font-semibold uppercase tracking-[0.06em] transition-[background-color,border-color,color,transform] duration-200 ease-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-accent px-6 text-bg hover:bg-accent-hover',
  secondary: 'border border-line-strong px-6 text-text hover:border-text',
  text: 'min-h-11 px-0 text-text',
}

function Arrow() {
  return (
    <ArrowRight
      size={16}
      weight="bold"
      aria-hidden
      className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1"
    />
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; arrow?: boolean; children: ReactNode }

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = 'primary', arrow = false, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cn(base, variants[variant], className)} {...rest}>
      <span className={variant === 'text' ? 'link-underline' : undefined}>{children}</span>
      {arrow && <Arrow />}
    </button>
  )
})

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; arrow?: boolean; children: ReactNode }

export function ButtonLink({ variant = 'primary', arrow = false, className, children, ...rest }: LinkProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      <span className={variant === 'text' ? 'link-underline' : undefined}>{children}</span>
      {arrow && <Arrow />}
    </a>
  )
}

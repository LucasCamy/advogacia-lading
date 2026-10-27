import { useEffect, useRef, type ReactNode } from 'react'
import { X } from '@phosphor-icons/react/dist/csr/X'
import { lockScroll, unlockScroll } from '../../lib/scroll'
import { cn } from '../../lib/cn'

type Props = {
  open: boolean
  onClose: () => void
  /** id do título visível (aria-labelledby) */
  labelledBy: string
  variant?: 'center' | 'drawer' | 'sheet'
  closeLabel?: string
  children: ReactNode
  className?: string
}

/**
 * Diálogo nativo (`showModal`): foco preso e Esc pelo navegador.
 * Aqui: trava o scroll (lenis.stop), fecha no backdrop e devolve o foco ao gatilho.
 */
export function Dialog({ open, onClose, labelledBy, variant = 'center', closeLabel = 'Fechar', children, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (open && !dlg.open) {
      returnFocus.current = document.activeElement as HTMLElement | null
      dlg.showModal()
      lockScroll()
      return () => {
        if (dlg.open) dlg.close()
        unlockScroll()
        const el = returnFocus.current
        if (el && document.contains(el)) el.focus({ preventScroll: true })
      }
    }
  }, [open])

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      onCloseRef.current()
    }
    const onClick = (e: MouseEvent) => {
      if (e.target === dlg) onCloseRef.current()
    }
    dlg.addEventListener('cancel', onCancel)
    dlg.addEventListener('click', onClick)
    return () => {
      dlg.removeEventListener('cancel', onCancel)
      dlg.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-modal="true"
      className={cn('dlg', variant === 'drawer' && 'dlg--drawer', variant === 'sheet' && 'dlg--sheet', className)}
    >
      {open && (
        <div className="relative flex h-full max-h-[inherit] flex-col">
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-3 top-3 z-10 grid size-11 place-items-center border border-line-strong bg-surface text-text transition-colors hover:border-text"
          >
            <X size={18} weight="regular" aria-hidden />
          </button>
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </div>
      )}
    </dialog>
  )
}

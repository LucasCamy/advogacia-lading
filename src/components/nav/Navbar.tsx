import { useState } from 'react'
import { List } from '@phosphor-icons/react/dist/csr/List'
import { brand, navItems, chapters } from '../../data/content'
import { chapterStore, useStore } from '../../lib/store'
import { scrollToTarget } from '../../lib/scroll'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { ChapterIndicator } from './ScrollProgress'

/** Mapeia o capítulo ativo para o link correspondente da nav (Pilares → nenhum, Contato → CTA). */
function useActiveNav() {
  return useStore(chapterStore, (s) => s.active)
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('display text-[22px] leading-none tracking-[0.01em]', className)}>
      Varela <span className="text-accent">&amp;</span> Montenegro
    </span>
  )
}

export function Navbar() {
  const active = useActiveNav()
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    // Espera o diálogo liberar o scroll.
    requestAnimationFrame(() => scrollToTarget('#' + id))
    history.replaceState(null, '', '#' + id)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-line bg-bg/75 backdrop-blur-md">
        <div className="wrap flex h-full items-center gap-6">
          <a href="#inicio" onClick={go('inicio')} className="shrink-0" aria-label={`${brand.name}, ${brand.tagline}. Voltar ao início`}>
            <Wordmark />
          </a>

          <ChapterIndicator className="mono hidden shrink-0 border-l border-line pl-6 xl:block" />

          <nav aria-label="Principal" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={go(n.id)}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={cn(
                      'link-underline py-2 text-[13px] font-medium tracking-[0.02em] transition-colors xl:text-sm',
                      active === n.id ? 'text-text' : 'text-muted hover:text-text',
                    )}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden sm:order-none sm:block lg:ml-0">
            <ButtonLink href="#contato" onClick={go('contato')} className="min-h-10 px-5">
              Fale Conosco
            </ButtonLink>
          </div>

          <ChapterIndicator compact className="mono ml-auto lg:hidden sm:ml-0" />

          <button
            type="button"
            className="grid size-11 place-items-center border border-line-strong sm:ml-0 lg:hidden"
            aria-label="Abrir menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <List size={20} aria-hidden />
          </button>
        </div>
      </header>

      {/* Menu mobile fora do header: o backdrop-filter do header viraria bloco de referência. */}
      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} labelledBy="menu-title" variant="sheet" closeLabel="Fechar menu">
        <div className="wrap flex min-h-[100dvh] flex-col pb-10 pt-5">
          <p id="menu-title" className="mono text-muted">
            Menu
          </p>
          <nav aria-label="Menu" className="mt-10">
            <ul className="border-t border-line">
              {navItems.map((n) => {
                const idx = chapters.findIndex((c) => c.id === n.id) + 1
                return (
                  <li key={n.id} className="border-b border-line">
                    <a
                      href={`#${n.id}`}
                      onClick={go(n.id)}
                      aria-current={active === n.id ? 'true' : undefined}
                      className="flex min-h-16 items-baseline gap-5 py-3"
                    >
                      <span className="mono text-accent-text">{String(idx).padStart(2, '0')}</span>
                      <span className="display text-[44px]">{n.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="mt-auto pt-10">
            <ButtonLink href="#contato" onClick={go('contato')} arrow className="w-full">
              Fale Conosco
            </ButtonLink>
          </div>
        </div>
      </Dialog>
    </>
  )
}

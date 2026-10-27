import { useRef } from 'react'
import { chapters } from '../../data/content'
import { chapterStore, useStore } from '../../lib/store'
import { ScrollTrigger, gsap, useGSAP } from '../../lib/scroll'

/**
 * Barra de leitura (topo) + gatilhos de capítulo.
 * Não é decoração: é a orientação da travessia; por isso funciona também com movimento reduzido.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const setBar = gsap.quickSetter(bar.current, 'scaleX')
    const boxes = () =>
      chapters
        .map(({ id }) => {
          const el = document.getElementById(id)
          // Seção fixada: a caixa real no fluxo é o pin-spacer.
          const box = el?.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
          return box ? { id, box } : null
        })
        .filter((b): b is { id: string; box: HTMLElement } => b !== null)

    const update = () => {
      const line = window.innerHeight * 0.45
      let active = chapters[0].id
      for (const { id, box } of boxes()) if (box.getBoundingClientRect().top <= line) active = id
      if (active !== chapterStore.get().active) chapterStore.set({ active })
    }

    // onUpdate lendo a posição real evita o "volta ao estado inicial" de end:'max' com onToggle
    // e acompanha os pin-spacers das cenas fixadas.
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      refreshPriority: -1,
      onUpdate: (self) => {
        setBar(self.progress)
        update()
      },
      onRefresh: update,
    })
  })

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  )
}

export function ChapterIndicator({ className, compact }: { className?: string; compact?: boolean }) {
  const active = useStore(chapterStore, (s) => s.active)
  const i = Math.max(0, chapters.findIndex((c) => c.id === active))
  return (
    <p className={`whitespace-nowrap ${className ?? ''}`} aria-live="off">
      <span className="sr-only">Capítulo atual: </span>
      <span className="text-accent-text">{String(i + 1).padStart(2, '0')}</span>
      <span className="text-faint"> / {String(chapters.length).padStart(2, '0')}</span>
      {!compact && <span className="ml-3 text-muted">{chapters[i].label}</span>}
    </p>
  )
}

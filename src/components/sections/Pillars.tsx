import { useRef, useState } from 'react'
import { Plus } from '@phosphor-icons/react/dist/csr/Plus'
import { pillars } from '../../data/content'
import { MQ, gsap, refreshScroll, useGSAP } from '../../lib/scroll'
import { cn } from '../../lib/cn'

/** 4 pilares em grade de 1px. Stagger na entrada; clique abre o painel de compromisso ético. */
export function Pillars() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<string | null>(null)
  const current = pillars.find((p) => p.id === open)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('.pillar', {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.pillar-grid', start: 'top 82%', once: true },
        })
        gsap.from('.pillar-rule', {
          scaleX: 0,
          duration: 1.2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: '.pillar-grid', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  const toggle = (id: string) => {
    setOpen((o) => (o === id ? null : id))
    refreshScroll()
  }

  return (
    <section id="pilares" ref={root} aria-labelledby="pilares-title" className="relative py-[clamp(72px,10vw,128px)]">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="pilares-title" className="display h2 max-w-[12ch]">
            Quatro compromissos
          </h2>
          <p className="max-w-[44ch] text-muted">
            Antes de qualquer tese, o modo de trabalhar. Abra cada pilar para ler o que ele obriga o escritório a fazer.
          </p>
        </div>

        <div className="pillar-grid relative mt-12">
          <span aria-hidden className="pillar-rule rule-x absolute inset-x-0 top-0" />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const isOpen = open === p.id
              return (
                <li
                  key={p.id}
                  className={cn(
                    'pillar border-b border-line sm:border-r',
                    i % 2 === 1 && 'sm:border-r-0 lg:border-r',
                    i === 3 && 'lg:border-r-0',
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls="pilar-painel"
                    onClick={() => toggle(p.id)}
                    className={cn(
                      'group flex h-full min-h-[240px] w-full flex-col p-6 text-left transition-colors duration-300 lg:min-h-[300px] lg:p-8',
                      isOpen ? 'bg-raised' : 'hover:bg-surface',
                    )}
                  >
                    <span className="flex items-center justify-between">
                      <span className={cn('mono tnum', isOpen ? 'text-accent-text' : 'text-faint')}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Plus
                        size={18}
                        aria-hidden
                        className={cn('text-muted transition-transform duration-300', isOpen && 'rotate-45 text-accent-text')}
                      />
                    </span>
                    <span className="display mt-auto pt-10 text-[clamp(2.5rem,4vw,3.5rem)]">{p.title}</span>
                    <span className="mt-3 text-[15px] leading-relaxed text-muted">{p.short}</span>
                    <span className="mono mt-6 text-[11px] text-accent-text">
                      {isOpen ? 'Fechar compromisso' : 'Ler compromisso'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div
            id="pilar-painel"
            role="region"
            aria-live="polite"
            aria-label={current ? `Compromisso: ${current.title}` : 'Compromisso ético'}
            className={cn(
              'grid transition-[grid-template-rows] duration-500 ease-out',
              current ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
            onTransitionEnd={refreshScroll}
          >
            <div className="overflow-hidden">
              {current && (
                <div className="grid gap-8 border-b border-line bg-surface p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:p-10">
                  <div>
                    <p className="mono text-accent-text">Compromisso ético</p>
                    <p className="display mt-3 text-[clamp(2rem,3.4vw,3rem)]">{current.title}</p>
                  </div>
                  <ol className="grid gap-4">
                    {current.commitment.map((c, k) => (
                      <li key={k} className="flex gap-4 border-t border-line pt-4">
                        <span className="mono tnum text-faint">{String(k + 1).padStart(2, '0')}</span>
                        <span className="text-text">{c}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

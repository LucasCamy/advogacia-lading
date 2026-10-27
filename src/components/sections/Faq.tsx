import { useRef, useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { contactEmail, faqs } from '../../data/content'
import { MQ, gsap, refreshScroll, useGSAP } from '../../lib/scroll'
import { cn } from '../../lib/cn'

/** Perguntas frequentes. PIN 4 (desktop): coluna esquerda fixa enquanto o acordeão WAI-ARIA rola. */
export function Faq() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const left = root.current!.querySelector<HTMLElement>('.faq-left')!
        const right = root.current!.querySelector<HTMLElement>('.faq-right')!
        gsap.timeline({
          scrollTrigger: {
            trigger: right,
            start: 'top top+=112',
            end: () => '+=' + Math.max(1, right.offsetHeight - left.offsetHeight),
            pin: left,
            pinSpacing: false,
            invalidateOnRefresh: true,
          },
        })
      })
      mm.add(MQ.motion, () => {
        gsap.from('.faq-item', {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: '.faq-right', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="duvidas" ref={root} aria-labelledby="duvidas-title" className="relative border-t border-line py-[var(--section-y)]">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-0">
        <div className="faq-left lg:col-span-5 lg:pr-12">
          <h2 id="duvidas-title" className="display h2">
            Perguntas frequentes
          </h2>
          <p className="mt-6 max-w-[38ch] text-muted">
            O que costuma ser perguntado antes da primeira reunião. Se a sua dúvida não estiver aqui, escreva para{' '}
            <a href={`mailto:${contactEmail}`} className="text-accent-text underline decoration-1 underline-offset-4">
              {contactEmail}
            </a>
            .
          </p>
          <a href="#contato" className="link-underline mt-8 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.06em]">
            Ir para o contato
          </a>
        </div>

        <ol className="faq-right border-t border-line lg:col-span-7">
          {faqs.map((f, i) => {
            const isOpen = open === i
            const id = `faq-${i}`
            return (
              <li key={f.q} className="faq-item border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`${id}-btn`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex min-h-16 w-full items-start gap-5 py-6 text-left"
                  >
                    <span className={cn('mono tnum pt-1.5', isOpen ? 'text-accent-text' : 'text-faint')}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-lg font-medium leading-snug sm:text-xl">{f.q}</span>
                    <Plus
                      size={20}
                      aria-hidden
                      className={cn('mt-1 shrink-0 text-muted transition-transform duration-300 group-hover:text-text', isOpen && 'rotate-45 text-accent-text')}
                    />
                  </button>
                </h3>
                <div
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={`${id}-btn`}
                  hidden={!isOpen}
                  className="pb-8 pl-[calc(2ch+20px+1rem)] pr-8 text-muted"
                >
                  {f.a.map((p) => (
                    <p key={p} className="mt-3 first:mt-0 max-w-[60ch]">
                      {p}
                    </p>
                  ))}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
      <FaqRefresh dep={open} />
    </section>
  )
}

/** Recalcula o pin quando a altura do acordeão muda. */
function FaqRefresh({ dep }: { dep: unknown }) {
  useGSAP(() => refreshScroll(), { dependencies: [dep] })
  return null
}

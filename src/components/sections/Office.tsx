import { useRef } from 'react'
import { MQ, gsap, useGSAP } from '../../lib/scroll'
import { Media } from '../ui/Media'
import { SplitWords } from '../ui/SplitWords'
import { Metrics } from './Metrics'

/** Métricas + split assimétrico. A foto abre como cortina (clip-path) com escala 1.12 → 1 no scrub. */
export function Office() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: '.office-figure', start: 'top 85%', end: 'center 45%', scrub: 1 },
          })
          .fromTo(
            '.office-clip',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' },
            0,
          )
          .fromTo('.office-img', { scale: 1.12 }, { scale: 1, ease: 'none' }, 0)

        gsap.from('.office-title .word', {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: '.office-title', start: 'top 85%', once: true },
        })
        gsap.from('.office-col', {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.office-cols', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="escritorio" ref={root} aria-labelledby="escritorio-title" className="relative pb-[var(--section-y)]">
      <Metrics />

      <div className="wrap mt-[clamp(72px,10vw,140px)] grid gap-10 lg:grid-cols-12 lg:gap-0">
        <figure className="office-figure relative lg:col-span-6 lg:pr-12">
          <div className="office-clip relative aspect-[4/3] overflow-hidden bg-surface">
            <Media name="editorial" className="office-img origin-[34%_42%]" />
          </div>
          <figcaption className="mono mt-3 flex justify-between gap-4 text-[10px] text-muted">
            <span>Sede · Itaim Bibi</span>
            <span>Imagem ilustrativa</span>
          </figcaption>
        </figure>

        <div className="relative lg:col-span-6 lg:border-l lg:border-line lg:pl-12">
          <h2 id="escritorio-title" className="office-title display h2">
            <SplitWords text="Onde a técnica encontra a estratégia" />
          </h2>
          <div className="office-cols mt-10 grid gap-8 text-muted md:grid-cols-2">
            <div className="office-col space-y-4">
              <p className="text-text">
                Somos um escritório de porte médio por escolha. Grande o bastante para conduzir operações complexas, pequeno o
                bastante para que um sócio conheça cada caso.
              </p>
              <p>
                O trabalho consultivo previne o litígio; o contencioso, quando inevitável, é preparado desde o primeiro
                contrato.
              </p>
            </div>
            <div className="office-col space-y-4">
              <p>
                Empresas, sócios e famílias chegam com perguntas diferentes, mas com a mesma necessidade: entender o risco
                antes de decidir.
              </p>
              <p>
                Por isso cada caso começa com um diagnóstico escrito, com cenários, custos e prazos que você consegue
                comparar.
              </p>
              <a href="#metodo" className="link-underline inline-flex min-h-11 items-center text-sm font-semibold text-accent-text">
                Ver como atuamos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

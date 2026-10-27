import { Suspense, useRef, useState } from 'react'
import { Info } from '@phosphor-icons/react/dist/csr/Info'
import { team, type Member } from '../../data/content'
import { MQ, gsap, useGSAP } from '../../lib/scroll'
import { Media } from '../ui/Media'
import { SplitWords } from '../ui/SplitWords'
import { lazyWithPreload, preloadOn } from '../../lib/lazy'

const BioDialog = lazyWithPreload(() => import('../dialogs/BioDialog').then((m) => ({ default: m.BioDialog })))

/** Equipe: stagger dos 3 cards; P&B em repouso, cor e especialidade no hover/foco; modal Trajetória. */
export function Team() {
  const root = useRef<HTMLElement>(null)
  const [member, setMember] = useState<Member | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('.team-title .word', {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '.team-title', start: 'top 85%', once: true },
        })
        gsap.from('.team-card', {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.team-grid', start: 'top 80%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="equipe" ref={root} aria-labelledby="equipe-title" className="relative border-t border-line py-[var(--section-y)]">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="equipe-title" className="team-title display h2 lg:col-span-7">
            <SplitWords text="Quem conduz o seu caso" />
          </h2>
          <p className="text-muted lg:col-span-5">
            Três sócios dividem as frentes do escritório. Um deles será o responsável nominal pelo seu caso, do início ao fim.
          </p>
        </div>

        <ul className="team-grid mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <li key={m.id} className={`team-card group relative bg-bg ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              <div className="relative aspect-[3/4] overflow-hidden bg-surface sm:aspect-[4/5] lg:aspect-[3/4]">
                <Media name={m.photo} className="grayscale-rest group-hover:scale-[1.03] group-focus-within:scale-[1.03]" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                {/* Especialidade: revela sem deslocar layout (transform/opacity sobre a foto) */}
                <p className="absolute inset-x-5 bottom-5 translate-y-3 text-sm text-text opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <span className="mono block text-[10px] text-accent-text">Especialidade</span>
                  {m.specialty}
                </p>
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-line p-5 lg:p-6">
                <div>
                  <p className="mono tnum text-faint">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 font-display text-[1.625rem] font-bold uppercase leading-tight [font-stretch:80%]">{m.name}</h3>
                  <p className="text-sm text-muted">{m.role}</p>
                  <p className="mt-2 text-sm text-muted lg:sr-only">Especialidade: {m.specialty}</p>
                </div>
                <button
                  type="button"
                  {...preloadOn(BioDialog.preload)}
                  onClick={() => setMember(m)}
                  aria-haspopup="dialog"
                  className="inline-flex min-h-11 shrink-0 items-center border border-line-strong px-4 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors hover:border-text"
                >
                  Trajetória<span className="sr-only"> de {m.name}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted">
          <Info size={16} aria-hidden className="mt-0.5 shrink-0" />
          Retratos ilustrativos de banco de imagens (Unsplash). Não retratam os profissionais citados, que são personagens de demonstração.
        </p>
      </div>

      {member && (
        <Suspense fallback={null}>
          <BioDialog member={member} onClose={() => setMember(null)} />
        </Suspense>
      )}
    </section>
  )
}

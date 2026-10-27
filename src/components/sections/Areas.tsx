import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { areaRowImages, areas, profiles, type Area, type Profile } from '../../data/content'
import { MQ, gsap, refreshScroll, useGSAP } from '../../lib/scroll'
import { cn } from '../../lib/cn'
import { Media } from '../ui/Media'
import { SplitWords } from '../ui/SplitWords'
import { AreaDrawer } from '../dialogs/AreaDrawer'

function chunk<T>(list: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out
}

/** Grid xadrez: cada linha = imagem + duas áreas, alternando o lado da imagem. Parallax em 3 velocidades. */
export function Areas() {
  const root = useRef<HTMLElement>(null)
  const [profile, setProfile] = useState<Profile>('todas')
  const [selected, setSelected] = useState<Area | null>(null)

  const visible = useMemo(
    () => (profile === 'todas' ? areas : areas.filter((a) => a.profiles.includes(profile))),
    [profile],
  )
  const rows = chunk(visible, 2)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('.areas-title .word', {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '.areas-title', start: 'top 85%', once: true },
        })
        gsap.utils.toArray<HTMLElement>('.area-row').forEach((row) => {
          const st = { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1 }
          gsap.fromTo(row.querySelector('.area-img'), { yPercent: -9 }, { yPercent: 9, ease: 'none', scrollTrigger: st })
          gsap.fromTo(row.querySelectorAll('.area-index'), { yPercent: 70 }, { yPercent: -70, ease: 'none', scrollTrigger: st })
          gsap.fromTo(row.querySelectorAll('.area-text'), { yPercent: 14 }, { yPercent: -14, ease: 'none', scrollTrigger: st })
        })
      })
      // A altura da seção muda com o filtro: as cenas fixadas abaixo precisam recalcular.
      refreshScroll()
    },
    { scope: root, dependencies: [profile], revertOnUpdate: true },
  )

  return (
    <section id="areas" ref={root} aria-labelledby="areas-title" className="relative border-t border-line py-[var(--section-y)]">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mono text-accent-text">Áreas de atuação</p>
            <h2 id="areas-title" className="areas-title display h2 mt-4">
              <SplitWords text="Como podemos ajudar" />
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-muted">Filtre pelo seu perfil. Cada frente abre com escopo, situações típicas e documentos para a primeira reunião.</p>
            <div role="group" aria-label="Filtrar áreas por perfil" className="mt-5 flex flex-wrap gap-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={profile === p.id}
                  onClick={() => setProfile(p.id)}
                  className={cn(
                    'min-h-11 rounded-pill border px-4 text-[13px] font-medium transition-colors duration-200',
                    profile === p.id ? 'border-text bg-text text-bg' : 'border-line-strong text-muted hover:border-text hover:text-text',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              {visible.length} frentes exibidas
            </p>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="mt-12 border border-line p-10 text-center">
            <p className="text-muted">Nenhuma área neste perfil.</p>
            <button type="button" onClick={() => setProfile('todas')} className="link-underline mt-4 min-h-11 text-accent-text">
              Limpar filtro
            </button>
          </div>
        ) : (
          <ul className="mt-14 border-t border-line" key={profile}>
            {rows.map((row, r) => {
              const imgKey = areaRowImages[r % areaRowImages.length]
              const imageRight = r % 2 === 1
              return (
                <li key={row.map((a) => a.id).join('-')} className="area-row grid border-b border-line md:grid-cols-12">
                  <div
                    className={cn(
                      'relative aspect-[4/3] overflow-hidden bg-surface md:col-span-4 md:aspect-auto md:min-h-[440px]',
                      imageRight ? 'md:order-last md:border-l md:border-line' : 'md:border-r md:border-line',
                    )}
                  >
                    <div className="area-img absolute inset-x-0 -top-[10%] h-[120%]">
                      <Media name={imgKey} />
                    </div>
                  </div>
                  <ul className={cn('grid md:col-span-8', row.length === 2 ? 'sm:grid-cols-2' : 'grid-cols-1')}>
                    {row.map((a, k) => (
                      <li
                        key={a.id}
                        className={cn('group relative flex flex-col overflow-hidden p-6 lg:p-10', k === 1 && 'border-t border-line sm:border-l sm:border-t-0')}
                      >
                        <span aria-hidden className="area-index display tnum pointer-events-none absolute right-4 top-2 text-[clamp(5rem,9vw,8.5rem)] leading-none text-faint/40">
                          {a.index}
                        </span>
                        <div className="area-text relative flex h-full flex-col">
                          <span className="mono tnum text-accent-text">{a.index}</span>
                          <h3 className="mt-16 font-display text-[var(--fs-h3)] font-bold uppercase leading-tight [font-stretch:80%]">{a.title}</h3>
                          <p className="mt-3 max-w-[40ch] text-[15px] text-muted">{a.summary}</p>
                          <button
                            type="button"
                            onClick={() => setSelected(a)}
                            aria-haspopup="dialog"
                            className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-8 text-sm font-semibold uppercase tracking-[0.06em] text-text"
                          >
                            <span className="link-underline">Explorar</span>
                            <span className="sr-only">{a.title}</span>
                            <ArrowUpRight size={16} aria-hidden className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <AreaDrawer area={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

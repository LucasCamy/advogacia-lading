import { useRef } from 'react'
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin'
import { VideoCamera } from '@phosphor-icons/react/dist/csr/VideoCamera'
import { steps } from '../../data/content'
import { MQ, gsap, useGSAP, useMediaQuery } from '../../lib/scroll'
import { requestMeeting } from '../../lib/schedule'
import { cn } from '../../lib/cn'

/**
 * Como Atuamos. PIN 3 (desktop): trilho horizontal com preenchimento por scrub e etapas que acendem.
 * Celular: lista vertical com linha vertical preenchida. Movimento reduzido: grade estática.
 */
export function Method() {
  const root = useRef<HTMLElement>(null)
  const horizontal = useMediaQuery(MQ.desktop)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const track = root.current!.querySelector<HTMLElement>('.method-track')!
        const viewport = root.current!.querySelector<HTMLElement>('.method-viewport')!
        const items = gsap.utils.toArray<HTMLElement>('.method-step')
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
        items[0]?.classList.add('is-active')

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.method-pin',
            start: 'top top',
            end: () => '+=' + Math.max(window.innerHeight * 1.6, distance() * 1.4),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              items.forEach((el, i) => el.classList.toggle('is-active', self.progress >= (i / items.length) * 0.92))
            },
          },
        })
        tl.to(track, { x: () => -distance(), duration: 1 }, 0)
        tl.fromTo('.method-fill', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
      })

      mm.add(MQ.mobile, () => {
        const items = gsap.utils.toArray<HTMLElement>('.method-step')
        gsap.fromTo(
          '.method-fill-y',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '.method-list', start: 'top 70%', end: 'bottom 60%', scrub: 1 },
          },
        )
        items.forEach((el) => {
          gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top 65%',
              onEnter: () => el.classList.add('is-active'),
              onLeaveBack: () => el.classList.remove('is-active'),
            },
          })
        })
      })

      mm.add(MQ.reduced, () => {
        gsap.utils.toArray<HTMLElement>('.method-step').forEach((el) => el.classList.add('is-active'))
      })
    },
    { scope: root, dependencies: [horizontal], revertOnUpdate: true },
  )

  return (
    <section id="metodo" ref={root} aria-labelledby="metodo-title" className="relative border-t border-line">
      <div className={cn('method-pin relative', horizontal ? 'flex h-[100dvh] flex-col justify-center overflow-hidden' : 'py-[var(--section-y)]')}>
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="metodo-title" className="display h2 lg:col-span-7">
              Como atuamos
            </h2>
            <p className="text-muted lg:col-span-5">
              Quatro etapas com prazo e entrega definidos. Você sabe o que recebe, quando recebe e o que decide em cada uma.
            </p>
          </div>
        </div>

        <div className={cn('method-viewport', horizontal ? 'wrap mt-14 overflow-visible' : 'wrap mt-12')}>
          {horizontal ? (
            <div className="relative">
              <div className="absolute inset-x-0 top-[22px] h-px bg-line-strong" />
              <div className="method-fill absolute inset-x-0 top-[22px] h-px origin-left bg-accent" />
              <ol className="method-track relative flex w-max">
                {steps.map((s) => (
                  <StepItem key={s.index} s={s} className="w-[min(46vw,620px)] pr-16" />
                ))}
              </ol>
            </div>
          ) : (
            <div className="method-list relative pl-8">
              <div className="absolute bottom-0 left-[5px] top-0 w-px bg-line-strong" />
              <div className="method-fill-y absolute bottom-0 left-[5px] top-0 w-px origin-top bg-accent" />
              <ol className="grid gap-12 md:grid-cols-2 md:gap-x-10">
                {steps.map((s) => (
                  <StepItem key={s.index} s={s} vertical />
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      <ScheduleBar />
    </section>
  )
}

function StepItem({ s, className, vertical }: { s: (typeof steps)[number]; className?: string; vertical?: boolean }) {
  return (
    <li className={cn('method-step group relative', className)}>
      <span
        aria-hidden
        className={cn(
          'block size-[11px] border border-line-strong bg-bg transition-colors duration-500 group-[.is-active]:border-accent group-[.is-active]:bg-accent',
          vertical ? 'absolute -left-8 top-1.5' : 'mt-[17px]',
        )}
      />
      <div className={cn(!vertical && 'mt-10', 'transition-opacity duration-500 lg:opacity-40 lg:group-[.is-active]:opacity-100')}>
        <p className="display tnum text-[clamp(4rem,8vw,7.5rem)] leading-none text-faint transition-colors duration-500 group-[.is-active]:text-accent">
          {s.index}
        </p>
        <h3 className="mt-5 font-display text-[var(--fs-h3)] font-bold uppercase [font-stretch:80%]">{s.title}</h3>
        <p className="mt-3 max-w-[42ch] text-muted">{s.text}</p>
        <dl className="mt-6 grid max-w-[46ch] grid-cols-2 border-t border-line pt-4 text-sm">
          <div>
            <dt className="mono text-[10px] text-muted">Prazo</dt>
            <dd className="mt-1 text-text">{s.duration}</dd>
          </div>
          <div>
            <dt className="mono text-[10px] text-muted">Entrega</dt>
            <dd className="mt-1 text-text">{s.deliverable}</dd>
          </div>
        </dl>
      </div>
    </li>
  )
}

function ScheduleBar() {
  return (
    <div className="border-t border-line bg-surface">
      <div className="wrap flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl font-bold uppercase [font-stretch:80%]">Comece pela reunião inicial</p>
          <p className="mt-1 text-muted">60 minutos, presencial no Itaim Bibi ou por vídeo, para todo o Brasil.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => requestMeeting({ modality: 'presencial' })}
            className="inline-flex min-h-12 items-center justify-center gap-3 bg-accent px-6 text-[13px] font-semibold uppercase tracking-[0.06em] text-bg transition-colors hover:bg-accent-hover"
          >
            <MapPin size={18} aria-hidden /> Presencial no Itaim Bibi
          </button>
          <button
            type="button"
            onClick={() => requestMeeting({ modality: 'video' })}
            className="inline-flex min-h-12 items-center justify-center gap-3 border border-line-strong px-6 text-[13px] font-semibold uppercase tracking-[0.06em] text-text transition-colors hover:border-text"
          >
            <VideoCamera size={18} aria-hidden /> Por vídeo
          </button>
        </div>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { CaretLeft } from '@phosphor-icons/react/dist/csr/CaretLeft'
import { CaretRight } from '@phosphor-icons/react/dist/csr/CaretRight'
import { milestones } from '../../data/content'
import { frameSequence, media, type FrameFormat, type FrameSize } from '../../data/media'
import { MQ, ScrollTrigger, gsap, scrollToTarget, useGSAP, useMotionAllowed } from '../../lib/scroll'

const { count: FRAMES, src: frameSrc } = frameSequence

/**
 * Elemento-assinatura. PIN 2: canvas com 120 quadros controlados pelo scrub + 4 legendas na timeline.
 * Movimento reduzido: grade estática com os 4 marcos e quadros-chave.
 */
export function Traverse() {
  const motion = useMotionAllowed()
  return motion ? <TraverseScene /> : <TraverseStatic />
}

function SectionHeading({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mono text-accent-text">Travessia do caso</p>
      <h2 id="travessia-title" className="display mt-3 text-[clamp(2.25rem,5vw,4.5rem)]">
        Por dentro da estratégia
      </h2>
    </div>
  )
}

function TraverseScene() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const frames = useRef<(HTMLImageElement | null)[]>(Array(FRAMES).fill(null))
  const current = useRef(0)
  const trigger = useRef<ScrollTrigger | null>(null)
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  // Tenta AVIF; no primeiro erro de decodificação passa para WebP e repete o quadro.
  const format = useRef<FrameFormat>('avif')
  // Conjunto 1024 ou 1920, decidido uma vez quando o pré-carregamento começa.
  const size = useRef<FrameSize>(1024)

  /** Desenha o quadro pedido ou o carregado mais próximo antes dele (cover manual). */
  const draw = useCallback((index: number) => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    let img: HTMLImageElement | null = null
    for (let i = index; i >= 0 && !img; i--) img = frames.current[i]
    for (let i = index + 1; i < FRAMES && !img; i++) img = frames.current[i]
    if (!img) return
    const cw = c.width
    const ch = c.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.fillStyle = '#0a0a0b'
    ctx.fillRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
  }, [])

  const load = useCallback(
    (i: number) => {
      if (frames.current[i]) return
      const img = new Image()
      img.decoding = 'async'
      const fmt = format.current
      img.onerror = () => {
        if (fmt === 'avif') {
          format.current = 'webp'
          load(i)
        }
      }
      img.src = frameSrc(i + 1, fmt, size.current)
      img.onload = () => {
        frames.current[i] = img
        // Redesenha quando o quadro esperado (ou um mais próximo) chega.
        if (Math.abs(i - current.current) <= 2 || i === 0) draw(current.current)
      }
    },
    [draw],
  )

  // Resize com DPR ≤ 2. O pôster (quadro 1) só baixa quando a cena se aproxima.
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      draw(current.current)
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [draw, load])

  useGSAP(
    () => {
      // Pré-carregamento só quando a cena se aproxima.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 250%',
        once: true,
        onEnter: () => {
          const c = canvas.current
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
          size.current = saveData ? 1024 : frameSequence.sizeFor((c?.clientWidth ?? window.innerWidth) * dpr)
          for (let i = 0; i < FRAMES; i++) load(i)
        },
      })

      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const playhead = { frame: 0 }
        const caps = gsap.utils.toArray<HTMLElement>('.trav-cap')
        const marks = gsap.utils.toArray<HTMLElement>('.trav-mark')
        const counter = root.current?.querySelector<HTMLElement>('.trav-counter')
        const live = root.current?.querySelector<HTMLElement>('.trav-live')

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => '+=' + Math.round(window.innerHeight * (window.innerWidth >= 1024 ? 3.4 : 2.6)),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              let s = 0
              milestones.forEach((m, i) => {
                if (self.progress >= m.at - 0.001) s = i
              })
              if (s !== stepRef.current) {
                stepRef.current = s
                setStep(s)
                if (live) live.textContent = `Etapa ${milestones[s].index}: ${milestones[s].title}. ${milestones[s].text}`
              }
              marks.forEach((m, i) => m.classList.toggle('is-active', i <= s))
            },
          },
        })
        trigger.current = tl.scrollTrigger ?? null

        tl.to(
          playhead,
          {
            frame: FRAMES - 1,
            duration: 1,
            onUpdate: () => {
              const f = Math.round(playhead.frame)
              if (f !== current.current) {
                current.current = f
                draw(f)
                if (counter) counter.textContent = String(f + 1).padStart(3, '0')
              }
            },
          },
          0,
        )
        tl.fromTo('.trav-fill', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)

        // Primeira legenda visível ao fixar; as demais encadeadas.
        gsap.set(caps, { autoAlpha: 0, y: 24 })
        gsap.set(caps[0], { autoAlpha: 1, y: 0 })
        milestones.forEach((m, i) => {
          if (i === 0) return
          tl.to(caps[i - 1], { autoAlpha: 0, y: -24, duration: 0.04 }, m.at - 0.04)
          tl.to(caps[i], { autoAlpha: 1, y: 0, duration: 0.05 }, m.at)
        })
        tl.fromTo('.trav-vignette', { opacity: 0.55 }, { opacity: 0.85, duration: 1 }, 0)

        return () => {
          trigger.current = null
        }
      })
    },
    { scope: root },
  )

  const goTo = (i: number) => {
    const st = trigger.current
    if (!st) return
    const target = Math.max(0, Math.min(milestones.length - 1, i))
    const p = target === 0 ? 0 : milestones[target].at + 0.03
    scrollToTarget(Math.round(st.start + (st.end - st.start) * p) + 2)
  }

  return (
    <section
      id="travessia"
      ref={root}
      aria-labelledby="travessia-title"
      className="relative h-[100dvh] min-h-[560px] overflow-hidden border-t border-line bg-bg"
    >
      <canvas
        ref={canvas}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        width={frameSequence.width}
        height={frameSequence.height}
      />
      <div
        aria-hidden
        className="trav-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--bg)_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/70 to-transparent" />

      <p className="sr-only">
        Sequência controlada pela rolagem: uma advogada desce a escadaria, um contrato é assinado e a sala de reunião aparece à noite, representando as quatro etapas de um caso.
      </p>

      <div className="wrap relative flex h-full flex-col pb-6 pt-[calc(var(--header-h)+28px)] lg:pb-10">
        <div className="flex items-start justify-between gap-6">
          <SectionHeading />
          <p className="mono hidden text-muted sm:block" aria-hidden>
            Quadro <span className="trav-counter tnum text-text">001</span> / {FRAMES}
          </p>
        </div>

        <div className="relative mt-auto min-h-[200px] lg:ml-auto lg:w-[min(520px,42%)]">
          {milestones.map((m, i) => (
            <div key={m.index} className="trav-cap absolute inset-x-0 bottom-0" aria-hidden={step !== i}>
              <p className="mono tnum text-accent-text">
                {m.index} / 0{milestones.length}
              </p>
              <h3 className="display mt-2 text-[clamp(2.75rem,6vw,5rem)]">{m.title}</h3>
              <p className="lead mt-3 max-w-[40ch] text-text">{m.text}</p>
            </div>
          ))}
        </div>
        <p className="trav-live sr-only" aria-live="polite" />

        {/* Régua de progresso com 4 marcos + navegação acessível */}
        <div className="mt-8 flex items-center gap-4 lg:gap-6">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            className="grid size-11 shrink-0 place-items-center border border-line-strong text-text transition-colors hover:border-text disabled:opacity-40"
          >
            <CaretLeft size={18} aria-hidden />
            <span className="sr-only">Etapa anterior</span>
          </button>
          <div className="relative flex-1">
            <div className="h-px w-full bg-line-strong" />
            <div className="trav-fill absolute inset-x-0 top-0 h-px origin-left bg-accent" />
            <ol className="absolute inset-x-0 -top-[5px] flex justify-between" aria-label="Etapas da travessia">
              {milestones.map((m, i) => (
                <li key={m.index} className="relative" style={{ left: 0 }}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={step === i ? 'step' : undefined}
                    className="trav-mark group -m-4 grid place-items-center p-4"
                  >
                    <span className="block size-[11px] border border-line-strong bg-bg transition-colors group-[.is-active]:border-accent group-[.is-active]:bg-accent" />
                    <span className="sr-only">
                      Ir para etapa {m.index}: {m.title}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <button
            type="button"
            onClick={() => goTo(step + 1)}
            disabled={step === milestones.length - 1}
            className="grid size-11 shrink-0 place-items-center border border-line-strong text-text transition-colors hover:border-text disabled:opacity-40"
          >
            <CaretRight size={18} aria-hidden />
            <span className="sr-only">Próxima etapa</span>
          </button>
        </div>
        <p className="mono mt-4 text-[10px] text-muted">
          Sequência: {media.canvasSequence.credit}
        </p>
      </div>
    </section>
  )
}

function TraverseStatic() {
  return (
    <section id="travessia" aria-labelledby="travessia-title" className="relative border-t border-line py-[var(--section-y)]">
      <div className="wrap">
        <SectionHeading />
        <p className="mt-4 max-w-[52ch] text-muted">Os quatro marcos de um caso, do primeiro contato ao encerramento.</p>
        <ol className="mt-12 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <li key={m.index} className="border-b border-r border-line">
              <figure>
                <div className="aspect-video overflow-hidden bg-surface">
                  <picture>
                    <source
                      srcSet={`${frameSrc(m.frame, 'avif', 1024)} 1024w, ${frameSrc(m.frame, 'avif', 1920)} 1920w`}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      type="image/avif"
                    />
                    <img
                      src={frameSrc(m.frame)}
                      alt=""
                      width={frameSequence.width}
                      height={frameSequence.height}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </picture>
                </div>
                <figcaption className="p-6">
                  <p className="mono tnum text-accent-text">{m.index}</p>
                  <h3 className="display mt-2 text-[2.5rem]">{m.title}</h3>
                  <p className="mt-2 text-muted">{m.text}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
        <p className="mono mt-4 text-[10px] text-muted">Quadros: {media.canvasSequence.credit}</p>
      </div>
    </section>
  )
}

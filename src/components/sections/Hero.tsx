import { useEffect, useRef, useState } from 'react'
import { Pause } from '@phosphor-icons/react/dist/csr/Pause'
import { Play } from '@phosphor-icons/react/dist/csr/Play'
import { brand, heroFronts } from '../../data/content'
import { media } from '../../data/media'
import { MQ, gsap, useGSAP, useMotionAllowed } from '../../lib/scroll'
import { ButtonLink } from '../ui/Button'
import { Media } from '../ui/Media'

/**
 * Abertura. PIN 1 (desktop): a timeline de entrada encadeia máscara do título → expansão do retrato
 * → fios de 1px → índice → legenda e CTA. Depois, o scrub fixado reduz o retrato (escala/opacidade)
 * conforme o progresso, fechando o capítulo antes dos pilares.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const motion = useMotionAllowed()
  const [ambientOn, setAmbientOn] = useState(true)
  // O vídeo só ganha src depois do load + ocioso, e só no desktop: não disputa banda com o LCP.
  const [ambientReady, setAmbientReady] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
        intro
          .from('.hero-word', { yPercent: 110, duration: 1.1, stagger: 0.09 })
          .fromTo(
            '.hero-frame',
            { clipPath: 'inset(14% 18% 14% 18%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut' },
            0.25,
          )
          .from('.hero-img', { scale: 1.18, duration: 1.6, ease: 'power3.out' }, 0.25)
          .from('.hero-rule-x', { scaleX: 0, duration: 1, stagger: 0.06, ease: 'power2.inOut' }, 0.7)
          .from('.hero-rule-y', { scaleY: 0, duration: 1, stagger: 0.06, ease: 'power2.inOut' }, 0.7)
          .from('.hero-index', { opacity: 0, y: 8, duration: 0.5, stagger: 0.08 }, 1.05)
          .to('.hero-index-active', { color: 'var(--accent-text)', duration: 0.4 }, 1.4)
          .from('.hero-cap', { opacity: 0, y: 18, duration: 0.8, stagger: 0.1 }, 1.2)
      })

      // Progresso do scroll → escala e opacidade do retrato (pin no desktop).
      mm.add(MQ.desktop, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: '+=90%',
              pin: true,
              scrub: 1,
            },
          })
          .to('.hero-scrub', { scale: 1.14, opacity: 0.28, ease: 'none' }, 0)
          .to('.hero-title', { yPercent: -18, ease: 'none' }, 0)
          .to('.hero-ambient', { opacity: 0.22, ease: 'none' }, 0)
          .to('.hero-cap-wrap', { opacity: 0, y: -24, ease: 'none' }, 0.35)
      })

      mm.add(MQ.mobile, () => {
        gsap.to('.hero-scrub', {
          scale: 1.1,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
        })
      })
    },
    { scope: root },
  )

  useEffect(() => {
    if (!motion || !window.matchMedia('(min-width: 1024px)').matches) return
    let idle = 0
    const ready = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300))
      idle = ric(() => setAmbientReady(true), { timeout: 2500 })
    }
    if (document.readyState === 'complete') ready()
    else window.addEventListener('load', ready, { once: true })
    return () => {
      window.removeEventListener('load', ready)
      ;(window.cancelIdleCallback ?? window.clearTimeout)(idle)
    }
  }, [motion])

  // Ambiência só com movimento permitido; pausa fora da viewport.
  useEffect(() => {
    const v = video.current
    if (!v || !motion || !ambientReady) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && ambientOn) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [motion, ambientOn, ambientReady])

  const toggleAmbient = () => {
    const v = video.current
    setAmbientOn((on) => {
      if (v) on ? v.pause() : v.play().catch(() => {})
      return !on
    })
  }

  return (
    <section
      id="inicio"
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden lg:h-[100dvh] lg:min-h-[680px]"
    >
      {motion && (
        <video
          ref={video}
          className="hero-ambient pointer-events-none absolute inset-0 -z-10 hidden h-full w-full lg:block object-cover opacity-[0.14] mix-blend-luminosity"
          src={ambientReady ? media.heroAmbient.src : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
        />
      )}

      {/* Grade estrutural de 1px */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="wrap relative h-full">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="hero-rule-y rule-y absolute bottom-0 top-[var(--header-h)] hidden lg:block"
              style={{ left: `calc(var(--gutter) + (100% - 2 * var(--gutter)) * ${i / 4})` }}
            />
          ))}
        </div>
      </div>

      <div className="wrap relative grid gap-y-8 pb-10 pt-[calc(var(--header-h)+20px)] lg:h-full lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-0 lg:pb-0 lg:pt-[var(--header-h)]">
        {/* Retrato */}
        <div className="relative order-1 lg:order-none lg:col-span-5 lg:col-start-7 lg:row-start-1 lg:mt-6 lg:self-stretch">
          <div className="hero-scrub relative mx-auto aspect-[4/5] max-h-[58dvh] origin-center sm:max-h-[64dvh] lg:h-full lg:max-h-none lg:w-full">
            <figure className="hero-frame relative h-full w-full overflow-hidden bg-surface">
              <Media name="hero" priority className="hero-img origin-[51%_43%]" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/80 to-transparent" />
              <figcaption className="mono absolute left-3 right-3 top-3 flex justify-between lg:bottom-3 lg:top-auto gap-3 text-[10px] text-muted">
                <span>Sócia-fundadora</span>
                <span>Imagem ilustrativa</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Texto superior esquerdo */}
        <div className="hero-cap-wrap relative z-10 order-3 lg:order-none lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:justify-start lg:pr-10 lg:pt-14">
          <p className="hero-cap mono text-muted">
            {brand.tagline} · {brand.city}
          </p>
          <p className="hero-cap lead mt-5 max-w-[34ch] text-text">
            Consultoria e contencioso para empresas, sócios e famílias que precisam decidir com clareza antes de agir.
          </p>
          <div className="hero-cap mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#contato" arrow>
              Agendar Reunião
            </ButtonLink>
            <ButtonLink href="#pilares" variant="secondary">
              Saiba Mais
            </ButtonLink>
          </div>
        </div>

        {/* Título monumental, sobreposto à grade e ao retrato */}
        <h1
          id="hero-title"
          className="hero-title display monument relative z-20 order-2 -mt-16 sm:-mt-24 lg:order-none lg:col-span-12 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-end lg:pb-6"
        >
          <span className="block">
            <span className="mask-line"><span className="hero-word">Direito</span></span>{' '}
            <span className="mask-line"><span className="hero-word text-accent">&amp;</span></span>
          </span>
          <span className="block">
            <span className="mask-line"><span className="hero-word">Estratégia</span></span>
          </span>
        </h1>

        {/* Índice das frentes */}
        <div className="relative order-4 lg:order-none lg:col-span-12 lg:col-start-1 lg:row-start-2">
          <span aria-hidden className="hero-rule-x rule-x absolute inset-x-0 top-0" />
          <ul className="grid grid-cols-2 sm:grid-cols-4" aria-label="Frentes de atuação">
            {heroFronts.map((f, i) => (
              <li key={f} className="relative flex items-baseline gap-3 py-4 pr-4 sm:py-5">
                {i > 0 && <span aria-hidden className="hero-rule-y rule-y absolute bottom-0 left-0 top-0 hidden sm:block" />}
                <span className={`hero-index mono tnum text-faint ${i === 0 ? 'hero-index-active' : ''} sm:pl-4`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="hero-index text-sm text-muted">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {motion && (
        <button
          type="button"
          onClick={toggleAmbient}
          aria-pressed={!ambientOn}
          className="mono absolute right-[var(--gutter)] top-[calc(var(--header-h)+12px)] z-30 hidden min-h-11 items-center gap-2 border border-line bg-bg/60 px-3 text-[10px] text-muted backdrop-blur hover:text-text lg:inline-flex"
        >
          {ambientOn ? <Pause size={12} aria-hidden /> : <Play size={12} aria-hidden />}
          {ambientOn ? 'Pausar ambiência' : 'Retomar ambiência'}
        </button>
      )}
    </section>
  )
}

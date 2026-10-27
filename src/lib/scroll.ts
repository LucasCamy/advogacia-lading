import { useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, useGSAP }

/* ------------------------------------------------------------------ */
/* Preferência de movimento                                            */
/* ------------------------------------------------------------------ */

/** `?movimento=1` força as animações mesmo com "reduzir movimento" ligado no sistema. */
export const FORCE_MOTION =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('movimento') === '1'

if (FORCE_MOTION) document.documentElement.classList.add('force-motion')

const MOTION = FORCE_MOTION ? '(min-width: 0px)' : '(prefers-reduced-motion: no-preference)'

/** Queries para `gsap.matchMedia()`, combinando movimento permitido com breakpoints. */
export const MQ = {
  motion: MOTION,
  reduced: FORCE_MOTION ? 'not all' : '(prefers-reduced-motion: reduce)',
  desktop: `${MOTION} and (min-width: 1024px)`,
  tablet: `${MOTION} and (min-width: 768px)`,
  mobile: `${MOTION} and (max-width: 1023.98px)`,
  phone: `${MOTION} and (max-width: 767.98px)`,
} as const

function subscribeMq(query: string) {
  return (cb: () => void) => {
    const m = window.matchMedia(query)
    m.addEventListener('change', cb)
    return () => m.removeEventListener('change', cb)
  }
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribeMq(query),
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** true quando a página pode animar (sem reduce, ou com ?movimento=1). */
export function useMotionAllowed() {
  return useMediaQuery(MOTION)
}

export function motionAllowedNow() {
  return window.matchMedia(MOTION).matches
}

/* ------------------------------------------------------------------ */
/* Lenis                                                               */
/* ------------------------------------------------------------------ */

let lenis: Lenis | null = null
let tick: ((time: number) => void) | null = null
let locks = 0

export const HEADER_OFFSET = 72

export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({ lerp: 0.085 })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  if (locks > 0) lenis.stop()
  return lenis
}

export function destroyLenis() {
  if (tick) gsap.ticker.remove(tick)
  lenis?.destroy()
  lenis = null
  tick = null
}

export const getLenis = () => lenis

/** Trava o scroll (diálogos, gaveta, menu mobile). Contador permite diálogos aninhados. */
export function lockScroll() {
  locks += 1
  lenis?.stop()
  document.documentElement.classList.add('scroll-locked')
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) {
    lenis?.start()
    document.documentElement.classList.remove('scroll-locked')
  }
}

/** Rola até um elemento ou posição respeitando Lenis e o header fixo. */
export function scrollToTarget(target: string | HTMLElement | number, opts: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, {
      // Lenis já desconta o scroll-padding-top do html (= altura do header).
      offset: 0,
      immediate: opts.immediate,
      duration: 1.4,
    })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'auto' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top, behavior: 'auto' })
}

/** Âncoras internas (a[href^="#"]) passam por scrollToTarget: funciona com e sem Lenis e respeita o header. */
export function bindAnchors() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]')
    if (!a) return
    const href = a.getAttribute('href')
    if (!href || href.length < 2) return
    const el = document.getElementById(href.slice(1))
    if (!el) return
    e.preventDefault()
    scrollToTarget(el)
    history.replaceState(null, '', href)
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

/** Recalcula gatilhos após mudanças de altura (fontes, filtros, acordeão). */
export function refreshScroll() {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

if (typeof document !== 'undefined') {
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh())
}

import { useRef } from 'react'
import { metrics } from '../../data/content'
import { MQ, ScrollTrigger, gsap, useGSAP } from '../../lib/scroll'

/** Faixa de métricas: gatilhos de entrada desenham os fios e disparam os contadores. */
export function Metrics() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const nums = gsap.utils.toArray<HTMLElement>('.metric-num')
        nums.forEach((el) => {
          el.textContent = '0'
        })
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.from('.metric-rule-x', { scaleX: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.1 })
            gsap.from('.metric-rule-y', { scaleY: 0, duration: 1, ease: 'power2.inOut', stagger: 0.1, delay: 0.2 })
            nums.forEach((el, i) => {
              const target = Number(el.dataset.value)
              const o = { v: 0 }
              gsap.to(o, {
                v: target,
                duration: 1.6,
                delay: 0.15 * i,
                ease: 'power3.out',
                onUpdate: () => {
                  el.textContent = String(Math.round(o.v))
                },
              })
            })
          },
        })
        return () => nums.forEach((el) => (el.textContent = el.dataset.value ?? ''))
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="wrap">
      <div className="relative">
        <span aria-hidden className="metric-rule-x rule-x absolute inset-x-0 top-0" />
        <span aria-hidden className="metric-rule-x rule-x absolute inset-x-0 bottom-0" />
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={m.label} className={`relative px-4 py-8 sm:px-6 lg:py-12 ${i === 0 ? 'pl-0 sm:pl-0' : ''} ${i === 2 ? 'pl-0 sm:pl-0 lg:pl-6' : ''}`}>
              {i > 0 && <span aria-hidden className={`metric-rule-y rule-y absolute bottom-0 left-0 top-0 ${i === 2 ? 'hidden lg:block' : ''}`} />}
              {i >= 2 && <span aria-hidden className="rule-x absolute inset-x-0 top-0 lg:hidden" />}
              <dt className="mono text-muted">{m.label}</dt>
              <dd className="mt-4">
                <span className="sr-only">
                  {m.value}
                  {m.suffix} {m.label.toLowerCase()}, {m.note}
                </span>
                <span aria-hidden className="display tnum block text-[clamp(3.5rem,8vw,7rem)] text-text">
                  <span className="metric-num" data-value={m.value}>
                    {m.value}
                  </span>
                  <span className="text-accent">{m.suffix}</span>
                </span>
                <span aria-hidden className="mt-2 block text-sm text-muted">
                  {m.note}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mono mt-4 text-[10px] text-muted">Números demonstrativos de um escritório fictício.</p>
    </div>
  )
}

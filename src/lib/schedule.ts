import { scheduleStore, type Modality } from './store'
import { getLenis, scrollToTarget } from './scroll'

/** Leva o visitante ao formulário já preenchido com a área e/ou modalidade escolhidas. */
export function requestMeeting(intent: { area?: string; modality?: Modality } = {}) {
  const current = scheduleStore.get()
  scheduleStore.set({
    area: intent.area ?? current.area,
    modality: intent.modality ?? current.modality,
    stamp: Date.now(),
  })
  // Espera o diálogo fechar e liberar o scroll antes de rolar.
  requestAnimationFrame(() => {
    scrollToTarget('#formulario')
    const focusField = () => document.getElementById('f-nome')?.focus({ preventScroll: true })
    const lenis = getLenis()
    if (lenis) window.setTimeout(focusField, 1450)
    else focusField()
  })
}

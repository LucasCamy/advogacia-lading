import { useSyncExternalStore } from 'react'

/** Store mínima com subscribe, compartilhada entre seções sem prop drilling. */
export function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<() => void>()
  return {
    get: () => state,
    set(next: Partial<T>) {
      state = { ...state, ...next }
      listeners.forEach((l) => l())
    },
    subscribe(l: () => void) {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

export function useStore<T, S>(store: ReturnType<typeof createStore<T>>, select: (s: T) => S) {
  return useSyncExternalStore(store.subscribe, () => select(store.get()), () => select(store.get()))
}

/** Capítulo ativo (indicador de progresso + nav). */
export const chapterStore = createStore({ active: 'inicio' })

export type Modality = 'presencial' | 'video'

/** Intenção de agendamento: preenchida por Explorar/Método/Equipe e lida pelo formulário. */
export const scheduleStore = createStore<{ area: string; modality: Modality; stamp: number }>({
  area: '',
  modality: 'presencial',
  stamp: 0,
})

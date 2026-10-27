import { lazy, type ComponentType } from 'react'

/**
 * React.lazy com `preload()`: o chunk é baixado na intenção (hover/foco/toque no gatilho)
 * e o diálogo abre sem espera no clique.
 */
export function lazyWithPreload<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  let promise: Promise<{ default: T }> | null = null
  const load = () => (promise ??= factory())
  return Object.assign(lazy(load), { preload: load })
}

/** Props para o elemento que abre o diálogo: pré-carrega o chunk na intenção. */
export const preloadOn = (preload: () => unknown) => ({
  onPointerEnter: () => void preload(),
  onFocus: () => void preload(),
  onTouchStart: () => void preload(),
})

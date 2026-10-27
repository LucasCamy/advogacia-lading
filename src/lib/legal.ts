import { createStore } from './store'
import { lazyWithPreload } from './lazy'

export type LegalDoc = 'privacidade' | 'termos' | 'cookies'

/** Documento legal aberto. Fica fora do diálogo para quem abre não carregar o chunk dele. */
export const legalStore = createStore<{ doc: LegalDoc | null }>({ doc: null })

export const LegalDialogLazy = lazyWithPreload(() =>
  import('../components/dialogs/LegalDialog').then((m) => ({ default: m.LegalDialog })),
)

export const openLegal = (doc: LegalDoc) => {
  void LegalDialogLazy.preload()
  legalStore.set({ doc })
}

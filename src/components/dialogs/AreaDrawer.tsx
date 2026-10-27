import { useEffect, useState } from 'react'
import type { Area } from '../../data/content'
import { requestMeeting } from '../../lib/schedule'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'

/** Gaveta acessível com o escopo completo da área. Pausa o Lenis via Dialog. */
export function AreaDrawer({ area, onClose }: { area: Area | null; onClose: () => void }) {
  // Mantém o conteúdo durante o fechamento para não piscar vazio.
  const [shown, setShown] = useState<Area | null>(area)
  useEffect(() => {
    if (area) setShown(area)
  }, [area])

  const schedule = () => {
    if (!shown) return
    onClose()
    requestMeeting({ area: shown.id })
  }

  return (
    <Dialog open={Boolean(area)} onClose={onClose} labelledBy="area-title" variant="drawer" closeLabel="Fechar detalhes da área">
      {shown && (
        <article className="flex min-h-full flex-col">
          <header className="border-b border-line px-6 pb-8 pt-16 sm:px-10">
            <p className="mono tnum text-accent-text">Frente {shown.index}</p>
            <h2 id="area-title" className="display mt-3 text-[clamp(2.25rem,6vw,3.5rem)]">
              {shown.title}
            </h2>
            <p className="mt-4 text-muted">{shown.summary}</p>
          </header>

          <div className="grid gap-10 px-6 py-8 sm:px-10">
            <Block title="Escopo">
              <ul className="grid gap-3">
                {shown.scope.map((s) => (
                  <li key={s} className="flex gap-3 border-t border-line pt-3 text-text">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Situações típicas">
              <ul className="grid gap-3">
                {shown.situations.map((s, i) => (
                  <li key={s} className="flex gap-4 border-t border-line pt-3 text-muted">
                    <span className="mono tnum text-faint">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-text">{s}</span>
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Documentos para a primeira reunião">
              <ul className="grid gap-2 text-muted">
                {shown.documents.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span aria-hidden className="text-accent-text">·</span>
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Não envie documentos pelo site. Depois do agendamento, indicamos um canal seguro.</p>
            </Block>
          </div>

          <footer className="sticky bottom-0 mt-auto border-t border-line bg-surface px-6 py-5 sm:px-10">
            <Button arrow onClick={schedule} className="w-full sm:w-auto">
              Agendar sobre esta área<span className="sr-only">: {shown.title}</span>
            </Button>
          </footer>
        </article>
      )}
    </Dialog>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mono mb-4 text-muted">{title}</h3>
      {children}
    </section>
  )
}

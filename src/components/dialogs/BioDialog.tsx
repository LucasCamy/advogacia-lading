import { useEffect, useState } from 'react'
import { Info } from '@phosphor-icons/react/dist/csr/Info'
import type { Member } from '../../data/content'
import { media } from '../../data/media'
import { requestMeeting } from '../../lib/schedule'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Media } from '../ui/Media'

export function BioDialog({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const [shown, setShown] = useState<Member | null>(member)
  useEffect(() => {
    if (member) setShown(member)
  }, [member])

  return (
    <Dialog open={Boolean(member)} onClose={onClose} labelledBy="bio-title" closeLabel="Fechar trajetória" className="!w-[min(960px,calc(100vw-32px))]">
      {shown && (
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="relative aspect-[4/3] bg-surface md:aspect-auto md:min-h-full">
            <Media name={shown.photo} className="absolute inset-0" />
          </div>
          <div className="p-6 pt-14 sm:p-10">
            <p className="mono text-accent-text">{shown.role}</p>
            <h2 id="bio-title" className="display mt-2 text-[clamp(2.25rem,5vw,3.25rem)]">
              {shown.name}
            </h2>
            <p className="mt-2 text-muted">
              {shown.specialty} · {shown.oab}
            </p>

            <div className="mt-8 space-y-3">
              {shown.bio.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </div>

            <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
              <Col title="Formação" items={shown.education} />
              <Col title="Idiomas" items={shown.languages} />
              <Col title="Foco atual" items={shown.focus} />
            </dl>

            <p className="mt-8 flex items-start gap-2 border border-line p-4 text-sm text-muted">
              <Info size={16} aria-hidden className="mt-0.5 shrink-0" />
              <span>
                Imagem ilustrativa: {media[shown.photo].credit}. O retrato não identifica a pessoa descrita; currículo e
                nome são fictícios, para demonstração.
              </span>
            </p>

            <Button
              arrow
              className="mt-8 w-full sm:w-auto"
              onClick={() => {
                onClose()
                requestMeeting()
              }}
            >
              Agendar reunião
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

function Col({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <dt className="mono text-muted">{title}</dt>
      <dd className="mt-3">
        <ul className="space-y-1 text-sm">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </dd>
    </div>
  )
}

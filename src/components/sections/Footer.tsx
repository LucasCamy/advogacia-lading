import { ArrowUp } from '@phosphor-icons/react'
import { PENDING, brand, navItems } from '../../data/content'
import { credits, frameSequence } from '../../data/media'
import { openLegal } from '../dialogs/LegalDialog'
import { Wordmark } from '../nav/Navbar'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark className="text-[34px]" />
          <p className="mt-3 text-muted">
            {brand.tagline} · {brand.city}
          </p>
          <p className="mt-6 max-w-[40ch] text-sm text-muted">{brand.descriptor}.</p>
          <p className="mono mt-6 text-[10px] leading-relaxed text-muted">
            {PENDING.razaoSocial}
            <br />
            {PENDING.cnpj}
            <br />
            {PENDING.oab}
          </p>
        </div>

        <nav aria-label="Rodapé" className="lg:col-span-2">
          <p className="mono text-muted">Página</p>
          <ul className="mt-4 space-y-1">
            {navItems.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="link-underline inline-flex min-h-9 items-center text-sm">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contato" className="link-underline inline-flex min-h-9 items-center text-sm">
                Contato
              </a>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <p className="mono text-muted">Legal</p>
          <ul className="mt-4 space-y-1">
            <li>
              <button type="button" onClick={() => openLegal('privacidade')} className="link-underline min-h-9 text-left text-sm">
                Política de Privacidade
              </button>
            </li>
            <li>
              <button type="button" onClick={() => openLegal('termos')} className="link-underline min-h-9 text-left text-sm">
                Termos de Uso
              </button>
            </li>
            <li>
              <button type="button" onClick={() => openLegal('cookies')} className="link-underline min-h-9 text-left text-sm">
                Cookies
              </button>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="mono text-muted">Créditos de imagem</p>
          <ul className="mt-4 space-y-2 text-[13px] text-muted">
            {credits.map((c) => (
              <li key={c.file}>
                <span className="text-text">{c.credit}</span>
                {c.licenseUrl && (
                  <>
                    {' · '}
                    <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2 hover:text-text">
                      licença
                    </a>
                  </>
                )}
                {c.sourcePage && (
                  <>
                    {' · '}
                    <a href={c.sourcePage} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2 hover:text-text">
                      origem
                    </a>
                  </>
                )}
                {c.representative && <span> · retrato ilustrativo</span>}
                <span className="block text-[12px] text-muted/80">{c.label}</span>
              </li>
            ))}
            <li>
              <span className="text-text">{frameSequence.credit}</span> · sequência da Travessia (120 quadros)
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-4 py-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Demonstração de projeto. Marca, pessoas, números e currículos são fictícios. Conteúdo informativo, sem promessa de resultado.
          </p>
          <a href="#inicio" className="inline-flex min-h-11 shrink-0 items-center gap-2 hover:text-text">
            <ArrowUp size={14} aria-hidden /> Voltar ao topo
          </a>
        </div>
      </div>
    </footer>
  )
}

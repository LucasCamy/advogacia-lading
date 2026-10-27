import { useRef } from 'react'
import { Warning } from '@phosphor-icons/react/dist/csr/Warning'
import { PENDING, brand, contactEmail } from '../../data/content'
import { useStore } from '../../lib/store'
import { legalStore, type LegalDoc } from '../../lib/legal'
import { cn } from '../../lib/cn'
import { Dialog } from '../ui/Dialog'


const TABS: { id: LegalDoc; label: string }[] = [
  { id: 'privacidade', label: 'Privacidade' },
  { id: 'termos', label: 'Termos de uso' },
  { id: 'cookies', label: 'Cookies' },
]

/**
 * MINUTAS para revisão jurídica, não textos definitivos.
 * Campos de identificação ausentes ficam como pendentes visíveis (ver conformidade-legal.md).
 */
export function LegalDialog() {
  const doc = useStore(legalStore, (s) => s.doc)
  const tabsRef = useRef<HTMLDivElement>(null)
  const active = doc ?? 'privacidade'

  const onKey = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === active)
    let n = -1
    if (e.key === 'ArrowRight') n = (i + 1) % TABS.length
    if (e.key === 'ArrowLeft') n = (i - 1 + TABS.length) % TABS.length
    if (e.key === 'Home') n = 0
    if (e.key === 'End') n = TABS.length - 1
    if (n < 0) return
    e.preventDefault()
    legalStore.set({ doc: TABS[n].id })
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[n]?.focus()
  }

  return (
    <Dialog open={doc !== null} onClose={() => legalStore.set({ doc: null })} labelledBy="legal-title" closeLabel="Fechar documentos legais">
      <div className="px-6 pb-10 pt-14 sm:px-10">
        <h2 id="legal-title" className="display text-[clamp(2rem,5vw,3rem)]">
          Documentos legais
        </h2>
        <p className="mt-4 flex items-start gap-2 border border-accent/50 p-3 text-sm text-text">
          <Warning size={18} className="mt-0.5 shrink-0 text-accent-text" aria-hidden />
          Minuta para revisão jurídica. Não publicar como texto definitivo. Campos entre colchetes estão pendentes.
        </p>

        <div ref={tabsRef} role="tablist" aria-label="Documento" className="mt-8 flex flex-wrap gap-2 border-b border-line" onKeyDown={onKey}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === t.id ? 0 : -1}
              onClick={() => legalStore.set({ doc: t.id })}
              className={cn(
                '-mb-px min-h-11 border-b-2 px-3 text-sm font-medium transition-colors',
                active === t.id ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} tabIndex={0} className="legal mt-6 space-y-4 text-[15px] leading-relaxed text-muted [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-text">
          {active === 'privacidade' && <Privacy />}
          {active === 'termos' && <Terms />}
          {active === 'cookies' && <Cookies />}
        </div>
      </div>
    </Dialog>
  )
}

function Controller() {
  return (
    <p>
      Controlador: {PENDING.razaoSocial}, {PENDING.cnpj}, {PENDING.oab}, com sede em {PENDING.endereco}, São Paulo, SP. Encarregado
      pelo tratamento de dados: {PENDING.encarregado}. Contato: {contactEmail}.
    </p>
  )
}

function Privacy() {
  return (
    <>
      <p className="mono text-[10px]">Política de Privacidade · versão minuta · {PENDING.atualizacao}</p>
      <Controller />
      <h3>Quais dados coletamos</h3>
      <p>
        Apenas o que você informa no formulário de solicitação de reunião: nome, e-mail, telefone (opcional), perfil de atendimento,
        área de interesse, modalidade e uma descrição breve do assunto. O site não usa cookies de rastreamento, pixels de anúncio nem
        ferramentas de analytics.
      </p>
      <h3>Para que usamos</h3>
      <p>
        Para responder à sua solicitação e agendar a reunião inicial. Base legal provável: procedimentos preliminares relacionados a
        contrato, a pedido do titular (LGPD, art. 7º, V). A confirmar pelo jurídico.
      </p>
      <h3>Compartilhamento</h3>
      <p>Não vendemos nem compartilhamos dados para marketing. Fornecedores de e-mail e hospedagem: [lista de operadores: pendente].</p>
      <h3>Por quanto tempo</h3>
      <p>[Prazo de retenção de solicitações não convertidas em contrato: pendente de definição.]</p>
      <h3>Seus direitos</h3>
      <p>
        Você pode pedir confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação e informações sobre
        compartilhamento, além de revogar consentimentos, escrevendo para {contactEmail}.
      </p>
      <h3>Nesta demonstração</h3>
      <p>O formulário não envia nem armazena dados: o envio é simulado no seu navegador.</p>
    </>
  )
}

function Terms() {
  return (
    <>
      <p className="mono text-[10px]">Termos de Uso · versão minuta · {PENDING.atualizacao}</p>
      <Controller />
      <h3>Natureza do conteúdo</h3>
      <p>
        O conteúdo deste site é informativo, conforme as regras de publicidade da advocacia (Provimento CFOAB 205/2021, a confirmar).
        Não constitui consulta jurídica nem cria relação advogado e cliente.
      </p>
      <h3>Contratação</h3>
      <p>A prestação de serviços depende de análise de conflito de interesses e de contrato de honorários escrito.</p>
      <h3>Propriedade intelectual</h3>
      <p>
        Textos e marca pertencem a {brand.name}. Imagens de terceiros seguem as licenças indicadas nos créditos do rodapé.
      </p>
      <h3>Conteúdo demonstrativo</h3>
      <p>Esta página é uma demonstração: nomes, números, currículos e retratos são fictícios ou ilustrativos.</p>
    </>
  )
}

function Cookies() {
  return (
    <>
      <p className="mono text-[10px]">Política de Cookies · versão minuta · {PENDING.atualizacao}</p>
      <p>
        Este site não define cookies próprios nem carrega rastreadores de terceiros. As fontes são hospedadas no próprio site e nenhum
        script externo é carregado.
      </p>
      <p>
        Por isso não exibimos banner de consentimento. Se analytics, mapas ou vídeos incorporados forem adicionados, esta política e a
        necessidade de consentimento precisam ser revistas (guia de cookies da ANPD).
      </p>
      <table className="w-full border border-line text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="p-3 font-medium text-text">Armazenamento</th>
            <th scope="col" className="p-3 font-medium text-text">Finalidade</th>
            <th scope="col" className="p-3 font-medium text-text">Duração</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">Nenhum</td>
            <td className="p-3">Não se aplica</td>
            <td className="p-3">Não se aplica</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

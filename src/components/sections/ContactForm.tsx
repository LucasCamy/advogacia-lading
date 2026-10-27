import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle, CircleNotch, WarningCircle } from '@phosphor-icons/react'
import { areas } from '../../data/content'
import { scheduleStore, useStore, type Modality } from '../../lib/store'
import { openLegal } from '../dialogs/LegalDialog'
import { cn } from '../../lib/cn'

type Fields = {
  nome: string
  email: string
  telefone: string
  perfil: string
  area: string
  modalidade: Modality
  mensagem: string
}
type Errors = Partial<Record<keyof Fields, string>>

const EMPTY: Fields = { nome: '', email: '', telefone: '', perfil: '', area: '', modalidade: 'presencial', mensagem: '' }
const MAX_MSG = 600

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (f.nome.trim().length < 3) e.nome = 'Informe seu nome completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Informe um e-mail válido, como nome@empresa.com.br.'
  const digits = f.telefone.replace(/\D/g, '')
  if (f.telefone && (digits.length < 10 || digits.length > 11)) e.telefone = 'Use DDD + número, com 10 ou 11 dígitos.'
  if (!f.perfil) e.perfil = 'Escolha para quem é o atendimento.'
  if (f.mensagem.trim().length < 20) e.mensagem = 'Descreva o assunto em pelo menos 20 caracteres.'
  if (f.mensagem.length > MAX_MSG) e.mensagem = `Use no máximo ${MAX_MSG} caracteres.`
  return e
}

/**
 * Solicitação de reunião inicial. SEM BACKEND: o envio é simulado localmente e nenhum dado sai do navegador.
 * Base legal provável: procedimentos preliminares a pedido do titular (aviso junto ao botão, sem aceite obrigatório).
 * Confirmar com o jurídico antes de integrar.
 */
export function ContactForm() {
  const [f, setF] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const intent = useStore(scheduleStore, (s) => s)

  // Pré-preenchimento vindo de Explorar / Método / Trajetória.
  useEffect(() => {
    if (!intent.stamp) return
    setStatus('idle')
    setF((cur) => ({
      ...cur,
      area: intent.area || cur.area,
      modalidade: intent.modality,
      perfil: cur.perfil || (intent.area ? (areas.find((a) => a.id === intent.area)?.profiles[0] === 'familia' ? 'pessoa' : 'empresa') : ''),
    }))
  }, [intent])

  const successRef = useCallback((node: HTMLDivElement | null) => {
    node?.focus()
  }, [])

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    setF((cur) => ({ ...cur, [k]: v }))
    if (errors[k]) setErrors((cur) => ({ ...cur, [k]: undefined }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const errs = validate(f)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 1400)
  }

  const reset = () => {
    setF(EMPTY)
    setErrors({})
    setStatus('idle')
    requestAnimationFrame(() => document.getElementById('f-nome')?.focus())
  }

  if (status === 'sent') {
    const area = areas.find((a) => a.id === f.area)
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border border-line p-8 outline-none sm:p-10">
        <CheckCircle size={32} weight="light" className="text-success" aria-hidden />
        <h3 className="display mt-4 text-[clamp(2rem,4vw,3rem)]">Solicitação registrada</h3>
        <p className="mt-3 max-w-[52ch] text-muted">
          Obrigado, {f.nome.split(' ')[0]}. Em um site real, a equipe responderia em até 1 dia útil para confirmar a reunião{' '}
          {f.modalidade === 'presencial' ? 'presencial no Itaim Bibi' : 'por vídeo'}
          {area ? ` sobre ${area.title}` : ''}.
        </p>
        <p className="mono mt-6 text-[10px] text-muted">Demonstração: nenhum dado foi enviado ou armazenado.</p>
        <button type="button" onClick={reset} className="link-underline mt-6 min-h-11 text-sm font-semibold uppercase tracking-[0.06em] text-accent-text">
          Enviar nova solicitação
        </button>
      </div>
    )
  }

  const sending = status === 'sending'
  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-labelledby="form-title" aria-busy={sending}>
      <h3 id="form-title" className="font-display text-[var(--fs-h3)] font-bold uppercase [font-stretch:80%]">
        Solicitar reunião inicial
      </h3>
      <p className="mt-2 text-muted">Campos com * são obrigatórios. Respondemos em até 1 dia útil.</p>

      {errorCount > 0 && (
        <p role="alert" className="mt-6 flex items-center gap-2 border border-danger/50 p-3 text-sm text-text">
          <WarningCircle size={18} className="shrink-0 text-danger" aria-hidden />
          {errorCount === 1 ? 'Há 1 campo para corrigir.' : `Há ${errorCount} campos para corrigir.`}
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field id="f-nome" label="Nome completo *" error={errors.nome}>
          <input id="f-nome" name="nome" autoComplete="name" value={f.nome} onChange={(e) => set('nome', e.target.value)} disabled={sending} {...aria('f-nome', errors.nome)} className={inputCls(errors.nome)} />
        </Field>
        <Field id="f-email" label="E-mail *" error={errors.email}>
          <input id="f-email" name="email" type="email" autoComplete="email" inputMode="email" value={f.email} onChange={(e) => set('email', e.target.value)} disabled={sending} {...aria('f-email', errors.email)} className={inputCls(errors.email)} />
        </Field>
        <Field id="f-telefone" label="Telefone" hint="Opcional. DDD + número." error={errors.telefone}>
          <input id="f-telefone" name="telefone" type="tel" autoComplete="tel" inputMode="tel" value={f.telefone} onChange={(e) => set('telefone', e.target.value)} disabled={sending} {...aria('f-telefone', errors.telefone, true)} className={inputCls(errors.telefone)} />
        </Field>
        <Field id="f-perfil" label="Atendimento para *" error={errors.perfil}>
          <select id="f-perfil" name="perfil" value={f.perfil} onChange={(e) => set('perfil', e.target.value)} disabled={sending} {...aria('f-perfil', errors.perfil)} className={inputCls(errors.perfil)}>
            <option value="">Selecione</option>
            <option value="empresa">Empresa ou sócios</option>
            <option value="pessoa">Pessoa física ou família</option>
          </select>
        </Field>
        <Field id="f-area" label="Área de interesse" hint="Opcional." className="sm:col-span-2">
          <select id="f-area" name="area" value={f.area} onChange={(e) => set('area', e.target.value)} disabled={sending} aria-describedby="f-area-hint" className={inputCls()}>
            <option value="">Ainda não sei</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.index} · {a.title}
              </option>
            ))}
          </select>
        </Field>

        <fieldset className="sm:col-span-2" disabled={sending}>
          <legend className="text-sm font-medium">Modalidade da reunião</legend>
          <div className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2">
            {(
              [
                ['presencial', 'Presencial', 'Itaim Bibi, São Paulo'],
                ['video', 'Por vídeo', 'Link enviado por e-mail'],
              ] as const
            ).map(([v, label, sub]) => (
              <label key={v} className={cn('flex min-h-14 cursor-pointer items-center gap-3 bg-bg px-4 py-3 transition-colors', f.modalidade === v && 'bg-raised')}>
                <input type="radio" name="modalidade" value={v} checked={f.modalidade === v} onChange={() => set('modalidade', v)} className="size-4 accent-[var(--accent)]" />
                <span>
                  <span className="block text-[15px]">{label}</span>
                  <span className="block text-sm text-muted">{sub}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          id="f-mensagem"
          label="Assunto *"
          hint={`Em poucas linhas, sem dados sigilosos do caso. ${f.mensagem.length}/${MAX_MSG}`}
          error={errors.mensagem}
          className="sm:col-span-2"
        >
          <textarea id="f-mensagem" name="mensagem" rows={4} maxLength={MAX_MSG + 50} value={f.mensagem} onChange={(e) => set('mensagem', e.target.value)} disabled={sending} {...aria('f-mensagem', errors.mensagem, true)} className={cn(inputCls(errors.mensagem), 'min-h-32 resize-y py-3')} />
        </Field>
      </div>

      <div className="mt-8 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[46ch] text-sm text-muted">
          Usamos estes dados só para responder à sua solicitação. Saiba mais na{' '}
          <button type="button" onClick={() => openLegal('privacidade')} className="text-accent-text underline decoration-1 underline-offset-4">
            Política de Privacidade
          </button>
          .
        </p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex min-h-12 min-w-[220px] items-center justify-center gap-3 bg-accent px-6 text-[13px] font-semibold uppercase tracking-[0.06em] text-bg transition-colors hover:bg-accent-hover disabled:cursor-wait"
        >
          {sending ? (
            <>
              <CircleNotch size={16} className="animate-[spin_0.9s_linear_infinite]" aria-hidden /> Enviando…
            </>
          ) : (
            'Solicitar reunião'
          )}
        </button>
      </div>
    </form>
  )
}

function aria(id: string, error?: string, hasHint = false) {
  const ids = [hasHint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  return { 'aria-invalid': error ? true : undefined, 'aria-describedby': ids || undefined } as const
}

function inputCls(error?: string) {
  return cn(
    'mt-2 block min-h-12 w-full rounded-2 border bg-surface px-4 text-[16px] text-text transition-colors placeholder:text-faint hover:border-text/40 focus:border-text focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text disabled:opacity-60',
    error ? 'border-danger' : 'border-line-strong',
  )
}

function Field({ id, label, hint, error, className, children }: { id: string; label: string; hint?: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
          <WarningCircle size={14} aria-hidden className="shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

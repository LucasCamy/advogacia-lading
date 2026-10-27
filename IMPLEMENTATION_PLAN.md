# IMPLEMENTATION_PLAN.md

## Arquitetura

SPA estática (Vite) com uma única página. Sem backend: o formulário simula o envio localmente. Todas as cenas de scroll vivem em componentes de seção, cada uma com `useGSAP({ scope })` + `gsap.matchMedia()` e versão estática para movimento reduzido.

```
App
├─ SkipLink
├─ ScrollProgress          barra 2px + capítulo ativo (ScrollTrigger global)
├─ Navbar                  links, nav ativa, CTA, menu mobile (fora do header)
├─ main
│  ├─ Hero                 PIN 1 · timeline (máscara → imagem → fios → índice → CTA) · progresso escala/opacidade
│  ├─ Pillars              stagger dos 4 cards · painel de compromisso (acordeão de painel único)
│  ├─ Metrics              gatilhos de contadores + desenho dos fios
│  ├─ Office               clip-path reveal de section-editorial + texto em 2 colunas
│  ├─ Areas                filtro por perfil · grid xadrez com parallax · gaveta Explorar
│  ├─ Traverse             PIN 2 · canvas 120 quadros · 4 legendas · botões Etapa anterior/próxima
│  ├─ Method               PIN 3 · trilho horizontal (desktop) com preenchimento scrub · barra de agendamento
│  ├─ Team                 stagger · P&B → cor · modal Trajetória
│  ├─ Faq                  PIN 4 (coluna esquerda) · acordeão WAI-ARIA
│  └─ Contact              clip-path reveal de contact-space · formulário · blocos de contato
├─ Footer                  créditos de licença, minutas legais (modal), aviso demonstrativo
└─ dialogs                 AreaDrawer, BioDialog, LegalDialog (useDialog: foco, Esc, lenis.stop)
```

## Estrutura de pastas

```
src/
  main.tsx, App.tsx
  data/   MEDIA_MANIFEST.json, media.ts, content.ts
  lib/    scroll.ts, useDialog.ts, useCountUp.ts, schedule.ts, cn.ts
  styles/ tokens.css, globals.css
  components/
    ui/        Button.tsx, Dialog.tsx, Media.tsx, SplitWords.tsx
    nav/       Navbar.tsx, ScrollProgress.tsx
    sections/  Hero, Pillars, Metrics, Office, Areas, Traverse, Method, Team, Faq, Contact, Footer
    dialogs/   AreaDrawer, BioDialog, LegalDialog
scripts/validate.mjs
```

## Dependências

| Pacote | Motivo |
|---|---|
| react, react-dom | UI |
| gsap, @gsap/react | ScrollTrigger, pin, scrub, timeline (GSAP 3.13+ é gratuito, incluindo plugins) |
| lenis | scroll suave sincronizado com ScrollTrigger |
| @phosphor-icons/react | ícones |
| @fontsource-variable/archivo, instrument-sans, jetbrains-mono | fontes self-hosted (OFL) |
| tailwindcss, @tailwindcss/vite | estilos utilitários com tokens |
| playwright (dev) | validação visual |

Sem Motion (`motion/react`): estados de UI resolvidos com CSS transitions, evitando uma segunda lib de animação.

## Ordem de implementação

1. Configs (Vite, TS strict, Tailwind `source("../")`), tokens, globals, fontes.
2. `media.ts` (focal point → `object-position`) e `content.ts`.
3. `scroll.ts` (registro, reduced motion + `?movimento=1`, Lenis, refresh), `useDialog`.
4. Primitivos de UI, Navbar + ScrollProgress.
5. Hero (versão estática primeiro, depois pin + timeline).
6. Pilares, Métricas, Escritório.
7. Áreas (filtro, parallax, gaveta).
8. Travessia (canvas, preload, legendas, botões; fallback grade).
9. Método, Equipe, FAQ, Contato, Footer, diálogos legais.
10. Typecheck, build, Playwright, revisão crítica.

## Responsividade

Recompor por largura (ver DESIGN.md). `gsap.matchMedia()` com `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` para pins longos; abaixo disso, versões mais curtas ou empilhadas.

## Fallback do elemento-assinatura

1. Pôster: `frame_0001` aparece no canvas imediatamente (primeiro quadro carregado antes dos demais). Quadros em AVIF; se o navegador não decodificar, troca para WebP no primeiro erro.
2. Pré-carregamento só a partir de `start: 'top 250%'` (`once: true`).
3. Quadro ausente → desenha o mais próximo já carregado; redesenha quando chega.
4. `prefers-reduced-motion: reduce` (sem `?movimento=1`) → grade estática com 4 marcos e quadros-chave fora das transições (`frame_0001`, `0030`, `0064`, `0110`), via `<picture>` AVIF + WebP.
5. Canvas `aria-hidden`; legendas em texto real com `aria-live`.

## Performance

- Imagens com `width/height` explícitos, `loading="lazy"` e `decoding="async"` abaixo da dobra; hero `fetchpriority="high"`.
- DPR do canvas ≤ 2; resize via `ResizeObserver`.
- Vídeo de ambiência só carrega quando há movimento permitido e pausa fora da viewport.
- Nenhum estado React por quadro; valores contínuos em objetos GSAP/refs.

## Checklist de testes

- [ ] `npm run typecheck` e `npm run build` sem erros
- [ ] Console limpo em aba nova
- [ ] Overflow e âncoras em 375, 390, 768, 1024, 1280, 1440, 1920
- [ ] Desktop + mobile × `no-preference` + `reduce` + `?movimento=1`
- [ ] Teclado: nav, menu mobile, filtros, Explorar, Trajetória, acordeão, formulário, minutas
- [ ] Lenis parado com diálogos abertos
- [ ] Estados do formulário: erro, envio, sucesso

## Publicação

Publicado como demonstração em https://advocacia.cloudlane.com.br (k3s `landingpages`, porta 8213, Keel + GHCR), monitorado no Uptime Kuma. Detalhes em `README.md`.

## Pendências explícitas (bloqueiam publicação real)

- Razão social, CNPJ, registro da sociedade na OAB/SP, endereço completo, telefone, e-mail e encarregado de dados: `[pendente]` visível.
- Retratos da equipe são imagens de banco ilustrativas; o retrato do hero e as fotos editoriais são imagens geradas.
- Minutas legais exigem revisão de advogado.
- Integração real do formulário (backend, base legal, retenção).
- Monitor HTTP do domínio no Beszel (cadastro manual).

# AGENTS.md

## Propósito e stack

Landing page demonstrativa (scrollytelling) do escritório fictício **Varela & Montenegro — Advocacia Estratégica** (São Paulo). Página única, idioma pt-BR, tema escuro.

- Vite 8 + React 19 + TypeScript (strict) + Tailwind CSS v4 (`@tailwindcss/vite`).
- Motion de scroll: GSAP 3 + ScrollTrigger + `@gsap/react` + Lenis, centralizados em `src/lib/scroll.ts`.
- Estados de UI (diálogos, acordeão, filtros, hover) em CSS + React. Não misture GSAP e outra lib de animação no mesmo componente.
- Ícones: `@phosphor-icons/react`. Fontes self-hosted via `@fontsource-variable/*` (sem CDN de fontes).
- Playwright (dev) apenas para validação visual em `scripts/validate.mjs`.

## Organização

```
public/media/            mídias do pacote (não editar à mão; origem em src/data/MEDIA_MANIFEST.json)
src/data/                media.ts (fonte única de mídia), content.ts (conteúdo demonstrativo)
src/lib/                 scroll.ts (GSAP/Lenis/reduced motion), useDialog.ts, useCountUp etc.
src/styles/              tokens.css (CSS variables), globals.css
src/components/ui/       primitivos (Button, Dialog, Media)
src/components/sections/ uma seção por arquivo, na ordem da página
scripts/validate.mjs     validação Playwright (overflow, âncoras, screenshots, console)
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | instala dependências |
| `npm run dev` | servidor de desenvolvimento (porta 5173) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | typecheck + build de produção em `dist/` |
| `npm run preview` | serve `dist/` na porta 4173 |
| `npm run validate` | com `preview` rodando, executa o script Playwright e grava screenshots em `validation/` |

## Convenções

- Cores, raios, durações e easing só via tokens de `src/styles/tokens.css` (expostos ao Tailwind com `@theme inline`). Nada de hex solto em componentes.
- Um único acento (`--accent`, terracota). Texto pequeno em acento usa `--accent-text` (contraste AA).
- Mídia sempre via `src/data/media.ts` (inclui `alt`, crédito e `object-position` derivado do `focalPoint`).
- Toda cena de scroll precisa de versão estática para `prefers-reduced-motion: reduce`. `?movimento=1` força as animações.
- Todo diálogo usa `useDialog` (foco preso, Esc, devolução de foco, `lenis.stop()`/`start()`).
- Proibido `window.addEventListener('scroll')`; use ScrollTrigger ou IntersectionObserver.
- Copy: sem travessão longo em texto visível, sem jargão de marketing, números com unidade.

## Validação

Antes de concluir mudanças de UI: `npm run typecheck`, `npm run build`, `npm run preview` + `npm run validate` (desktop e mobile, `reducedMotion` `no-preference` e `reduce`, `?movimento=1`). A preferência do kit é estruturar UI no Figma antes do código; nesta entrega o Figma MCP não foi usado (autorização explícita do usuário para seguir direto ao código).

## Segurança e conformidade

- Conteúdo é **demonstrativo**: nomes, números, retratos e dados de contato são fictícios ou pendentes. Antes de publicar, troque-os e siga a revisão legal (LGPD, direito de imagem, Provimento da OAB sobre publicidade).
- Não invente CNPJ, OAB ou endereço reais: campos ausentes ficam como `[pendente]` visível.
- O formulário não envia dados a nenhum servidor (simulação local). Integrar backend exige revisão da base legal e da política de privacidade.

## Documentação

`DESIGN.md` (sistema visual e motion), `IMPLEMENTATION_PLAN.md` (arquitetura e checklist). Atualize-os quando tokens, seções ou estratégia de motion mudarem.

## Deploy (Cloudlane Homelab)

Segue `homelab-docs` (Keel + GHCR + k3s + Cloudflare Tunnel):

- Push em `main` → `.github/workflows/deploy.yml` publica `ghcr.io/lucascamy/advogacia-lading:latest` (linux/amd64).
- Keel (poll 1m) faz o rollout do Deployment `advogacia-landing` no namespace `landingpages`.
- Imagem: nginx-unprivileged na porta 8080, `/healthz` para probes; config em `docker/nginx.conf`.
- Service LoadBalancer na porta **8213** (`k8s/deploy.yaml`). Aplicar com `kubectl apply -f k8s/deploy.yaml`.
- Hostname público cadastrado pelo proprietário no Cloudlane Tunnel: `advocacia.cloudlane.com.br` → `http://192.168.15.19:8213`.

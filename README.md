# Varela & Montenegro · Advocacia Estratégica

Landing page scrollytelling **demonstrativa** de um escritório de advocacia fictício em São Paulo.

**No ar:** https://advocacia.cloudlane.com.br

> Conteúdo de demonstração: marca, pessoas, números e currículos são fictícios. Retratos da equipe são imagens ilustrativas de banco; dados de identificação (CNPJ, OAB, endereço, telefone) aparecem como `[pendente]`. As páginas legais são minutas para revisão jurídica.

## Stack

- Vite 8 + React 19 + TypeScript (strict) + Tailwind CSS v4
- GSAP 3 + ScrollTrigger + Lenis (`src/lib/scroll.ts`): smooth scroll, progresso, gatilhos, scrub, pin, timeline, clip-path, parallax, sequência de 120 quadros em canvas e stagger
- Fontes self-hosted (Archivo, Instrument Sans, JetBrains Mono), ícones Phosphor
- Playwright para validação visual (`scripts/validate.mjs`)

Com `prefers-reduced-motion: reduce`, todas as cenas têm versão estática. `?movimento=1` força as animações.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # dist/
npm run preview    # http://localhost:4173
npm run validate   # com o preview rodando; capturas e relatório em validation/
```

## Estrutura

```
public/media/            mídias do pacote (créditos em src/data/MEDIA_MANIFEST.json)
src/data/                media.ts (focal point → object-position), content.ts (conteúdo demo)
src/lib/                 scroll.ts, store.ts, schedule.ts
src/components/          ui/, nav/, sections/, dialogs/
docker/nginx.conf        nginx da imagem de produção (/healthz, cache de /assets e /media)
k8s/deploy.yaml          Deployment + Service do k3s
```

Documentos de projeto: [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Deploy (Cloudlane Homelab)

| Item | Valor |
|---|---|
| Imagem | `ghcr.io/lucascamy/advogacia-lading:latest` e `:<sha>` (pública, linux/amd64), publicada pelo workflow `deploy.yml` a cada push em `main` |
| Rollout | Keel (poll de 1 min) detecta o novo digest de `:latest` e reinicia o Deployment |
| Cluster | k3s, namespace `landingpages`, Deployment `advogacia-landing` (Keel, poll de 1 min) |
| Porta | Service LoadBalancer `192.168.15.19:8213` → container `8080` |
| Domínio | `advocacia.cloudlane.com.br` no Cloudlane Tunnel |
| Health | `/healthz` (probes do k8s e Uptime Kuma) |
| Monitor | Uptime Kuma, monitor 30 "Varela & Montenegro (Advocacia)", grupo Aplicações & Web Services |

Atualizar o site: commit e push em `main`. Primeira instalação ou mudança de manifest: `kubectl apply -f k8s/deploy.yaml`.

## Créditos de mídia

Retrato do hero, escadaria, contrato e sala de reuniões: imagens geradas para o projeto. Corredor e biblioteca: Unsplash (Olivia Hibbins, Brett Wharton). Retratos da equipe: Unsplash (ilustrativos). Vídeo de ambiência, vídeo e quadros da Travessia: derivados das imagens geradas para o projeto (escadaria, contrato e sala de reuniões). Detalhes e links de licença no rodapé do site e em `src/data/MEDIA_MANIFEST.json`.

### Mídias e peso

O pacote de mídia (gerado fora do repositório) traz quadros 1920×1080 em WebP e AVIF, AVIF das imagens estáticas e vídeos 1080p. Ao integrar um pacote novo, o projeto deriva:

| Arquivo | Origem | Uso |
|---|---|---|
| `media/*.avif` + `*.webp` | pacote | `<picture>` AVIF com WebP de fallback (`src/components/ui/Media.tsx`) |
| `media/frames/*.avif` (1920) | pacote | canvas quando largura × DPR > 1280 px |
| `media/frames-1024/*.avif` + `*.webp` | gerado dos WebP 1920 do pacote | canvas em celular/notebook, fallback sem AVIF e grade estática |
| `media/hero-ambient.mp4` | pacote, recodificado 1280×720 CRF 26 | ambiência (14% de opacidade), só desktop, após `load` + ocioso |

Não entram em `public/media`: os WebP 1920 dos quadros (21 MB, sem uso) e `canvas-sequence.mp4` (o canvas usa os quadros).

```bash
P=<pasta do pacote>/media
for i in $(seq -f "%04g" 1 120); do
  ffmpeg -v error -y -i $P/frames/frame_$i.webp -vf "scale=1024:576:flags=lanczos,format=yuv420p"     -c:v libaom-av1 -still-picture 1 -crf 27 -b:v 0 -cpu-used 6 -frames:v 1 public/media/frames-1024/frame_$i.avif
  ffmpeg -v error -y -i $P/frames/frame_$i.webp -vf "scale=1024:576:flags=lanczos"     -c:v libwebp -quality 82 -frames:v 1 public/media/frames-1024/frame_$i.webp
done
ffmpeg -y -i $P/hero-ambient.mp4 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 26   -pix_fmt yuv420p -an -movflags +faststart public/media/hero-ambient.mp4
```

Confira se os AVIF abrem no navegador antes de publicar (o pacote de 27/10 12h os gerava quebrados com `-f image2`; o atual usa `convert_avif_hd.py`).

Peso medido em 27/10/2026 (preview local): carregamento inicial 968 KB no desktop e 341 KB no celular; ao chegar na Travessia, 2,5 MB (quadros 1024) ou 4,8 MB (quadros 1920).

### JavaScript sob demanda

- `index` (React, GSAP, ScrollTrigger e seções): cerca de 149 KB gzip.
- Chunks carregados depois: `lenis` (5 KB, só com movimento permitido), `LegalDialog`, `AreaDrawer` e `BioDialog` (cerca de 5,5 KB juntos, pré-carregados no hover/foco/toque do botão que os abre).
- As seções não são carregadas sob demanda de propósito: os pins do ScrollTrigger dependem da ordem e da altura real de todas elas, e as âncoras do menu precisam delas no DOM.

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
| Rollout | job `deploy-to-k8s` via Tailscale (`kubectl set image`), quando os segredos `TAILSCALE_AUTHKEY` e `KUBE_CONFIG` existem; Keel como reserva |
| Cluster | k3s, namespace `landingpages`, Deployment `advogacia-landing` (Keel, poll de 1 min) |
| Porta | Service LoadBalancer `192.168.15.19:8213` → container `8080` |
| Domínio | `advocacia.cloudlane.com.br` no Cloudlane Tunnel |
| Health | `/healthz` (probes do k8s e Uptime Kuma) |
| Monitor | Uptime Kuma, monitor 30 "Varela & Montenegro (Advocacia)", grupo Aplicações & Web Services |

Atualizar o site: commit e push em `main`. Primeira instalação ou mudança de manifest: `kubectl apply -f k8s/deploy.yaml`.

## Créditos de mídia

Retrato do hero, escadaria, contrato e sala de reuniões: imagens geradas para o projeto. Corredor e biblioteca: Unsplash (Olivia Hibbins, Brett Wharton). Retratos da equipe: Unsplash (ilustrativos). Vídeo de ambiência, vídeo e quadros da Travessia: derivados das imagens geradas para o projeto (escadaria, contrato e sala de reuniões). Detalhes e links de licença no rodapé do site e em `src/data/MEDIA_MANIFEST.json`.

### Quadros AVIF

Os 120 `frames/*.avif` do pacote original não decodificavam no Chrome nem no Edge (gerados numa única passada `-f image2`). Foram regerados quadro a quadro a partir dos WebP do pacote, com os mesmos parâmetros:

```bash
for i in $(seq -f "%04g" 1 120); do
  ffmpeg -v error -y -i public/media/frames/frame_$i.webp -vf format=yuv420p     -c:v libaom-av1 -still-picture 1 -crf 30 -b:v 0 -cpu-used 6 -frames:v 1 public/media/frames/frame_$i.avif
done
```

Ao receber um pacote novo, confira se os AVIF abrem no navegador antes de publicar. O canvas volta para WebP sozinho se o AVIF falhar, mas a grade estática (movimento reduzido) usa `<picture>` e mostraria imagem quebrada.

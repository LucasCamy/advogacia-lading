# DESIGN.md — Varela & Montenegro

## Missão visual

Fazer o visitante sentir que entrou num edifício: luz baixa, matéria nobre, estrutura exposta. A página é uma **arquitetura em chiaroscuro** onde a grade de fios de 1px é a planta do escritório e a tipografia monumental é a fachada. O scroll é a travessia: do retrato da sócia à escadaria, do contrato à mesa de conselho.

Direção: **Chiaroscuro Legal Architecture / Brutalist Hairline Grid**.

## Personalidade

Sóbria, exata, próxima. Fala pouco e com precisão. Nunca promete resultado (publicidade advocatícia é informativa: Provimento CFOAB 205/2021, a confirmar com o jurídico).

## Público

Sócios e diretores de empresas médias, famílias empresárias e pessoas com patrimônio relevante em São Paulo. Decidem com calma, leem no desktop e conferem pelo celular.

## Princípios

1. **Estrutura visível.** Fios de 1px desenham a página; o conteúdo ocupa as células.
2. **Luz como hierarquia.** O que importa está iluminado (texto claro, imagem nítida); o resto recua para o escuro.
3. **Um gesto por seção.** Cada seção tem uma animação própria que comunica algo (abrir, atravessar, avançar, revelar).
4. **Fato antes de adjetivo.** Números com unidade, prazos concretos, documentos nomeados.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#0A0A0B` | fundo da página |
| `--surface` | `#111113` | células, cards, diálogos |
| `--raised` | `#18181B` | hover de célula, campos de formulário |
| `--line` | `rgba(242,239,233,0.12)` | fios estruturais de 1px |
| `--line-strong` | `rgba(242,239,233,0.24)` | bordas de input, divisores ativos |
| `--text` | `#F2EFE9` | texto principal |
| `--muted` | `#9E9A93` | texto secundário |
| `--faint` | `#6E6A64` | só decorativo e números grandes (≥ 24px) |
| `--accent` | `#C85A32` | acento único: botões, barras de progresso, fios ativos, números grandes |
| `--accent-text` | `#E0754B` | acento em texto pequeno (links, rótulos) |
| `--danger` | `#E5484D` | só estado de erro, sempre com ícone + texto |
| `--success` | `#6FBF8B` | só estado de sucesso, sempre com ícone + texto |

### Contraste calculado (WCAG 2.x)

| Texto \ Superfície | `--bg` | `--surface` | `--raised` |
|---|---|---|---|
| `--text` | 17,24 | 16,43 | 15,44 |
| `--muted` | 7,07 | 6,73 | 6,33 |
| `--accent-text` | 6,42 | 6,12 | 5,75 |
| `--accent` | 4,68 | 4,46 (só ≥ 24px) | 4,19 (só ≥ 24px) |
| `--faint` | 3,68 (só decorativo/grande) | 3,51 | 3,30 |

Botão primário: texto `--bg` sobre `--accent` = **4,68:1** (AA). Texto claro sobre acento (3,69) é proibido.

## Tipografia

| Papel | Família | Uso |
|---|---|---|
| Display | **Archivo Variable** (eixos `wght` + `wdth`), caixa alta, `wdth` 62 a 75, peso 800 | títulos monumentais `DIREITO & ESTRATÉGIA`, `VAMOS CONVERSAR`, títulos de seção |
| Corpo | **Instrument Sans Variable** | parágrafos, botões, navegação |
| Dados | **JetBrains Mono Variable** com `tabular-nums` | índices `01`–`06`, métricas, prazos, legendas técnicas |

Acentos do pt-BR (É, Ã, Ç, Õ, Ê) conferidos na renderização em caixa alta com `wdth` condensado (Archivo posiciona corretamente).

Escala fluida:

| Token | Valor |
|---|---|
| `--fs-monument` | `clamp(3.25rem, 13vw, 12.5rem)` |
| `--fs-h2` | `clamp(2.25rem, 6vw, 5.5rem)` |
| `--fs-h3` | `clamp(1.375rem, 2.2vw, 1.875rem)` |
| `--fs-lead` | `clamp(1.0625rem, 1.4vw, 1.3125rem)` |
| `--fs-body` | `1rem` (16px), `line-height` 1.6 |
| `--fs-small` | `0.875rem` |
| `--fs-mono` | `0.75rem`, `letter-spacing` 0.08em, caixa alta |

## Espaçamento

Base 4px. Escala usada: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Gutter lateral: 16px (mobile), 32px (≥ 768), 48px (≥ 1280). Seções: `padding-block` `clamp(96px, 14vw, 176px)`.

## Raios

Arquitetura brutalista: **0 por padrão**. Exceções documentadas: `--r-pill` (999px) só para chips do filtro e indicador de capítulo; `--r-2` (2px) para inputs e checkboxes. Nenhum card arredondado.

## Elevação e superfícies

Sem sombras projetadas: a hierarquia vem de luz e fio. Diálogos usam `--surface` + borda `--line-strong` + scrim `rgba(10,10,11,0.78)` com `backdrop-filter: blur(6px)`. Sombra única permitida: `0 30px 80px -20px rgba(10,10,11,0.9)` no diálogo (tingida com o fundo).

Gradientes só funcionais: scrim de legibilidade sobre imagens (`linear-gradient` de `--bg` a transparente) e máscara de bordas no canvas.

## Componentes

- **Botão primário:** fundo `--accent`, texto `--bg`, 48px de altura, padding 0 24px, caixa alta 13px com tracking 0.06em, seta Phosphor. Hover: fundo `#D96A40` e seta desloca 4px. Active: `translateY(1px)`.
- **Botão secundário:** transparente, borda `--line-strong`, texto `--text`. Hover: borda `--text`.
- **Botão de texto:** sublinhado de 1px que cresce da esquerda (`scaleX`).
- **Célula de grade:** sem fundo próprio, delimitada por fios `--line`; hover em `--raised`.
- **Chip de filtro:** `--r-pill`, borda `--line-strong`, `aria-pressed`; selecionado com fundo `--text` e texto `--bg`.
- **Índice numérico:** mono, `--accent` quando ativo, `--faint` em repouso (decorativo, sempre acompanhado do título).
- **Badge de aviso:** mono 11px, borda `--line`, ícone `Info`.

## Navegação

Header fixo de 64px com fundo `rgba(10,10,11,0.72)` e blur; fio inferior de 1px. Barra de progresso de 2px em `--accent` no topo. Indicador de capítulo `03 / 09` em mono. Link ativo com fio `--accent` de 1px abaixo. Menu mobile renderizado **fora** do header (evita o bloco de referência do `backdrop-filter`).

## Visualização do elemento-assinatura

**Travessia do Caso:** canvas 16:9 em tela cheia com os 120 quadros (escadaria 1–39 → contrato 49–79 → sala de conselho 88–120, transições por máscara), em AVIF com fallback WebP e sem filtro de cor, vinheta nas bordas, quatro legendas que entram em sequência (`01 Escuta` → `04 Condução`), contador de quadro em mono e régua de progresso com 4 marcos. Botões `Etapa anterior` / `Próxima etapa` levam o scroll até o marco correspondente.

## Motion

| Token | Valor |
|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP: `power3.out` / `expo.out`) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--dur-1..5` | 120 / 180 / 280 / 560 / 900 ms |
| scrub | `1` (1s de suavização) |
| Lenis | `lerp: 0.085` |

As 10 técnicas e o que cada uma comunica:

| Técnica | Onde | Comunica |
|---|---|---|
| Smooth scroll | página toda | ritmo calmo, peso de matéria |
| Progresso | barra topo + capítulo + escala/opacidade do retrato | onde estou na travessia |
| Gatilho | contadores, fios de grade, nav ativa | dado que chega quando é visto |
| Scrub | máscaras, linha do método, canvas | o visitante controla o tempo; rebobina ao voltar |
| Pin | hero, canvas, método, coluna das dúvidas | capítulos que se fecham antes de seguir |
| Timeline | hero e canvas | ordem: texto → imagem → fios → índice → CTA |
| Clip-path | escritório e contato | cortina arquitetônica que abre o espaço |
| Parallax | grade de áreas | profundidade entre imagem, índice e texto |
| Sequência em canvas | Travessia do Caso | avançar dentro do caso |
| Stagger | pilares, palavras das headlines, equipe | grupos que se apresentam em ordem |

Regras: só `transform`, `opacity`, `clip-path`, `filter`. Saídas mais curtas que entradas. Nada começa em `scale(0)`.

## Estados

- **Hover:** células ganham `--raised`; retratos saem do P&B para cor (`filter: grayscale`), sem deslocar layout.
- **Focus:** `outline: 2px solid var(--accent-text)` com `outline-offset: 3px` em tudo (`:focus-visible`).
- **Active:** `translateY(1px)`.
- **Loading (formulário):** botão mantém a largura, rótulo vira `Enviando…` com spinner; campos `aria-disabled`.
- **Erro:** texto `--danger` + ícone `WarningCircle` + `role="alert"` + `aria-invalid`.
- **Sucesso:** painel com ícone `CheckCircle`, foco movido para a mensagem, botão `Enviar nova solicitação`.
- **Vazio (filtro):** não ocorre (todo filtro tem resultados); ainda assim, o estado `Nenhuma área neste perfil` com `Limpar filtro` existe.

## Responsividade

| Largura | Recomposição |
|---|---|
| < 768 | grade de 1 coluna; método vira lista vertical com linha de progresso vertical; hero sem pin (só scrub de escala/opacidade do retrato) e sem vídeo de ambiência, retrato acima do título; FAQ sem pin; canvas mantém pin com legenda abaixo |
| 768–1023 | grade de 2 colunas; método vertical; FAQ empilhado |
| ≥ 1024 | layouts assimétricos completos; método horizontal fixado; coluna do FAQ fixada |
| ≥ 1440 | conteúdo limitado a 1440px; monumentais escalam até 200px |

`min-height: 100dvh` (nunca `h-screen`), `overflow-x: clip` no `main`, alvos de toque ≥ 44px, `h1` em no máximo 3 linhas.

## Acessibilidade

Skip link, um `h1`, landmarks, `aria-current` na nav ativa, acordeão WAI-ARIA (`button[aria-expanded]` + `region[aria-labelledby]`), diálogos com `role="dialog"`, `aria-modal`, foco preso, Esc e devolução de foco. Canvas com `aria-hidden` + descrição `sr-only` e legendas em `aria-live="polite"`. Contadores expõem o valor final ao leitor de tela.

## Do's

- Deixar o escuro respirar; uma ideia por célula.
- Usar o acento para indicar ação ou posição, nunca decoração.
- Marcar todo conteúdo fictício e imagens ilustrativas.

## Don'ts

- Cantos arredondados em cards, sombras pretas, gradientes decorativos, glassmorphism.
- Prometer resultado, usar "melhor escritório", depoimentos de clientes (vedados na publicidade advocatícia, a confirmar).
- Travessão longo em texto visível; "Seção 01"; avisos de "role para baixo".

## Checklist final

- [ ] Contraste AA conferido para cada token em cada superfície
- [ ] Reduced motion: todas as cenas com versão estática e conteúdo completo
- [ ] `?movimento=1` força as animações
- [ ] Nenhum overflow horizontal em 375–1920
- [ ] Todas as âncoras resolvem
- [ ] Todos os botões têm ação real
- [ ] Avisos de conteúdo demonstrativo e imagens ilustrativas visíveis

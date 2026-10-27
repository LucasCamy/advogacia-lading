import manifest from './MEDIA_MANIFEST.json'

/** Fonte única das mídias. Caminhos, alt, créditos e pontos focais vêm do MEDIA_MANIFEST.json. */

type ManifestAsset = {
  path: string
  alt: string
  expectedAspectRatio: string
  focalPoint: { x: number; y: number }
  credit: string
  sourcePage?: string
  licenseUrl?: string
  representativeStockImage?: boolean
  frameCount?: number
  frameWidth?: number
}

export type MediaKey =
  | 'hero'
  | 'heroAmbient'
  | 'editorial'
  | 'corridor'
  | 'contract'
  | 'library'
  | 'team01'
  | 'team02'
  | 'team03'
  | 'contact'
  | 'canvasSequence'

export type MediaAsset = {
  key: MediaKey
  src: string
  alt: string
  width: number
  height: number
  aspect: string
  objectPosition: string
  credit: string
  sourcePage?: string
  licenseUrl?: string
  generated: boolean
  representative: boolean
  /** Versão AVIF (imagens estáticas); vídeos não têm. */
  avif?: string
}

/** Dimensões reais dos arquivos em public/media (conferidas na cópia do pacote). */
const DIMENSIONS: Record<MediaKey, [number, number]> = {
  hero: [1122, 1402],
  heroAmbient: [1280, 720],
  editorial: [1448, 1086],
  corridor: [1000, 1250],
  contract: [1448, 1086],
  library: [1000, 1250],
  team01: [900, 1200],
  team02: [900, 1200],
  team03: [900, 1200],
  contact: [1586, 992],
  canvasSequence: [1920, 1080],
}

const assets = manifest.assets as Record<MediaKey, ManifestAsset>

/** URL versionada: muda sempre que o conteúdo de public/media muda (ver vite.config.ts). */
export const mediaUrl = (path: string) => `/${path.replace(/^\//, '')}?v=${__MEDIA_VERSION__}`

export const focalToObjectPosition = ({ x, y }: { x: number; y: number }) =>
  `${Math.round(x * 100)}% ${Math.round(y * 100)}%`

function build(key: MediaKey): MediaAsset {
  const a = assets[key]
  const [width, height] = DIMENSIONS[key]
  return {
    key,
    src: mediaUrl(a.path),
    avif: a.path.endsWith('.webp') ? mediaUrl(a.path.replace(/\.webp$/, '.avif')) : undefined,
    alt: a.alt,
    width,
    height,
    aspect: a.expectedAspectRatio.replace(':', ' / '),
    objectPosition: focalToObjectPosition(a.focalPoint),
    credit: a.credit,
    sourcePage: a.sourcePage,
    licenseUrl: a.licenseUrl,
    // "Imagem gerada…" e "Derivado de imagens geradas…"
    generated: /gerad/i.test(a.credit),
    representative: Boolean(a.representativeStockImage),
  }
}

export const media = Object.fromEntries(
  (Object.keys(DIMENSIONS) as MediaKey[]).map((k) => [k, build(k)]),
) as Record<MediaKey, MediaAsset>

/**
 * Quadros da Travessia em dois tamanhos:
 * - `frames-1024/`: AVIF + WebP 1024×576 (celular, notebook, e fallback sem AVIF);
 * - `frames/`: só AVIF 1920×1080 (telas onde o canvas passa de ~1280 px reais).
 */
export type FrameFormat = 'avif' | 'webp'
export type FrameSize = 1024 | 1920

const seq = assets.canvasSequence
export const frameSequence = {
  count: seq.frameCount ?? 120,
  width: 1920,
  height: 1080,
  fps: 24,
  src: (i: number, format: FrameFormat = 'webp', size: FrameSize = 1024) =>
    mediaUrl(`media/${size === 1920 && format === 'avif' ? 'frames' : 'frames-1024'}/frame_${String(i).padStart(4, '0')}.${format}`),
  /** Escolhe o conjunto pela largura real (CSS px × DPR) que o canvas vai ocupar. */
  sizeFor: (devicePixels: number): FrameSize => (devicePixels > 1280 ? 1920 : 1024),
  credit: seq.credit,
  sourcePage: seq.sourcePage,
  licenseUrl: seq.licenseUrl,
}

/** Créditos agrupados para o rodapé (um item por origem). */
export const credits = (Object.values(media) as MediaAsset[])
  .filter((m) => m.key !== 'canvasSequence')
  .map((m) => ({
    label: m.alt,
    file: m.src,
    credit: m.credit,
    sourcePage: m.sourcePage,
    licenseUrl: m.licenseUrl,
    generated: m.generated,
    representative: m.representative,
  }))

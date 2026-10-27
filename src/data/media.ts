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

export const focalToObjectPosition = ({ x, y }: { x: number; y: number }) =>
  `${Math.round(x * 100)}% ${Math.round(y * 100)}%`

function build(key: MediaKey): MediaAsset {
  const a = assets[key]
  const [width, height] = DIMENSIONS[key]
  return {
    key,
    src: '/' + a.path,
    alt: a.alt,
    width,
    height,
    aspect: a.expectedAspectRatio.replace(':', ' / '),
    objectPosition: focalToObjectPosition(a.focalPoint),
    credit: a.credit,
    sourcePage: a.sourcePage,
    licenseUrl: a.licenseUrl,
    generated: a.credit.startsWith('Imagem gerada'),
    representative: Boolean(a.representativeStockImage),
  }
}

export const media = Object.fromEntries(
  (Object.keys(DIMENSIONS) as MediaKey[]).map((k) => [k, build(k)]),
) as Record<MediaKey, MediaAsset>

const seq = assets.canvasSequence
export const frameSequence = {
  count: seq.frameCount ?? 120,
  width: 1024,
  height: 576,
  fps: 24,
  src: (i: number) => `/media/frames/frame_${String(i).padStart(4, '0')}.webp`,
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

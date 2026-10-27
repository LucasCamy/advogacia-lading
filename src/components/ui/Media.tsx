import type { ImgHTMLAttributes } from 'react'
import { media, type MediaKey } from '../../data/media'
import { cn } from '../../lib/cn'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  name: MediaKey
  priority?: boolean
  /** alt vazio quando a imagem for decorativa e já descrita no texto ao lado */
  decorative?: boolean
}

/** Imagem do pacote com object-position derivado do focalPoint. */
export function Media({ name, priority, decorative, className, style, ...rest }: Props) {
  const m = media[name]
  return (
    <img
      src={m.src}
      alt={decorative ? '' : m.alt}
      width={m.width}
      height={m.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('h-full w-full object-cover', className)}
      style={{ objectPosition: m.objectPosition, ...style }}
      {...rest}
    />
  )
}

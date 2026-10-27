import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Hash do conteúdo de public/media: entra na query (?v=) das URLs de mídia.
 * Nomes de arquivo fixos + cache longo no nginx/Cloudflare deixariam mídia trocada
 * presa no cache por até 7 dias; com o hash, toda troca gera URL nova.
 */
function mediaVersion(dir = 'public/media') {
  const hash = createHash('sha1')
  const walk = (d: string) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) walk(p)
      else hash.update(name).update(readFileSync(p))
    }
  }
  walk(dir)
  return hash.digest('hex').slice(0, 10)
}

const MEDIA_VERSION = mediaVersion()

export default defineConfig({
  define: { __MEDIA_VERSION__: JSON.stringify(MEDIA_VERSION) },
  plugins: [
    react(),
    tailwindcss(),
    { name: 'media-version-html', transformIndexHtml: (html) => html.replaceAll('%MEDIA_VERSION%', MEDIA_VERSION) },
  ],
  server: { port: 5173 },
})

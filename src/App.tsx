import { useEffect } from 'react'
import { Navbar } from './components/nav/Navbar'
import { ScrollProgress } from './components/nav/ScrollProgress'
import { Hero } from './components/sections/Hero'
import { Pillars } from './components/sections/Pillars'
import { Office } from './components/sections/Office'
import { Areas } from './components/sections/Areas'
import { Traverse } from './components/sections/Traverse'
import { Method } from './components/sections/Method'
import { Team } from './components/sections/Team'
import { Faq } from './components/sections/Faq'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { LegalDialog } from './components/dialogs/LegalDialog'
import { ScrollTrigger, bindAnchors, destroyLenis, initLenis, useMotionAllowed } from './lib/scroll'

export default function App() {
  const motion = useMotionAllowed()

  // Lenis só com movimento permitido; sem ele, scroll nativo.
  useEffect(() => {
    if (!motion) return
    initLenis()
    ScrollTrigger.refresh()
    return () => destroyLenis()
  }, [motion])

  useEffect(() => bindAnchors(), [])

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-3 z-[100] -translate-y-24 bg-text px-4 py-3 text-sm font-semibold text-bg focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Pillars />
        <Office />
        <Areas />
        <Traverse />
        <Method />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <LegalDialog />
      {/* Por último: os gatilhos de capítulo dependem das cenas fixadas acima. */}
      <ScrollProgress />
    </>
  )
}

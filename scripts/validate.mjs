// Validação visual e funcional com Playwright.
// Uso: npm run build && npm run preview (em outro terminal) && npm run validate
// BASE_URL padrão: http://localhost:4173
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = 'validation'
const WIDTHS = [375, 390, 768, 1024, 1280, 1440, 1920]
const SECTIONS = ['inicio', 'pilares', 'escritorio', 'areas', 'travessia', 'metodo', 'equipe', 'duvidas', 'contato']
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function launch() {
  for (const channel of [undefined, 'msedge', 'chrome']) {
    try {
      return await chromium.launch(channel ? { channel } : {})
    } catch {}
  }
  throw new Error('Nenhum navegador disponível para o Playwright')
}

const overflowScript = () => {
  const iw = document.documentElement.clientWidth
  const bad = []
  for (const e of document.querySelectorAll('main *, footer *, header *')) {
    const r = e.getBoundingClientRect()
    if (!r.width || r.right <= iw + 1) continue
    let p = e.parentElement
    let clipped = false
    while (p && p !== document.body) {
      if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX) && p.getBoundingClientRect().right <= iw + 1) {
        clipped = true
        break
      }
      p = p.parentElement
    }
    if (!clipped) bad.push(e.tagName + ' ' + (e.className?.toString?.() ?? '').slice(0, 40) + ' ' + (e.textContent || '').trim().slice(0, 30))
  }
  const broken = [...new Set([...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')))].filter(
    (h) => h.length > 1 && !document.getElementById(h.slice(1)),
  )
  return { iw, scrollW: document.documentElement.scrollWidth, overflow: bad.slice(0, 10), brokenAnchors: broken }
}

/** Topo de cada seção no documento (usa o pin-spacer quando a seção estiver fixada). */
const sectionTops = (ids) =>
  Object.fromEntries(
    ids.map((id) => {
      const el = document.getElementById(id)
      const box = el?.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
      return [id, box ? Math.round(box.getBoundingClientRect().top + window.scrollY) : null]
    }),
  )

async function scrollTo(page, y, settle = 1600) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y)
  await wait(settle)
}

const report = { base: BASE, runs: [] }

async function run(browser, { name, width, height, reducedMotion, query = '', mobile = false }) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()))
  await page.goto(BASE + '/' + query, { waitUntil: 'networkidle' })
  await wait(2200)

  const r = { name, width, height, reducedMotion, query, shots: [], checks: {} }
  r.checks.lenis = await page.evaluate(() => document.documentElement.classList.contains('lenis'))
  r.checks.pinSpacers = await page.evaluate(() => document.querySelectorAll('.pin-spacer').length)
  r.checks.h1Lines = await page.evaluate(() => {
    const h = document.querySelector('h1')
    const lh = parseFloat(getComputedStyle(h).lineHeight)
    return Math.round(h.getBoundingClientRect().height / lh)
  })
  r.checks.canvas = await page.evaluate(() => Boolean(document.querySelector('#travessia canvas')))

  const tops = await page.evaluate(sectionTops, SECTIONS)
  for (const id of SECTIONS) {
    const y = tops[id]
    if (y == null) continue
    const offset = id === 'travessia' || id === 'metodo' ? 0 : -64
    await scrollTo(page, Math.max(0, y + offset))
    const file = `${OUT}/${name}-${id}.png`
    await page.screenshot({ path: file })
    r.shots.push(file)
  }
  // Meio das cenas fixadas (scrub)
  const spacer = await page.evaluate(() =>
    [...document.querySelectorAll('.pin-spacer')].map((s) => ({ id: s.firstElementChild?.id || s.firstElementChild?.className?.toString().slice(0, 20), top: s.offsetTop, h: s.offsetHeight })),
  )
  r.checks.pins = spacer
  for (const s of spacer) {
    if (s.id !== 'travessia') continue
    for (const p of [0.35, 0.62, 0.95]) {
      await scrollTo(page, Math.round(s.top + (s.h - height) * p))
      const file = `${OUT}/${name}-travessia-${Math.round(p * 100)}.png`
      await page.screenshot({ path: file })
      r.shots.push(file)
    }
    r.checks.frameCounter = await page.evaluate(() => document.querySelector('.trav-counter')?.textContent)
  }
  r.errors = errors
  await ctx.close()
  return r
}

async function interactions(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await wait(1500)
  const res = {}

  // Pilar abre painel
  await page.evaluate(() => document.getElementById('pilares').scrollIntoView())
  await wait(800)
  await page.getByRole('button', { name: /Sigilo/ }).click()
  await wait(700)
  res.pillarPanel = await page.locator('#pilar-painel').innerText()

  // Filtro
  await page.evaluate(() => document.getElementById('areas').scrollIntoView())
  await wait(800)
  await page.getByRole('button', { name: 'Família e Patrimônio' }).click()
  await wait(900)
  res.filterFamilia = await page.locator('#areas button:has-text("Explorar")').count()
  await page.getByRole('button', { name: 'Empresas e Societário' }).click()
  await wait(900)
  res.filterEmpresas = await page.locator('#areas button:has-text("Explorar")').count()
  await page.getByRole('button', { name: 'Todas as Frentes' }).click()
  await wait(900)
  res.filterTodas = await page.locator('#areas button:has-text("Explorar")').count()

  // Gaveta Explorar: Lenis parado, Esc fecha e devolve foco
  const explore = page.getByRole('button', { name: /Explorar Tributário/ })
  await explore.click()
  await wait(700)
  res.drawerOpen = await page.locator('dialog[open] #area-title').innerText()
  res.lenisStoppedWithDrawer = await page.evaluate(() => document.documentElement.classList.contains('lenis-stopped'))
  await page.screenshot({ path: `${OUT}/interaction-drawer.png` })
  await page.keyboard.press('Escape')
  await wait(400)
  res.drawerClosed = (await page.locator('dialog[open]').count()) === 0
  res.focusReturned = await page.evaluate(() => document.activeElement?.textContent?.includes('Tributário'))
  res.lenisRestarted = await page.evaluate(() => !document.documentElement.classList.contains('lenis-stopped'))

  // Agendar a partir da gaveta → formulário preenchido
  await explore.click()
  await wait(600)
  await page.getByRole('button', { name: /Agendar sobre esta área/ }).click()
  await wait(2200)
  res.formArea = await page.locator('#f-area').inputValue()

  // Trajetória
  await page.evaluate(() => document.getElementById('equipe').scrollIntoView())
  await wait(900)
  await page.getByRole('button', { name: /Trajetória de Dra. Lívia Andrade/ }).click()
  await wait(700)
  res.bio = await page.locator('dialog[open] #bio-title').innerText()
  await page.screenshot({ path: `${OUT}/interaction-bio.png` })
  await page.keyboard.press('Escape')
  await wait(300)

  // FAQ
  await page.evaluate(() => document.getElementById('duvidas').scrollIntoView())
  await wait(900)
  await page.getByRole('button', { name: /Quanto tempo leva o diagnóstico/ }).click()
  await wait(400)
  res.faqExpanded = await page.getByRole('button', { name: /Quanto tempo leva o diagnóstico/ }).getAttribute('aria-expanded')

  // Formulário: erros, depois sucesso
  await page.evaluate(() => document.getElementById('formulario').scrollIntoView())
  await wait(900)
  await page.locator('#f-nome').fill('')
  await page.getByRole('button', { name: 'Solicitar reunião' }).click()
  await wait(300)
  res.formErrors = await page.locator('form [role="alert"]').count()
  res.focusOnFirstInvalid = await page.evaluate(() => document.activeElement?.id)
  await page.screenshot({ path: `${OUT}/interaction-form-errors.png` })
  await page.locator('#f-nome').fill('Marina Teste Exemplo')
  await page.locator('#f-email').fill('marina@empresa.example')
  await page.locator('#f-perfil').selectOption('empresa')
  await page.locator('#f-mensagem').fill('Revisão de acordo de sócios antes da entrada de um investidor.')
  await page.getByRole('button', { name: 'Solicitar reunião' }).click()
  await wait(300)
  res.sendingState = await page.locator('form button[type="submit"]').innerText()
  await wait(1700)
  res.success = await page.locator('[role="status"] h3').innerText()
  res.focusOnSuccess = await page.evaluate(() => document.activeElement?.getAttribute('role'))
  await page.screenshot({ path: `${OUT}/interaction-form-success.png` })

  // Minutas legais
  await page.getByRole('button', { name: 'Termos de Uso' }).click()
  await wait(600)
  res.legalTab = await page.locator('[role="tab"][aria-selected="true"]').innerText()
  await page.keyboard.press('Escape')
  await wait(300)

  // Âncora da nav com Lenis
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Método' }).click()
  await wait(2200)
  res.navMetodoTop = await page.evaluate(() => {
    const el = document.getElementById('metodo')
    return Math.round(el.getBoundingClientRect().top)
  })
  res.navCurrent = await page.locator('nav[aria-label="Principal"] [aria-current="true"]').innerText()

  // Travessia: botões
  await page.evaluate(() => {
    const s = document.getElementById('travessia').parentElement
    window.scrollTo({ top: s.offsetTop + 10, behavior: 'instant' })
  })
  await wait(1500)
  await page.getByRole('button', { name: 'Próxima etapa' }).click()
  await wait(2600)
  res.travStepAfterNext = await page.locator('.trav-mark[aria-current="step"] .sr-only').innerText()
  res.errors = errors
  await ctx.close()

  // Menu mobile
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const mp = await m.newPage()
  await mp.goto(BASE + '/', { waitUntil: 'networkidle' })
  await wait(1200)
  await mp.getByRole('button', { name: 'Abrir menu' }).click()
  await wait(500)
  res.mobileMenuOpen = (await mp.locator('dialog[open] #menu-title').count()) === 1
  res.mobileMenuLocked = await mp.evaluate(() => document.documentElement.classList.contains('scroll-locked'))
  await mp.screenshot({ path: `${OUT}/interaction-mobile-menu.png` })
  await mp.getByRole('dialog').getByRole('link', { name: /Equipe/ }).click()
  await wait(2200)
  res.mobileMenuNavTop = await mp.evaluate(() => Math.round(document.getElementById('equipe').getBoundingClientRect().top))
  await m.close()
  return res
}

async function overflowSweep(browser, reducedMotion) {
  const out = []
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion })
    const page = await ctx.newPage()
    await page.goto(BASE + '/', { waitUntil: 'networkidle' })
    await wait(1200)
    const results = []
    // mede em várias posições (cenas fixadas mudam o layout)
    const max = await page.evaluate(() => document.documentElement.scrollHeight)
    for (const f of [0, 0.25, 0.5, 0.75, 1]) {
      await scrollTo(page, Math.round(max * f), 500)
      results.push(await page.evaluate(overflowScript))
    }
    const h1 = await page.evaluate(() => {
      const h = document.querySelector('h1')
      return Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight))
    })
    out.push({
      width: w,
      reducedMotion,
      h1Lines: h1,
      maxScrollW: Math.max(...results.map((r) => r.scrollW)),
      overflow: [...new Set(results.flatMap((r) => r.overflow))],
      brokenAnchors: [...new Set(results.flatMap((r) => r.brokenAnchors))],
    })
    await ctx.close()
  }
  return out
}

const browser = await launch()
await mkdir(OUT, { recursive: true })
const only = process.argv[2]
const scenarios = [
  { name: 'desktop-motion', width: 1440, height: 900, reducedMotion: 'no-preference' },
  { name: 'desktop-reduce', width: 1440, height: 900, reducedMotion: 'reduce' },
  { name: 'desktop-reduce-forced', width: 1440, height: 900, reducedMotion: 'reduce', query: '?movimento=1' },
  { name: 'mobile-motion', width: 390, height: 844, reducedMotion: 'no-preference', mobile: true },
  { name: 'mobile-reduce', width: 390, height: 844, reducedMotion: 'reduce', mobile: true },
]
if (!only || only === 'scenes') for (const s of scenarios) report.runs.push(await run(browser, s))
if (!only || only === 'interactions') report.interactions = await interactions(browser)
if (!only || only === 'overflow') {
  report.overflow = [...(await overflowSweep(browser, 'no-preference')), ...(await overflowSweep(browser, 'reduce'))]
}
await browser.close()
await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2))
for (const r of report.runs) console.log(r.name, JSON.stringify(r.checks), 'errors:', r.errors.length ? r.errors : 0)
if (report.interactions) console.log('interactions', JSON.stringify(report.interactions, null, 1))
if (report.overflow) for (const o of report.overflow) console.log('overflow', o.width, o.reducedMotion, 'h1:', o.h1Lines, 'scrollW:', o.maxScrollW, o.overflow.length ? o.overflow : 'ok', o.brokenAnchors.length ? o.brokenAnchors : '')

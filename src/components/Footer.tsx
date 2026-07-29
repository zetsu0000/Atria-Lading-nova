import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GRAIN, SEAM_BAND, SEAM_GLOW, SEAM_PLACEMENT } from '../lib/grain'

gsap.registerPlugin(ScrollTrigger)

const PRIMARY_LINKS = [
  { label: 'Início', href: '#top' },
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#contato' },
  { label: 'LinkedIn', href: '#contato' },
  { label: 'Behance', href: '#contato' },
]

/**
 * The nav and the address share one type size — in the reference the email is
 * set exactly like a link, which is what keeps the four columns reading as one
 * row rather than three columns and a block of contact details.
 *
 * Leading carries the vertical rhythm on its own (no gap between the items):
 * the reference steps 28px on a 20px face, and a gap on top of that opens the
 * lists into something looser than the print setting it is imitating.
 */
const EDITORIAL_LINK =
  'group relative inline-block w-fit text-[clamp(1.2rem,1.45vw,1.4rem)] leading-[1.4] font-normal tracking-[-0.02em] text-[#0a0a0a] after:absolute after:right-0 after:bottom-[0.14em] after:left-0 after:h-px after:origin-right after:scale-x-0 after:bg-[#0a0a0a] after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:origin-left hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]'

/** The micro-caption voice: monospaced, uppercase, widely tracked, ~9px. */
const MICRO = 'font-mono text-[9px] leading-[1.5] tracking-[0.15em] uppercase sm:text-[10px]'

/**
 * The closing wordmark's size, as a fraction of the measure it has to fill.
 *
 * The reference spans its wordmark edge to edge, and that — not its size — is
 * the device. But its name is fourteen letters long and ours is five, so the
 * two cannot both be satisfied by scale alone: setting five letters to fill
 * that width gives glyphs three times the reference's height, and the footer
 * stops being a footer. So the size is fixed against the measure and the
 * *tracking* is solved for, which is the ordinary answer to a short display
 * word. Letters stay legible as a word and the line still closes on the edge.
 */
const WORDMARK_SCALE = 0.45

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const wordmarkBoxRef = useRef<HTMLDivElement>(null)
  const wordmarkShiftRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLAnchorElement>(null)

  // Closing the wordmark on the measure cannot be done with a literal: the
  // width of five letters depends on Stack Sans Text's advances, so any
  // hand-tuned value leaves a gap on one viewport and overflows on another.
  // This measures the word at its natural spacing and solves for the tracking
  // that closes the gap.
  useLayoutEffect(() => {
    const link = wordmarkRef.current
    const box = wordmarkBoxRef.current
    if (!link || !box) return

    // Only the measure matters. The observer below watches the crop, and
    // fitting changes that box's *height* — without this guard the write
    // re-enters the observer that triggered it.
    let lastMeasure = 0

    const fit = (force = false) => {
      const target = box.clientWidth
      const gaps = (link.textContent ?? '').trim().length - 1
      if (!target || gaps < 1 || (!force && target === lastMeasure)) return
      lastMeasure = target

      const size = target * WORDMARK_SCALE
      link.style.fontSize = `${size}px`
      link.style.letterSpacing = '0'
      link.style.marginRight = '0'

      // offsetWidth, not a client rect: the shift wrapper above this element
      // is under a scrubbed transform, and a rect would be scaled by it.
      const natural = link.offsetWidth
      if (!natural) return

      // Never let a narrow viewport drive the letters into each other.
      const track = Math.max((target - natural) / gaps, -0.02 * size)
      link.style.letterSpacing = `${track}px`
      // CSS applies the tracking after the last glyph too; pull that back off
      // or the word closes one gap past the edge of the crop.
      link.style.marginRight = `${-track}px`

      ScrollTrigger.refresh()
    }

    fit(true)

    // Fit again once the webfont lands — the first pass measures the fallback
    // face, whose advances are nothing like Stack Sans Text's. Forced, since
    // the measure has not changed and the guard above would swallow it.
    let alive = true
    document.fonts?.ready.then(() => {
      if (alive) fit(true)
    })

    const observer = new ResizeObserver(() => fit())
    observer.observe(box)

    return () => {
      alive = false
      observer.disconnect()
    }
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const context = gsap.context(() => {
      const media = gsap.matchMedia()

      media.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          full: '(prefers-reduced-motion: no-preference)',
        },
        (mediaContext) => {
          const reduce = Boolean(mediaContext.conditions?.reduce)

          if (reduce) {
            gsap.set([contentRef.current, wordmarkShiftRef.current], { clearProps: 'all' })
            return
          }

          // This entrance hides the four columns and depends on a trigger to
          // give them back, so every way it can fail to play is a way the
          // footer ships blank. It has failed in Chrome: the wordmark fit
          // below calls ScrollTrigger.refresh() when the webfont resolves, a
          // refresh re-renders the start state of a `from`/`fromTo` bound to a
          // trigger, and re-applying autoAlpha:0 after a `once` trigger has
          // already fired and killed itself leaves nothing to turn it back on.
          // Font timing is what varies between browsers, which is why only one
          // of them showed it.
          //
          // Two changes make that unreachable rather than unlikely. The hidden
          // state is written by a `set`, which is not attached to the trigger
          // and so cannot be re-rendered by a refresh; and it is only written
          // at all when the footer is still below the point that would have
          // fired the trigger. Arriving with it already on screen — a deep
          // link, a restored scroll position, a hot reload — now simply skips
          // the animation instead of betting the content on it.
          const ENTER_AT = 0.74

          if (root.getBoundingClientRect().top > window.innerHeight * ENTER_AT) {
            gsap.set(contentRef.current, { y: 34, autoAlpha: 0 })
            gsap.to(contentRef.current, {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              ease: 'power3.out',
              immediateRender: false,
              scrollTrigger: {
                trigger: root,
                start: `top ${ENTER_AT * 100}%`,
                once: true,
              },
            })
          }

          // The wordmark rises into its own crop as the footer is reached. On
          // the wrapper rather than the link, so the fit above can measure the
          // link's untransformed layout width.
          gsap.fromTo(
            wordmarkShiftRef.current,
            { yPercent: 26 },
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: 0.85,
                invalidateOnRefresh: true,
              },
            },
          )
        },
      )

      return () => media.revert()
    }, root)

    return () => context.revert()
  }, [])

  return (
    <footer
      ref={rootRef}
      id="contato"
      className="relative isolate -mt-px flex flex-col overflow-hidden bg-[#f2eee4] px-5 pt-16 pb-0 text-[#0a0a0a] sm:px-8 sm:pt-20 lg:px-9 lg:pt-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        {/* The far half of the boundary glow the section above anchors to its
            own bottom edge. Same colour, same placement, same band height — the
            values are shared rather than eyeballed twice, because a glow that
            is 0.44 at 24% on one side of the line and 0.55 at 18% on the other
            puts a step exactly where the join is supposed to disappear. */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: SEAM_BAND.bottom,
            background: `radial-gradient(${SEAM_PLACEMENT.bottom} 0%, ${SEAM_GLOW.bottom}, transparent 76%)`,
          }}
        />
      </div>

      {/* Four equal columns. The reference steps its four starts at an even
          interval across the full measure — weighting them would put the
          contact block on a different axis from the two link lists, and the
          row would stop reading as one line of the same voice. */}
      <div
        ref={contentRef}
        className="relative mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-4"
      >
        <div>
          <a
            href="#top"
            className="text-[15px] font-semibold tracking-[0.01em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
          >
            Atria
          </a>
          <p className={`mt-5 max-w-[26ch] text-[#0a0a0a]/70 ${MICRO}`}>
            Sistemas que percebem.
            <br />
            Decisões que se explicam.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <ul className="flex flex-col items-start">
            {PRIMARY_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={EDITORIAL_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Redes sociais">
          <ul className="flex flex-col items-start">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={EDITORIAL_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <address className="flex flex-col items-start not-italic">
          <a
            href="mailto:contato@atria.com"
            className="text-[clamp(1.2rem,1.45vw,1.4rem)] leading-[1.4] font-normal tracking-[-0.02em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
          >
            contato@atria.com
          </a>
          <p className={`mt-3 text-[#0a0a0a]/45 ${MICRO}`}>
            Website by Atria
            <br />© {new Date().getFullYear()} Atria — Brasil
          </p>
        </address>
      </div>

      {/* The crop. The wordmark's baseline sits below the page edge, so the
          letters are cut rather than resting on it — the negative margin is
          what puts the cut inside the descenders instead of under them. */}
      <div
        ref={wordmarkBoxRef}
        className="relative mx-auto mt-auto w-full max-w-[1600px] overflow-hidden pt-[clamp(5rem,13vh,10rem)]"
      >
        <div ref={wordmarkShiftRef} className="will-change-transform">
          <a
            ref={wordmarkRef}
            href="#top"
            aria-label="Voltar ao início"
            className="-mb-[0.15em] inline-block whitespace-nowrap text-[42vw] leading-[0.82] font-normal text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#0a0a0a]"
          >
            atria
          </a>
        </div>
      </div>
    </footer>
  )
}

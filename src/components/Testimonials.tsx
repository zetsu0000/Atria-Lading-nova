import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/** The section's two only colours: the field's ink and the brand's cobalt. */
const INK = '#08223d'
const COBALT = '#2f6bff'

/**
 * Placeholder copy. The names, roles and companies below are invented — swap
 * them for real, approved quotes before this goes live.
 *
 * Ordered to answer the solutions section in the same sequence: perceber →
 * auditar → escalar. Each voice closes one of the three claims made upstream.
 */
const VOICES = [
  {
    quote:
      'Seis ferramentas viraram uma camada só. O time voltou a decidir com os dados em vez de reconciliar.',
    name: 'Helena Braga',
    role: 'Diretora de Operações',
    company: 'Verdano',
  },
  {
    quote:
      'Os analistas confiam porque veem como cada recomendação foi construída. Rastreabilidade virou rotina.',
    name: 'Camila Ferraz',
    role: 'Head de Dados',
    company: 'Instituto Mareé',
  },
  {
    quote:
      'A primeira versão entrou em produção em cinco semanas. Nada precisou ser reescrito quando a escala chegou.',
    name: 'Rafael Nakamura',
    role: 'CTO',
    company: 'Lumeo Saúde',
  },
]

/** Horizontal offset per voice — the quotes step off-axis, the rules do not. */
const INDENT = ['', 'lg:ml-[30%]', 'lg:ml-[13%]']

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const quoteRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const ruleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const footRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  // Layout effect, not a plain effect: the words start at 16% opacity, and
  // setting that after the browser has painted would flash the full sentence.
  useLayoutEffect(() => {
    if (!rootRef.current || !listRef.current) return

    const mm = gsap.matchMedia()

    // Both conditions are declared so the callback runs either way — with one
    // condition, matchMedia simply never fires when it doesn't match, and the
    // spine would go dead for readers who asked for less motion.
    mm.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        full: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const reduce = Boolean(context.conditions?.reduce)
        const splits: SplitText[] = []

        // Spine fill. Scroll position, not animation, so it runs under reduced
        // motion too. quickSetter keeps the per-frame write off GSAP's tween
        // machinery — this fires on every scroll frame.
        const fill = fillRef.current
        if (fill) {
          gsap.set(fill, { scaleY: 0, transformOrigin: 'top' })
          const setFill = gsap.quickSetter(fill, 'scaleY')
          ScrollTrigger.create({
            trigger: listRef.current,
            start: 'top 62%',
            end: 'bottom 45%',
            onUpdate: (self) => setFill(self.progress),
            onRefresh: (self) => setFill(self.progress),
          })
        }

        quoteRefs.current.forEach((quote, index) => {
          if (!quote) return

          // Which voice the spine points at. Three triggers, one state write
          // each time the reader crosses into a new quote.
          ScrollTrigger.create({
            trigger: quote,
            start: 'top 62%',
            end: 'bottom 45%',
            onToggle: (self) => {
              if (self.isActive) setActive(index)
            },
          })

          // The ledger rule draws toward the company that signs it, and the
          // name only lands once the line has reached it. Triggered off the
          // rule rather than the quote, so it draws as it enters rather than
          // half a screen later.
          const rule = ruleRefs.current[index]
          const label = labelRefs.current[index]
          if (rule && label) {
            gsap
              .timeline({ scrollTrigger: { trigger: rule, start: 'top 94%', once: true } })
              .from(rule, {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: reduce ? 0 : 1.1,
                ease: 'power3.inOut',
              })
              .from(
                label,
                { opacity: 0, duration: reduce ? 0 : 0.6, ease: 'power2.out' },
                reduce ? 0 : 0.4,
              )
          }

          const foot = footRefs.current[index]
          if (foot) {
            // Fires late — the attribution arrives once the quote has been
            // read, the way a name lands after a sentence, not before it.
            gsap.from(foot, {
              yPercent: 100,
              opacity: 0,
              duration: reduce ? 0 : 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: quote, start: 'bottom 72%', once: true },
            })
          }

          if (reduce) return

          const split = SplitText.create(quote, { type: 'words', aria: 'auto' })
          splits.push(split)

          // The ignition. Words do not move — they light up in place, in
          // reading order, as the sentence is scrolled through: a front of
          // cobalt travelling left to right that settles into ink behind it.
          // The travel comes entirely from the shared stagger; the 0.4s offset
          // between the two tweens is how long a word stays lit before it
          // cools. Movement here would read as decoration; this reads as the
          // system parsing the sentence.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: quote,
                start: 'top 82%',
                end: 'bottom 48%',
                scrub: 0.5,
              },
            })
            .fromTo(
              split.words,
              { opacity: 0.16, color: COBALT },
              { opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.11 },
              0,
            )
            .to(
              split.words,
              { color: INK, duration: 1.2, ease: 'power2.out', stagger: 0.11 },
              0.4,
            )
        })

        return () => {
          splits.forEach((split) => split.revert())
        }
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      id="sobre"
      aria-labelledby="vozes-titulo"
      className="px-5 pt-24 pb-24 sm:px-8 sm:pt-32 sm:pb-32 lg:px-9 lg:pt-40 lg:pb-44"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="max-w-[46ch]">
          <p className="text-[12px] font-medium tracking-[0.18em] text-[#08223d]/55 uppercase sm:text-[13px]">
            Quem já atravessou
          </p>

          <h2
            id="vozes-titulo"
            className="mt-4 text-[clamp(1.65rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.01em] text-[#08223d] uppercase"
          >
            Resultados antes de promessas
          </h2>
        </header>

        <div className="mt-20 sm:mt-24 lg:mt-32 lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Spine — the section's index, and the only thing in this column.
              Sticky rather than pinned: the page has no scroll hijacking
              anywhere else and this section is not where that should start. */}
          <div aria-hidden="true" className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-[42vh]">
              <div className="relative pl-6">
                <span className="absolute top-1 bottom-1 left-0 w-px bg-[#08223d]/18" />
                <span ref={fillRef} className="absolute top-1 bottom-1 left-0 w-px bg-[#2f6bff]" />

                <ol className="flex flex-col gap-10">
                  {VOICES.map((voice, index) => (
                    <li
                      key={voice.name}
                      className={`text-[11px] tabular-nums tracking-[0.2em] transition-colors duration-500 ${
                        index === active ? 'text-[#08223d]' : 'text-[#08223d]/30'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Voices. The rules run the full column width on every row — they
              are the ledger the section is written on — while the quotes step
              off that axis. Nothing here sits on a surface: no card, no fill,
              no border but the hairline. */}
          <ul
            ref={listRef}
            className="flex flex-col gap-[clamp(104px,15vh,180px)] lg:col-span-11 lg:col-start-2"
          >
            {VOICES.map((voice, index) => (
              <li key={voice.name}>
                <div className="flex items-center gap-5 sm:gap-6">
                  <span className="text-[11px] tabular-nums tracking-[0.2em] text-[#08223d]/45 lg:hidden">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    ref={(el) => {
                      ruleRefs.current[index] = el
                    }}
                    aria-hidden="true"
                    className="h-px flex-1 bg-[#08223d]/20"
                  />
                  <span
                    ref={(el) => {
                      labelRefs.current[index] = el
                    }}
                    className="text-[11px] tracking-[0.2em] whitespace-nowrap text-[#08223d]/50 uppercase"
                  >
                    {voice.company}
                  </span>
                </div>

                <blockquote className={`mt-9 sm:mt-12 ${INDENT[index]}`}>
                  <p
                    ref={(el) => {
                      quoteRefs.current[index] = el
                    }}
                    className="max-w-[24ch] font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.06] font-normal text-[#08223d] italic"
                  >
                    {voice.quote}
                  </p>

                  {/* Mask for the attribution's rise. */}
                  <footer className="mt-9 overflow-hidden sm:mt-11">
                    <div
                      ref={(el) => {
                        footRefs.current[index] = el
                      }}
                    >
                      <cite className="text-[13px] tracking-[0.04em] text-[#08223d] uppercase not-italic sm:text-[14px]">
                        {voice.name}
                      </cite>
                      <p className="mt-1.5 text-[13px] leading-[1.4] text-[#08223d]/60 sm:text-[14px]">
                        {voice.role}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

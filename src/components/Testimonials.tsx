import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { GRAIN, SEAM_BAND, SEAM_GLOW, SEAM_PLACEMENT } from '../lib/grain'

gsap.registerPlugin(ScrollTrigger, SplitText)

/** The section's two only colours: the field's ink and the brand's cobalt. */
const INK = '#08223d'
const COBALT = '#2f6bff'


/**
 * The field itself, unchanged: a radial anchored at the top-left corner,
 * sampled #2c85e5 → #b7defb, so the section opens saturated and fades out
 * toward the footer.
 */
const FIELD =
  'radial-gradient(120% 140% at 0% 0%, #2c85e5 0%, #62aaea 30%, #97cbf4 62%, #b7defb 100%)'

/** Princípios editoriais da Atria: direção → clareza → encontrabilidade. */
const VOICES = [
  {
    quote:
      'Quando cada canal comunica uma versão diferente de você, nenhum deles sustenta sua presença por inteiro.',
    name: 'Coerência',
    role: 'Uma direção para todos os pontos de contato.',
    company: 'Presença digital',
  },
  {
    quote:
      'Clareza não reduz a complexidade do seu trabalho. Torna visível o critério que o diferencia.',
    name: 'Reconhecimento',
    role: 'Uma linguagem que torna diferenças compreensíveis.',
    company: 'Posicionamento',
  },
  {
    quote:
      'Busca só tem valor quando aproxima sua presença dos temas que realmente definem a sua atuação.',
    name: 'Encontrabilidade',
    role: 'Conteúdo e busca conectados ao seu posicionamento.',
    company: 'Relevância',
  },
]

/** Horizontal offset per voice — the quotes step off-axis, the rules do not. */
const INDENT = ['', 'lg:ml-[30%]', 'lg:ml-[13%]']

/**
 * Measure per voice. With the indents alone, three quotes of similar length
 * still stack into three blocks of the same mass; varying the measure is what
 * keeps the column from reading as a list.
 */
const MEASURE = ['max-w-[24ch]', 'max-w-[19ch]', 'max-w-[22ch]']

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const hazeRef = useRef<HTMLDivElement>(null)
  const footerCurtainRef = useRef<HTMLDivElement>(null)
  const leadFillRef = useRef<HTMLSpanElement>(null)
  const leadGlintRef = useRef<HTMLSpanElement>(null)
  const headLineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const quoteRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const ruleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const markRefs = useRef<(HTMLSpanElement | null)[]>([])
  const footRefs = useRef<(HTMLDivElement | null)[]>([])

  // Layout effect, not a plain effect: the words start at 16% opacity, and
  // setting that after the browser has painted would flash the full sentence.
  useLayoutEffect(() => {
    if (!rootRef.current) return

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

        // The light in the room moves while the section is read. Two washes
        // drifting against each other at different rates: a pale bloom falling
        // with the scroll, a cobalt haze rising into it. Transform-only, on
        // layers that are already composited, so this costs nothing per frame
        // — and it is the difference between a lit field and a flat fill.
        if (!reduce) {
          const drift = {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          } as const

          gsap.fromTo(
            bloomRef.current,
            { yPercent: -16, xPercent: -6 },
            { yPercent: 20, xPercent: 8, ease: 'none', scrollTrigger: drift },
          )
          gsap.fromTo(
            hazeRef.current,
            { yPercent: 24, xPercent: 6 },
            { yPercent: -12, xPercent: -8, ease: 'none', scrollTrigger: drift },
          )
        }

        // A restrained curved curtain closes the bright field into the footer.
        // The section and footer already agree on their boundary colour; this
        // only gives that handoff a little depth and motion.
        if (footerCurtainRef.current) {
          if (reduce) {
            gsap.set(footerCurtainRef.current, {
              scaleX: 1.08,
              scaleY: 1,
              yPercent: 0,
              rotation: 0,
            })
          } else {
            gsap.fromTo(
              footerCurtainRef.current,
              { scaleX: 0.64, scaleY: 0.58, yPercent: 30, rotation: -1.4 },
              {
                scaleX: 1.08,
                scaleY: 1,
                yPercent: 0,
                rotation: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: rootRef.current,
                  start: 'bottom 148%',
                  end: 'bottom bottom',
                  scrub: 0.9,
                  invalidateOnRefresh: true,
                },
              },
            )
          }
        }

        // Header. The two title lines rise out of their own overflow — which
        // means that until the trigger fires they are parked outside it, i.e.
        // invisible. Same shape of failure the footer's entrance had: a
        // ScrollTrigger.refresh() re-renders the start state of a `from` bound
        // to a spent `once` trigger and the title never comes back.
        //
        // So the start state is set outside the tween, and only when the
        // section is still below the line that would have fired it.
        const ENTER_AT = 0.78
        const lines = headLineRefs.current.filter(Boolean)
        const head = rootRef.current

        if (head && lines.length && head.getBoundingClientRect().top > window.innerHeight * ENTER_AT) {
          gsap.set(lines, { yPercent: 108 })
          gsap.to(lines, {
            yPercent: 0,
            duration: reduce ? 0 : 1,
            ease: 'power3.out',
            stagger: reduce ? 0 : 0.09,
            immediateRender: false,
            scrollTrigger: {
              trigger: rootRef.current,
              start: `top ${ENTER_AT * 100}%`,
              once: true,
            },
          })
        }

        quoteRefs.current.forEach((quote, index) => {
          if (!quote) return

          // The ledger rule draws toward the company that signs it, and the
          // name only lands once the line has reached it. Triggered off the
          // rule rather than the quote, so it draws as it enters rather than
          // half a screen later.
          const rule = ruleRefs.current[index]
          const label = labelRefs.current[index]
          if (rule && label) {
            if (index === 0 && leadFillRef.current) {
              const fill = leadFillRef.current
              const glint = leadGlintRef.current

              gsap.set(fill, { transformOrigin: 'left center' })

              if (reduce) {
                gsap.set(fill, { scaleX: 1 })
                gsap.set(glint, { autoAlpha: 0 })
              } else {
                gsap.set(glint, { xPercent: -50, x: 0, autoAlpha: 0 })

                const leadTl = gsap.timeline({
                  scrollTrigger: {
                    trigger: rule,
                    start: 'top 92%',
                    end: 'top 34%',
                    scrub: 0.65,
                    invalidateOnRefresh: true,
                  },
                })

                leadTl.fromTo(
                  fill,
                  { scaleX: 0 },
                  { scaleX: 1, duration: 1, ease: 'none' },
                  0,
                )

                if (glint) {
                  leadTl
                    .to(glint, { autoAlpha: 1, duration: 0.04, ease: 'none' }, 0)
                    .to(glint, { x: () => rule.offsetWidth, duration: 1, ease: 'none' }, 0)
                    .to(glint, { autoAlpha: 0, duration: 0.08, ease: 'none' }, 0.92)
                }

                gsap.from(label, {
                  opacity: 0,
                  duration: 0.65,
                  ease: 'power2.out',
                  scrollTrigger: { trigger: rule, start: 'top 94%', once: true },
                })
              }
            } else {
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
          }

          const foot = footRefs.current[index]
          const mark = markRefs.current[index]
          if (foot) {
            // Fires late — the attribution arrives once the quote has been
            // read, the way a name lands after a sentence, not before it.
            const footTl = gsap.timeline({
              scrollTrigger: { trigger: quote, start: 'bottom 72%', once: true },
            })

            footTl.from(foot, {
              yPercent: 100,
              opacity: 0,
              duration: reduce ? 0 : 0.9,
              ease: 'power3.out',
            })

            // The cobalt mark draws down beside the name as it arrives: the
            // spine's colour, reappearing at the moment the voice is signed.
            if (mark) {
              footTl.from(
                mark,
                {
                  scaleY: 0,
                  transformOrigin: 'top',
                  duration: reduce ? 0 : 0.8,
                  ease: 'power3.out',
                },
                reduce ? 0 : 0.12,
              )
            }
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
      className="relative isolate px-5 pt-[9.9rem] pb-36 sm:px-8 sm:pt-[12.1rem] sm:pb-48 lg:px-9 lg:pt-[15.4rem] lg:pb-64"
    >
      {/* ── The field ─────────────────────────────────────────────────────
          Five layers, none of them content: the sampled gradient, two drifting
          washes, grain, and the two seams that dissolve this section into the
          dark ones on either side of it. -z-10 under `isolate`, so the whole
          stack stays behind the text and can't escape the section.

          The clip lives here rather than on the section: `overflow-hidden` on
          the section would make it a scroll container, and the sticky spine
          would stop sticking. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{ background: FIELD }} />

        {/* Pale bloom, falling. Soft-light rather than a white overlay so it
            lifts the field's own blue instead of washing it toward grey. */}
        <div
          ref={bloomRef}
          className="absolute -top-[15%] left-[26%] h-[95%] w-[78%] opacity-80 mix-blend-soft-light will-change-transform"
          style={{
            background: 'radial-gradient(closest-side, rgb(255 255 255 / 0.95), transparent 100%)',
          }}
        />

        {/* Cobalt haze, rising. Keeps the pale bottom of the gradient from
            going dead before the footer takes over. */}
        <div
          ref={hazeRef}
          className="absolute -bottom-[22%] left-[-18%] h-[85%] w-[85%] opacity-70 will-change-transform"
          style={{
            background: 'radial-gradient(closest-side, rgb(38 108 214 / 0.5), transparent 100%)',
          }}
        />

        {/* Seams. Without these the page hard-cuts #07090d → #2c85e5 at the
            top and #b7defb → #061a30 at the bottom, and both edges read as
            three separate pages stacked rather than one that changes light.
            The section owns the colour half of both, so neither neighbour has
            to know how this field is built.

            The stops are weighted rather than evenly spaced: an even ramp
            spends most of its length in the middle greys, where there is
            nothing to resolve, and rushes the two ends, which is where the eye
            actually looks for the join. */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: SEAM_BAND.top,
            background:
              'linear-gradient(to bottom, #07090d 0%, rgb(7 9 13 / 0.95) 9%, rgb(7 9 13 / 0.82) 22%, rgb(7 9 13 / 0.6) 40%, rgb(7 9 13 / 0.36) 58%, rgb(7 9 13 / 0.17) 74%, rgb(7 9 13 / 0.05) 89%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: SEAM_BAND.bottom,
            background:
              'linear-gradient(to bottom, transparent 0%, rgb(242 238 228 / 0.06) 14%, rgb(242 238 228 / 0.18) 30%, rgb(242 238 228 / 0.38) 48%, rgb(242 238 228 / 0.62) 66%, rgb(242 238 228 / 0.84) 84%, #f2eee4 100%)',
          }}
        />

        <div
          ref={footerCurtainRef}
          className="absolute -bottom-px left-1/2 h-[clamp(210px,29vh,390px)] w-[170vw] -translate-x-1/2 rounded-[62%_38%_0_0/100%_100%_0_0] will-change-transform"
          style={{
            background:
              'linear-gradient(to bottom, rgb(250 247 239 / 0.34), rgb(242 238 228 / 0.9) 48%, #f2eee4 100%)',
          }}
        />

        {/* Half of each boundary glow — the other half lives in the section on
            the far side of the line, anchored to its own edge with the same
            colour and placement. Painted over the seams, so what the reader
            sees is light thinning out across the join rather than a field that
            stops being lit at the exact pixel the section ends. */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: SEAM_BAND.top,
            background: `radial-gradient(${SEAM_PLACEMENT.top} 0%, ${SEAM_GLOW.top}, transparent 74%)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: SEAM_BAND.bottom,
            background: `radial-gradient(${SEAM_PLACEMENT.bottom} 100%, ${SEAM_GLOW.bottom}, transparent 76%)`,
          }}
        />

        {/* Grain last, so it covers the seams too. It is not only texture here:
            a ramp this long from near-black into a saturated blue bands on an
            8-bit display, and grain is the dither. Under the seams — where it
            used to sit — the two ends of the section were the only ungrained
            parts of it, which is precisely where the banding showed. */}
        <div
          className="absolute inset-0 opacity-[0.055] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1600px]">
        {/* No eyebrow, count or index: the scroll already says there are more
            voices below, and labelling that turns an editorial section into
            carousel chrome. */}
        <header className="flex flex-col items-center text-center">
          {/* Sans caps against serif italic, on two lines. The same pairing the
              quotes and the solutions titles already use — stated here at the
              scale of a heading, so the section's voice is set before the first
              quote rather than by it. */}
          <h2 id="vozes-titulo">
            <span className="block overflow-hidden pb-[0.06em]">
              <span
                ref={(el) => {
                  headLineRefs.current[0] = el
                }}
                className="block text-[clamp(1.5rem,2.5vw,2.15rem)] leading-[1.05] tracking-[0.01em] text-[#08223d] uppercase"
              >
                Posicionamento
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span
                ref={(el) => {
                  headLineRefs.current[1] = el
                }}
                className="block font-serif text-[clamp(2.4rem,4.4vw,4rem)] leading-[1.02] font-normal text-[#08223d] italic"
              >
                não é aparência
              </span>
            </span>
          </h2>
        </header>

        {/* Voices. The rules run the full width while the quotes step off-axis.
            Nothing here sits on a surface: no card, no fill, no border but the
            hairline. */}
        <div className="mt-28 sm:mt-36 lg:mt-48">
          <ul className="flex flex-col gap-[clamp(152px,22vh,260px)]">
            {VOICES.map((voice, index) => (
              <li key={voice.name}>
                <div className="flex items-center gap-5 sm:gap-6">
                  <span
                    ref={(el) => {
                      ruleRefs.current[index] = el
                    }}
                    aria-hidden="true"
                    className="relative h-px flex-1 overflow-visible bg-[#08223d]/20"
                  >
                    {index === 0 && (
                      <>
                        <span
                          ref={leadFillRef}
                          className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 will-change-transform"
                          style={{
                            background:
                              'linear-gradient(90deg, rgb(8 34 61 / 0.18) 0%, rgb(47 107 255 / 0.42) 70%, rgb(104 171 255 / 0.62) 100%)',
                            boxShadow: '0 0 12px rgb(47 107 255 / 0.18)',
                          }}
                        />
                        <span
                          ref={leadGlintRef}
                          className="pointer-events-none absolute top-1/2 left-0 h-5 w-24 -translate-y-1/2 blur-[5px] will-change-transform"
                          style={{
                            background:
                              'radial-gradient(ellipse at center, rgb(134 188 255 / 0.62) 0%, rgb(47 107 255 / 0.26) 36%, transparent 74%)',
                          }}
                        />
                      </>
                    )}
                  </span>
                  <span
                    ref={(el) => {
                      labelRefs.current[index] = el
                    }}
                    className="text-[11px] tracking-[0.2em] whitespace-nowrap text-[#08223d]/50 uppercase"
                  >
                    {voice.company}
                  </span>
                </div>

                <blockquote className={`mt-12 sm:mt-16 ${INDENT[index]}`}>
                  <p
                    ref={(el) => {
                      quoteRefs.current[index] = el
                    }}
                    className={`font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.06] font-normal text-pretty text-[#08223d] italic ${MEASURE[index]}`}
                  >
                    {voice.quote}
                  </p>

                  <footer className="mt-12 flex gap-5 sm:mt-16">
                    <span
                      ref={(el) => {
                        markRefs.current[index] = el
                      }}
                      aria-hidden="true"
                      className="w-px self-stretch bg-[#2f6bff]/75"
                    />
                    {/* Mask for the attribution's rise. */}
                    <div className="overflow-hidden pb-[0.1em]">
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

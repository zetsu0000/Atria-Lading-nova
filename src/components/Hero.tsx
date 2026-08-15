import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AtriaFilm from './AtriaFilm'
import CtaButton from './CtaButton'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const filmRef = useRef<HTMLDivElement>(null)

  // On phones the whole hero used to slide away as one flat block, which read
  // as a plain screenshot next to the desktop version. Letting the film lag
  // behind the scroll (a quarter of the scroll distance, scrubbed) keeps the
  // face pinned in view while the copy exits over it — the same depth the
  // desktop composition gets from its full-viewport frame. The film only ever
  // moves down slower than the section leaves, so the top edge it exposes
  // stays above the viewport and no seam can show. Desktop keeps the static
  // frame it always had; reduced motion opts out with the rest of the page.
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add(
      '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
      () => {
        gsap.fromTo(
          filmRef.current,
          { yPercent: 0 },
          {
            yPercent: 24,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      },
    )
    return () => media.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-black px-5 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-8 lg:px-9 lg:pb-9"
    >
      {/* Background film — an 8s glass-panel reveal that pushes into a macro
          shot, which is what gives the hero its depth. Kept on a black base so
          a slow or blocked video degrades to the plain black hero. The film
          sits in its own layer so the parallax moves the footage alone — the
          scrims below stay pinned to the type they exist to protect. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black">
        <div ref={filmRef} className="absolute inset-0 will-change-transform">
          <AtriaFilm className="size-full object-cover object-center" />
        </div>

        {/* Scrims are pinned to where type actually sits and fade out well
            before the middle of the frame, so the film itself runs at full
            strength — the reveal and the macro eye stay bright. Legibility on
            the copy comes from these plus the text-shadows below, not from
            dimming the whole video. */}

        {/* Under the wordmark / copy / CTA. Reaches higher on mobile, where the
            stacked layout puts type through most of the lower half. */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 via-22% to-transparent to-58% lg:via-16% lg:to-45%" />
        {/* Behind the nav pill only. */}
        <div className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-black/45 to-transparent" />
        {/* Behind the right-hand copy column. */}
        <div className="absolute inset-0 bg-linear-to-l from-black/25 to-transparent to-38%" />
      </div>

      <div
        className={[
          'mx-auto flex w-full max-w-[1600px] flex-1 flex-col',
          'lg:grid lg:grid-cols-[minmax(0,1fr)_26.5rem] lg:grid-rows-[1fr_auto] lg:gap-x-12',
          'xl:grid-cols-[minmax(0,1fr)_28rem]',
        ].join(' ')}
      >
        {/* Tagline — upper right on desktop, first line on mobile.

            This is the page's `h1`, not the wordmark below it. A brand name
            alone carries no subject, and it was the most heavily weighted
            heading on the page saying nothing about what the page is for. The
            visible design is unchanged: Tailwind's preflight resets heading
            size and weight to `inherit`, so the tag swap renders identically.

            It also names the reader. "dermatologista" appeared exactly once in
            the whole rendered page — the last line of the footer — which left
            anyone arriving mid-scroll with no way to tell who this is for. */}
        <h1 className="order-1 text-[clamp(1.2rem,1.92vw,1.72rem)] leading-tight tracking-[-0.01em] text-white [text-shadow:0_2px_16px_rgb(0_0_0/0.55)] lg:col-start-2 lg:row-start-1 lg:self-start lg:pt-[26vh]">
          Sua autoridade como dermatologista não deveria parecer genérica.
        </h1>

        {/* Oversized wordmark. Sized in container-query units so it scales with
            its column rather than the viewport: "Atria" in Stack Sans Text at
            weight 400 and -0.035em tracking advances ~2.14x its font size, so
            44.5cqw fills the column edge-to-edge — 35.6cqw is that at -20%,
            leaving ~20% of the column as trailing space. The negative margin
            cancels the leading "A" side bearing (0.038em) so the letter still
            sits flush with the column edge.

            That 20% trailing space is a wide-column device: beside it the
            desktop layout has a second column to fill. On a phone the column
            is the whole screen, so the same value stranded ~115px of dead air
            to the right of the word and made the masthead read undersized —
            worse now that the paragraph below it is gone. Phones therefore
            take the full 44.5cqw, capped against the viewport height so a
            landscape phone can't blow the wordmark past the frame. */}
        <div className="@container order-2 mt-auto pt-12 sm:pt-16 lg:col-start-1 lg:row-start-2 lg:order-none lg:mt-0 lg:pt-0 lg:self-end">
          <div className="-ml-[0.04em] text-[min(47cqw,30svh)] leading-[0.82] font-normal tracking-[-0.035em] text-white [text-shadow:0_4px_40px_rgb(0_0_0/0.30)] sm:text-[35.6cqw]">
            Atria
          </div>
        </div>

        {/* Description + primary CTA — bottom right, baseline-aligned with the wordmark.

            The description is hidden on phones. At 12px under a moving film it
            was below the size at which anyone actually reads a paragraph, so
            it cost the hero its bottom third and returned nothing; the tagline
            above already carries the claim and the CTA carries the action. It
            stays in the markup rather than being deleted, so crawlers and
            every viewport from `sm` up — where the type is large enough to
            work — still get it. */}
        <div className="order-3 mt-8 flex flex-col items-start lg:col-start-2 lg:row-start-2 lg:order-none lg:mt-0 lg:self-end lg:pb-1">
          <p className="hidden max-w-[38ch] text-[12px] leading-[1.5] text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.6)] sm:block sm:text-[13.6px] lg:max-w-none">
            A Atria alinha posicionamento, linguagem, conteúdo e busca para que o critério da sua
            atuação seja percebido antes mesmo da primeira conversa.
          </p>
          <CtaButton className="sm:mt-7 lg:mt-9" />
        </div>
      </div>
    </section>
  )
}

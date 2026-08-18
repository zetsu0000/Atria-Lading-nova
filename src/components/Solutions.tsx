import { useEffect, useRef } from 'react'
import GhostCta from './GhostCta'
import SolutionCard from './SolutionCard'
import SolutionMedia from './SolutionMedia'
import { GRAIN, SEAM_GLOW } from '../lib/grain'
import { WHATSAPP } from '../lib/contact'

/**
 * Enter transition. 20px of travel over 640ms — enough to feel deliberate,
 * short enough that nothing appears to fly in. The stagger comes from delays
 * set per element.
 */
const RISE =
  'translate-y-5 opacity-0 transition-[transform,opacity] duration-[640ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'

/**
 * One size for all three cards. With the sizes equal, the composition's rhythm
 * has to come entirely from placement — which is why the gutters below are
 * anchored rather than left to the column tracks.
 */
const CARD = 'aspect-[4/3] w-full sm:aspect-[1.45/1] lg:w-[clamp(476px,37.4vw,663px)]'

type EditorialProps = {
  title: string
  description: string
  /** Milliseconds. Offsets this block against its facing card. */
  delay: number
  className?: string
}

function Editorial({ title, description, delay, className = '' }: EditorialProps) {
  return (
    <div className={className}>
      {/* Holds the former eyebrow line so title/description spacing stays put. */}
      <div aria-hidden="true" className="h-[18px]" />

      <h3
        data-shown="false"
        className={`mt-5 font-serif text-[clamp(38px,3.6vw,60px)] leading-[1.02] font-normal text-mineral italic ${RISE}`}
        style={{ transitionDelay: `${delay + 90}ms` }}
      >
        {title}
      </h3>

      <p
        data-shown="false"
        className={`mt-5 text-[clamp(17px,1.25vw,20px)] leading-[1.55] text-mineral/65 ${RISE}`}
        style={{ transitionDelay: `${delay + 90}ms` }}
      >
        {description}
      </p>

      <div data-shown="false" className={RISE} style={{ transitionDelay: `${delay + 180}ms` }}>
        <GhostCta label="Entender o processo" href={WHATSAPP.process} className="mt-8" />
      </div>
    </div>
  )
}

export default function Solutions() {
  const rootRef = useRef<HTMLElement>(null)

  // One observer flips `data-shown` on every animated element the first time
  // it arrives. No scroll handler, no parallax — the section is a composition,
  // not a scroll sequence, so continuous motion would fight it.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const targets = root.querySelectorAll('[data-shown]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute('data-shown', 'true')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      id="solucoes"
      aria-labelledby="solucoes-titulo"
      className="relative isolate bg-ink"
    >
      {/* Three restrained halos, one behind where each card lands, plus grain.
          Static: nothing here for a scroll-driven wash to track. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            // Near-black, as in the reference. Each halo takes its colour
            // from the film beside it and stays a whisper — the cards carry
            // the light, the room stays dark.
            background: [
              'radial-gradient(34% 20% at 80% 14%, rgb(214 40 60 / 0.07), transparent 70%)',
              'radial-gradient(32% 18% at 18% 50%, rgb(238 150 90 / 0.06), transparent 70%)',
              'radial-gradient(32% 18% at 80% 86%, rgb(40 130 214 / 0.07), transparent 70%)',
            ].join(','),
          }}
        />
        {/* The far half of the seam this section shares with the bright field
            below it. Anchored to the bottom edge with the same colour and the
            same horizontal placement as its counterpart there, so the two meet
            at identical values on the shared row and the blue appears to be
            arriving rather than switched on. Sits under the third halo, which
            is already the coolest light in the room — this reads as that halo
            reaching the edge. */}
        <div
          className="absolute inset-x-0 bottom-0 h-[clamp(120px,15vh,210px)]"
          style={{
            background: `radial-gradient(64% 100% at 78% 100%, ${SEAM_GLOW.top}, transparent 74%)`,
          }}
        />

        {/* Grain last — it is the page's dither as much as its texture, and it
            has to lie over the seam glow for that to work. */}
        <div
          className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      {/* The hero hands over on a hard cut from film to ink, so on a phone the
          gap either side of that cut is the whole transition. 32px of film
          under the CTA and then 96px of empty ink put almost all of it after
          the cut, which read as the hero being clipped short and the section
          starting late. The hero now keeps 48px under its CTA and this side
          opens at 64px — the same total, weighted onto the lit side of the
          seam. */}
      <div className="relative mx-auto w-full max-w-[1640px] px-5 pt-16 pb-24 sm:px-10 sm:py-28 lg:px-16 lg:py-[clamp(120px,7.5vw,145px)]">
        {/* Section heading — badge over a centred serif line, the one centred
            element in a section that is otherwise deliberately off-axis. */}
        <header className="flex flex-col items-center text-center">
          <p
            data-shown="false"
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] tracking-[0.18em] text-mineral/60 uppercase ring-1 ring-mineral/15 ring-inset ${RISE}`}
          >
            Abordagem
          </p>

          <h2
            id="solucoes-titulo"
            data-shown="false"
            className={`mt-6 max-w-[22ch] font-serif text-[clamp(30px,3.1vw,52px)] leading-[1.06] font-normal text-mineral italic ${RISE}`}
            style={{ transitionDelay: '90ms' }}
          >
            O seu site hoje reflete a excelência do seu consultório?
          </h2>
        </header>

        {/* 12 columns. Every card is anchored to one container edge and every
            copy block to the other, each on a 5-column track — that is what
            makes the copy↔card gutter identical on all three rows instead of
            drifting with the column maths. Nothing is 50/50. */}
        <div
          className={[
            // 88px of empty ink read fine on a wide row but as a hole on a
            // phone column; 64px keeps the pause without the dead air.
            'mt-16 sm:mt-[106px] lg:mt-[clamp(92px,7.15vw,128px)]',
            'lg:grid lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] lg:items-center',
            'lg:gap-x-8 lg:gap-y-[clamp(96px,7vw,140px)]',
          ].join(' ')}
        >
          {/* ── Row 1 ── copy left, dominant card right ── */}
          <Editorial
            title="Elimine o abismo entre o seu trabalho e a sua tela."
            description="Anos de especialização e um atendimento de alto padrão não combinam com um site antigo. Criamos uma vitrine moderna, digna da sua trajetória médica."
            delay={0}
            className="max-w-[560px] lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:justify-self-start"
          />

          <div
            data-shown="false"
            className={`mt-8 lg:col-start-7 lg:col-end-13 lg:row-start-1 lg:mt-0 lg:justify-self-end ${RISE}`}
            style={{ transitionDelay: '120ms' }}
          >
            <SolutionCard className={CARD}>
              <SolutionMedia
                image="/sol-01.webp"
                sources={[{ src: '/sol-01.mp4', type: 'video/mp4' }]}
                alt="Retrato editorial sob luz vermelha e ciano"
                className="size-full object-cover object-center"
              />
            </SolutionCard>
          </div>

          {/* ── Row 2 ── card left, copy right. DOM stays copy-then-card so
              phones read Texto → Card on every row; the grid does the flip. ── */}
          <Editorial
            title="Construído para transmitir autoridade instantânea."
            description="Entendemos exatamente como você se posiciona e o que deseja transmitir. Cada imagem e texto são pensados para valorizar seu trabalho e reforçar a percepção de excelência."
            delay={120}
            className="mt-20 max-w-[560px] sm:mt-28 md:ml-auto lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:mt-0 lg:ml-0 lg:justify-self-end"
          />

          <div
            data-shown="false"
            className={`mt-8 lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:justify-self-start ${RISE}`}
          >
            <SolutionCard className={CARD}>
              <SolutionMedia
                image="/sol-02.webp"
                sources={[{ src: '/sol-02.mp4', type: 'video/mp4' }]}
                alt="Retrato editorial em repouso sob gradiente coral e âmbar, olhos fechados"
                className="size-full object-cover object-center"
              />
            </SolutionCard>
          </div>

          {/* ── Row 3 ── copy left, card right again, but narrower and wider in
              aspect so it never reads as a repeat of row 1. ── */}
          <Editorial
            title="Transforme interesse em novos agendamentos."
            description="Quando seu trabalho é apresentado com clareza, o paciente entende seu valor e se sente mais seguro para avançar. Construímos essa experiência para transformar interesse em novos agendamentos."
            delay={0}
            className="mt-20 max-w-[560px] sm:mt-28 lg:col-span-5 lg:col-start-1 lg:row-start-3 lg:mt-0 lg:justify-self-start"
          />

          <div
            data-shown="false"
            className={`mt-8 lg:col-start-7 lg:col-end-13 lg:row-start-3 lg:mt-0 lg:justify-self-end ${RISE}`}
            style={{ transitionDelay: '120ms' }}
          >
            <SolutionCard className={CARD}>
              <SolutionMedia
                image="/sol-03.webp"
                sources={[{ src: '/sol-03.mp4', type: 'video/mp4' }]}
                alt="Perfil editorial em contraluz azul com feixe ciano percorrendo o rosto"
                className="size-full object-cover object-center"
              />
            </SolutionCard>
          </div>
        </div>
      </div>
    </section>
  )
}

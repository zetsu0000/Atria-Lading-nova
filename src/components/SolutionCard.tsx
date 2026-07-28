import { useRef, type ReactNode } from 'react'

type SolutionCardProps = {
  children: ReactNode
  className?: string
}

/**
 * Frame for a full-bleed campaign film — a hairline border and interior
 * light, nothing else. This used to carry a fabricated top bar ("Atria",
 * screen name, nav) and an indicator strip, back when the card body was a
 * mock dashboard. Once the body became real footage, that chrome was just
 * text sitting on top of the shot for no reason — the reference has none of
 * it, and the film needs to read as one luminous object, not a labelled
 * screenshot.
 *
 * The card is an opaque object on ink, held by a 1px mineral hairline and lit
 * from inside. No drop shadow: a shadow would sit it on a surface, and the
 * composition wants it floating in the dark.
 */
export default function SolutionCard({ children, className = '' }: SolutionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Cobalt reflection tracking the pointer. Writing CSS custom properties
  // straight from the event keeps this off React's render path; the browser
  // already coalesces pointermove to one per frame.
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card || event.pointerType !== 'mouse') return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--px', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    card.style.setProperty('--py', `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={onPointerMove}
      className={[
        'group/card relative isolate overflow-hidden',
        'rounded-[18px] bg-ink-raised sm:rounded-[24px]',
        'ring-1 ring-mineral/12 ring-inset',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0">{children}</div>

      {/* Interior light from the top edge — inside the object, not under it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_bottom,rgb(233_236_242/0.07),transparent_34%)]"
      />
      {/* Disciplined cobalt reflection following the pointer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(38% 46% at var(--px,50%) var(--py,0%), rgb(47 107 255 / 0.16), transparent 70%)',
        }}
      />
    </div>
  )
}

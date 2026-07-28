type GhostCtaProps = {
  label: string
  href: string
  className?: string
}

/**
 * Outline pill CTA for the ink-backed solutions section.
 *
 * Distinct from `CtaButton`, which is a filled white pill for bright
 * backgrounds — a solid white shape here would shout over a composition whose
 * whole point is restraint. Acid appears only on keyboard focus, where it is
 * doing a job.
 */
export default function GhostCta({ label, href, className = '' }: GhostCtaProps) {
  return (
    <a
      href={href}
      className={[
        'group/cta inline-flex h-12 items-center gap-3 rounded-full px-6',
        'text-[14px] whitespace-nowrap text-mineral/85',
        'ring-1 ring-mineral/20 ring-inset',
        'transition-[color,box-shadow,transform] duration-300 ease-out',
        'hover:text-mineral hover:ring-cobalt/70',
        'focus-visible:ring-2 focus-visible:ring-acid focus-visible:outline-none',
        'active:scale-[0.98] active:duration-75',
        'motion-reduce:transition-none motion-reduce:active:scale-100',
        className,
      ].join(' ')}
    >
      {label}
      <span
        aria-hidden="true"
        className="text-[13px] transition-transform duration-300 ease-out group-hover/cta:translate-x-[3px] group-hover/cta:-translate-y-[3px] motion-reduce:transition-none motion-reduce:group-hover/cta:translate-x-0 motion-reduce:group-hover/cta:translate-y-0"
      >
        ↗
      </span>
    </a>
  )
}

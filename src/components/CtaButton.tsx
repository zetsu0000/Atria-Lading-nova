import { ArrowRight } from 'lucide-react'

type CtaButtonProps = {
  label?: string
  href?: string
  className?: string
}

/**
 * White pill with a black circular arrow badge — used both in the nav bar and
 * as the hero's primary call to action.
 */
export default function CtaButton({
  label = 'Get Started',
  href = '#get-started',
  className = '',
}: CtaButtonProps) {
  return (
    <a
      href={href}
      className={[
        'group inline-flex shrink-0 items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-5',
        'text-black transition-colors duration-200 hover:bg-white/90 sm:gap-4 sm:pl-7',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
        className,
      ].join(' ')}
    >
      <span className="text-[14px] leading-none whitespace-nowrap sm:text-[15px]">{label}</span>
      <span
        className="grid size-9 place-items-center rounded-full bg-black text-white transition-transform duration-200 group-hover:rotate-45 sm:size-11"
        aria-hidden="true"
      >
        <ArrowRight className="size-4 sm:size-[18px]" strokeWidth={2} />
      </span>
    </a>
  )
}

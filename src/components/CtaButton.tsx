import { ArrowRight } from 'lucide-react'

type CtaButtonProps = {
  label?: string
  href?: string
  /**
   * `sm` is the nav variant: `default` geometry at 76.5%, tracking the pill's
   * own two reductions so the button holds the same 87.5% height-to-bar ratio
   * it had at full size. The hero keeps `default`.
   */
  size?: 'default' | 'sm'
  className?: string
}

const SIZES = {
  default: {
    shell: 'gap-3 py-1.5 pr-1.5 pl-5 sm:gap-4 sm:pl-7',
    label: 'text-[14px] sm:text-[15px]',
    badge: 'size-9 sm:size-11',
    icon: 'size-4 sm:size-[18px]',
  },
  sm: {
    shell: 'gap-[0.574rem] py-[0.287rem] pr-[0.287rem] pl-[0.956rem] sm:gap-[0.765rem] sm:pl-[1.339rem]',
    label: 'text-[10.7px] sm:text-[11.5px]',
    badge: 'size-[1.721rem] sm:size-[2.104rem]',
    icon: 'size-[0.765rem] sm:size-[13.8px]',
  },
} as const

/**
 * White pill with a black circular arrow badge — used both in the nav bar and
 * as the hero's primary call to action.
 *
 * It sits on a bright, moving video, where a flat white shape reads as a hole
 * punched in the frame. The edge treatment is what keeps it reading as an
 * object: a hairline ring so the shape stays bounded where the film behind it
 * goes near-white, a barely-there top-to-bottom gradient for surface, and a
 * two-part shadow — a tight contact shadow plus a wide soft one — to lift it
 * off the background.
 */
export default function CtaButton({
  label = 'Conversar',
  // `#contato` é a única âncora de contato que existe na página (o rodapé).
  // O padrão anterior, `#comecar`, não correspondia a nenhuma seção.
  href = '#contato',
  size = 'default',
  className = '',
}: CtaButtonProps) {
  const scale = SIZES[size]

  return (
    <a
      href={href}
      className={[
        'group inline-flex shrink-0 items-center rounded-full',
        'bg-linear-to-b from-white to-[#eff0f2] text-black',
        'ring-1 ring-black/[0.07]',
        'shadow-[0_1px_1.5px_rgb(0_0_0/0.10),0_8px_20px_-10px_rgb(0_0_0/0.55)]',
        'transition-[box-shadow,transform] duration-300 ease-out',
        'hover:-translate-y-px hover:shadow-[0_2px_3px_rgb(0_0_0/0.12),0_16px_32px_-12px_rgb(0_0_0/0.6)]',
        // Snappier than the release so the press reads as a physical tap.
        'active:translate-y-0 active:scale-[0.985] active:duration-75',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
        scale.shell,
        className,
      ].join(' ')}
    >
      <span className={`leading-none whitespace-nowrap ${scale.label}`}>{label}</span>

      {/* Two stacked arrows in one grid cell: on hover the first exits right
          and the second takes its place from the left, so the badge reads as
          continuous forward motion instead of the arrow pivoting in place. */}
      <span
        className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-black text-white ${scale.badge}`}
        aria-hidden="true"
      >
        <ArrowRight
          className={`col-start-1 row-start-1 transition-transform duration-300 ease-out group-hover:translate-x-[210%] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 ${scale.icon}`}
          strokeWidth={2}
        />
        <ArrowRight
          className={`col-start-1 row-start-1 -translate-x-[210%] transition-transform duration-300 ease-out group-hover:translate-x-0 motion-reduce:hidden ${scale.icon}`}
          strokeWidth={2}
        />
      </span>
    </a>
  )
}

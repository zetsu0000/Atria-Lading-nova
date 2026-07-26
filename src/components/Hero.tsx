import { Instagram, Linkedin, Twitter } from 'lucide-react'
import CtaButton from './CtaButton'

const SOCIAL_LINKS = [
  { label: 'Lumenet on X', href: '#x', Icon: Twitter },
  { label: 'Lumenet on LinkedIn', href: '#linkedin', Icon: Linkedin },
  { label: 'Lumenet on Instagram', href: '#instagram', Icon: Instagram },
]

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-black px-5 pt-28 pb-8 sm:px-8 sm:pt-32 lg:px-9 lg:pb-9"
    >
      {/* Background photo. Kept on a black base so a missing/slow image degrades
          to the plain black hero rather than a broken frame. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-[position:60%_center]" />
        {/* Scrim — the photo is very light, so white type needs the base pulled
            down. Flat tint keeps the image readable everywhere; the bottom
            gradient adds the extra contrast the wordmark and copy need. */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-transparent" />
      </div>

      <div
        className={[
          'mx-auto flex w-full max-w-[1600px] flex-1 flex-col',
          'lg:grid lg:grid-cols-[minmax(0,1fr)_26.5rem] lg:grid-rows-[1fr_auto] lg:gap-x-12',
          'xl:grid-cols-[minmax(0,1fr)_28rem]',
        ].join(' ')}
      >
        {/* Tagline — upper right on desktop, first line on mobile */}
        <p className="order-1 text-[clamp(1.5rem,2.4vw,2.15rem)] leading-tight tracking-[-0.01em] text-white lg:col-start-2 lg:row-start-1 lg:self-start lg:pt-[26vh]">
          Enter the Future.
        </p>

        {/* Social icons — bottom left, sitting just above the wordmark */}
        <ul className="order-4 mt-10 flex items-center gap-5 lg:col-start-1 lg:row-start-1 lg:order-none lg:mt-0 lg:mb-10 lg:self-end">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                className="grid size-11 place-items-center rounded-full text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 lg:size-auto"
              >
                <Icon className="size-[22px]" strokeWidth={1.6} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        {/* Oversized wordmark. Sized in container-query units so it always fills
            its column edge-to-edge: "Neutrals" in Stack Sans Text at -0.035em
            tracking advances ~3.93x its font size, so 25cqw ≈ a full column. */}
        <div className="@container order-2 mt-auto pt-12 sm:pt-16 lg:col-start-1 lg:row-start-2 lg:order-none lg:mt-0 lg:pt-0 lg:self-end">
          <h1 className="-ml-[0.05em] text-[25cqw] leading-[0.82] font-normal tracking-[-0.035em] text-white">
            Neutrals
          </h1>
        </div>

        {/* Description + primary CTA — bottom right, baseline-aligned with the wordmark */}
        <div className="order-3 mt-8 flex flex-col items-start lg:col-start-2 lg:row-start-2 lg:order-none lg:mt-0 lg:self-end lg:pb-1">
          <p className="max-w-[38ch] text-[15px] leading-[1.5] text-white/90 sm:text-[17px] lg:max-w-none">
            Lumenet blends AI, system architecture, and design to build intuitive, perception-driven
            digital environments—redefining how humans interact with technology.
          </p>
          <CtaButton className="mt-7 lg:mt-9" />
        </div>
      </div>
    </section>
  )
}

import AtriaFilm from './AtriaFilm'

export type Feature = {
  title: string
  body: string
}

type FeatureSectionProps = {
  id: string
  eyebrow: string
  headline: string
  body: string
  features: Feature[]
  /** Puts the copy column first and the film second, mirroring the section above. */
  reversed?: boolean
}

export default function FeatureSection({
  id,
  eyebrow,
  headline,
  body,
  features,
  reversed = false,
}: FeatureSectionProps) {
  return (
    <section id={id} className="px-5 py-20 sm:px-8 sm:py-28 lg:px-9 lg:py-36">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        {/* Film. `order` only kicks in at lg — on phones the film always leads,
            so both sections read top-down in the same rhythm rather than one
            of them burying its visual below a wall of text. */}
        <div className={reversed ? 'lg:order-2' : 'lg:order-1'}>
          <div className="overflow-hidden rounded-[1.75rem] shadow-[0_2px_4px_rgb(8_34_61/0.08),0_30px_60px_-30px_rgb(8_34_61/0.55)] ring-1 ring-white/50 sm:rounded-[2rem]">
            <AtriaFilm className="aspect-[16/11] w-full object-cover object-center lg:aspect-[4/5]" />
          </div>
        </div>

        {/* Copy + cards */}
        <div className={reversed ? 'lg:order-1' : 'lg:order-2'}>
          <p className="text-[12px] font-medium tracking-[0.18em] text-[#08223d]/55 uppercase sm:text-[13px]">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-[clamp(1.65rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.01em] text-[#08223d] uppercase">
            {headline}
          </h2>

          <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.6] text-[#08223d]/75 sm:text-[16px]">
            {body}
          </p>

          <ul className="mt-9 flex flex-col gap-3 sm:gap-4">
            {features.map((feature, index) => (
              <li
                key={feature.title}
                className="rounded-[1.25rem] bg-white/55 p-5 ring-1 ring-white/70 shadow-[0_1px_2px_rgb(8_34_61/0.05),0_14px_30px_-20px_rgb(8_34_61/0.5)] backdrop-blur-xl sm:rounded-[1.5rem] sm:p-6"
              >
                <div className="flex items-baseline gap-3.5 sm:gap-4">
                  <span
                    aria-hidden="true"
                    className="text-[12px] tabular-nums text-[#08223d]/40 sm:text-[13px]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-[14px] tracking-[0.04em] text-[#08223d] uppercase sm:text-[15px]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.55] text-[#08223d]/70 sm:text-[15px]">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

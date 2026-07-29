import AtriaFilm from './AtriaFilm'
import CtaButton from './CtaButton'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-black px-5 pt-28 pb-8 sm:px-8 sm:pt-32 lg:px-9 lg:pb-9"
    >
      {/* Background film — an 8s glass-panel reveal that pushes into a macro
          shot, which is what gives the hero its depth. Kept on a black base so
          a slow or blocked video degrades to the plain black hero. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black">
        <AtriaFilm className="size-full object-cover object-center" />

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
        {/* Tagline — upper right on desktop, first line on mobile */}
        <p className="order-1 text-[clamp(1.2rem,1.92vw,1.72rem)] leading-tight tracking-[-0.01em] text-white [text-shadow:0_2px_16px_rgb(0_0_0/0.55)] lg:col-start-2 lg:row-start-1 lg:self-start lg:pt-[26vh]">
          Sua autoridade não deveria parecer genérica.
        </p>

        {/* Oversized wordmark. Sized in container-query units so it scales with
            its column rather than the viewport: "Atria" in Stack Sans Text at
            weight 400 and -0.035em tracking advances ~2.14x its font size, so
            44.5cqw filled the column edge-to-edge — 35.6cqw is that at -20%,
            leaving ~20% of the column as trailing space. The negative margin
            cancels the leading "A" side bearing (0.038em) so the letter still
            sits flush with the column edge. */}
        <div className="@container order-2 mt-auto pt-12 sm:pt-16 lg:col-start-1 lg:row-start-2 lg:order-none lg:mt-0 lg:pt-0 lg:self-end">
          <h1 className="-ml-[0.04em] text-[35.6cqw] leading-[0.82] font-normal tracking-[-0.035em] text-white [text-shadow:0_4px_40px_rgb(0_0_0/0.30)]">
            Atria
          </h1>
        </div>

        {/* Description + primary CTA — bottom right, baseline-aligned with the wordmark */}
        <div className="order-3 mt-8 flex flex-col items-start lg:col-start-2 lg:row-start-2 lg:order-none lg:mt-0 lg:self-end lg:pb-1">
          <p className="max-w-[38ch] text-[12px] leading-[1.5] text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.6)] sm:text-[13.6px] lg:max-w-none">
            A Atria alinha posicionamento, linguagem, conteúdo e busca para que o critério da sua
            atuação seja percebido antes mesmo da primeira conversa.
          </p>
          <CtaButton className="mt-7 lg:mt-9" />
        </div>
      </div>
    </section>
  )
}

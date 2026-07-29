import CtaButton from './CtaButton'
import { GRAIN, SEAM_GLOW } from '../lib/grain'

const FOOTER_COLUMNS = [
  {
    heading: 'Empresa',
    links: [
      { label: 'Soluções', href: '#solucoes' },
      { label: 'Sobre', href: '#sobre' },
    ],
  },
  {
    heading: 'Recursos',
    links: [
      { label: 'Documentação', href: '#contato' },
      { label: 'Casos de uso', href: '#contato' },
      { label: 'Segurança', href: '#contato' },
    ],
  },
  {
    heading: 'Contato',
    links: [
      { label: 'contato@atria.com', href: 'mailto:contato@atria.com' },
      { label: 'LinkedIn', href: '#contato' },
      { label: 'Imprensa', href: '#contato' },
    ],
  },
]

export default function Footer() {
  return (
    // Deep end of the same blue rather than more gradient: the page runs bright
    // from the hero down, and it needs something to close on.
    <footer
      id="contato"
      className="relative isolate overflow-hidden bg-[#061a30] px-5 pt-24 pb-10 sm:px-8 sm:pt-32 lg:px-9 lg:pt-40"
    >
      {/* The field above does not stop at this edge — it runs out of light over
          the first stretch of the footer. The glow is the far half of the pair
          the testimonials section anchors to its own bottom edge: same colour,
          same 26% placement, same rate, so the two evaluate identically on the
          shared pixel row and there is no line to see. The grain is the same
          noise the two sections above carry; without it the join is visible as
          a change in texture even where the colour is continuous.

          The extra top padding is part of the transition too: the light needs
          somewhere to die before the first heading, or the closing statement
          lands inside the seam. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-x-0 top-0 h-[clamp(180px,24vh,320px)]"
          style={{
            background: `radial-gradient(68% 100% at 26% 0%, ${SEAM_GLOW.bottom}, transparent 74%)`,
          }}
        />
        {/* A second, much wider fall-off under it. The mirrored glow alone ends
            where its band ends, which puts a soft but findable edge a few
            hundred pixels in; this carries the last of it down past that. */}
        <div
          className="absolute inset-x-0 top-0 h-[62%]"
          style={{
            background:
              'radial-gradient(90% 100% at 30% 0%, rgb(58 122 196 / 0.16), transparent 76%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-[42ch]">
            <h2 className="text-[clamp(1.65rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.01em] text-white uppercase">
              Vamos construir o próximo sistema
            </h2>
            <p className="mt-5 text-[15px] leading-[1.6] text-white/65 sm:text-[16px]">
              Conte o que você está tentando resolver. Respondemos em até dois dias úteis com
              uma leitura honesta do problema — inclusive quando a resposta é que ainda não é
              hora de construir.
            </p>
            <CtaButton label="Falar com a Atria" className="mt-8" />
          </div>

          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-16">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-[12px] font-medium tracking-[0.18em] text-white/45 uppercase sm:text-[13px]">
                  {column.heading}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[14px] text-white/75 transition-colors hover:text-white sm:text-[15px]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-24">
          <a href="#top" className="text-[19px] leading-none tracking-[-0.01em] text-white">
            Atria
          </a>
          <p className="text-[13px] text-white/45 sm:text-[14px]">
            © {new Date().getFullYear()} Atria. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

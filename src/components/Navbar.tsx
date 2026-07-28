import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import CtaButton from './CtaButton'

const NAV_LINKS = [
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-9 lg:pt-9">
      {/* Two reductions on top of the original: -10%, then -15%, so every
          value here is 76.5% of what it started at — width included, which is
          why the pill floats well inset from the hero content. A percentage
          width rather than only a smaller `max-w`, because a cap alone would
          bite only on very wide viewports and leave the change invisible on
          most screens. `mx-auto` centres it as it narrows. */}
      <nav
        aria-label="Principal"
        className="mx-auto w-[76.5%] max-w-[1224px] rounded-[1.53rem] bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] ring-1 ring-white/20 backdrop-blur-2xl lg:rounded-full"
      >
        <div className="flex h-[3.06rem] items-center justify-between gap-[0.765rem] pr-[0.287rem] pl-[0.956rem] sm:pl-[1.339rem] lg:h-[3.634rem] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:pl-[1.721rem]">
          {/* Desktop links (left) */}
          <ul className="hidden items-center gap-[1.339rem] lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[11.5px] text-white/85 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Wordmark (centered on desktop, leading on mobile) */}
          <a
            href="#top"
            className="text-[14.5px] leading-none tracking-[-0.01em] text-white lg:justify-self-center lg:text-[16.8px]"
          >
            Atria
          </a>

          {/* Actions (right) */}
          <div className="flex items-center justify-end gap-[0.191rem] sm:gap-[0.574rem] lg:justify-self-end">
            <div className="hidden sm:block">
              <CtaButton size="sm" />
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="grid size-[2.104rem] place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              {isMenuOpen ? <X className="size-[0.956rem]" /> : <Menu className="size-[0.956rem]" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="border-t border-white/10 px-[0.956rem] pt-[0.765rem] pb-[0.956rem] sm:px-[1.339rem] lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-[0.383rem] text-[13px] text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-[0.765rem] sm:hidden">
              <CtaButton size="sm" />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

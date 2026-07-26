import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import CtaButton from './CtaButton'

const NAV_LINKS = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Insight', href: '#insight' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-9 lg:pt-9">
      <nav
        aria-label="Main"
        className="mx-auto max-w-[1600px] rounded-[2rem] bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] ring-1 ring-white/20 backdrop-blur-2xl lg:rounded-full"
      >
        <div className="flex h-16 items-center justify-between gap-4 pr-1.5 pl-5 sm:pl-7 lg:h-[76px] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:pl-9">
          {/* Desktop links (left) */}
          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[15px] text-white/85 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Wordmark (centered on desktop, leading on mobile) */}
          <a
            href="#top"
            className="text-[19px] leading-none tracking-[-0.01em] text-white lg:justify-self-center lg:text-[22px]"
          >
            Lumenet
          </a>

          {/* Actions (right) */}
          <div className="flex items-center justify-end gap-1 sm:gap-3 lg:justify-self-end">
            <div className="hidden sm:block">
              <CtaButton />
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="border-t border-white/10 px-5 pt-4 pb-5 sm:px-7 lg:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-[17px] text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 sm:hidden">
              <CtaButton />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

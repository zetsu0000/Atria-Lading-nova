/**
 * Every way the site can start a conversation, in one place.
 *
 * These strings were previously inlined per component, which is how the site
 * ended up shipping a primary CTA pointing at `#comecar` — an anchor that
 * exists nowhere on the page — and an email on a domain the brand does not
 * own. One definition means the next channel change is one edit.
 */

/** E.164 without the `+`, which is the form wa.me expects. */
export const WHATSAPP_NUMBER = '5511975443446'

/** Display form, for the footer. */
export const WHATSAPP_DISPLAY = '+55 11 97544-3446'

export const CONTACT_EMAIL = 'contato@atria-studios.com'

export const SITE_URL = 'https://atria-studios.com'

/**
 * A wa.me link carrying the intent the visitor actually clicked.
 *
 * The prefilled line matters more here than on a form: WhatsApp drops the
 * visitor into an empty thread with no memory of which button they pressed, so
 * without it every conversation starts from zero and the CTA's promise is lost
 * between the click and the first message. Kept in the brand's register —
 * stating a subject, not asking for a quote.
 */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/** The three intents the site offers, each matched to the CTA that opens it. */
export const WHATSAPP = {
  /** "Avaliar presença" — the hero and nav primary action. */
  evaluate: whatsappUrl('Olá, Atria. Gostaria de avaliar a minha presença digital.'),
  /** "Entender o processo" — the three approach blocks. */
  process: whatsappUrl('Olá, Atria. Gostaria de entender como funciona o processo de vocês.'),
  /** The plain "Contato" links in the nav and footer. */
  general: whatsappUrl('Olá, Atria. Gostaria de conversar sobre presença digital.'),
} as const

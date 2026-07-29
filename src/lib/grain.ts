/**
 * Fractal noise, inline. The reference the page is sampled from carries visible
 * grain, and a CSS gradient without it reads as exactly what it is. ~300 bytes,
 * so a request for it would arrive after first paint — which is precisely when
 * it is missed.
 *
 * It is shared rather than declared per section on purpose: the grain is what
 * makes three differently-lit fields read as one surface. If Solutions, the
 * testimonials field and the footer each carried their own noise, the seams
 * between them would be visible as changes in texture even where the colours
 * match. It is also the page's dither — over a long ramp from near-black into
 * a saturated blue, 8-bit colour bands, and this is what hides it.
 */
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * The colour the page's dark fields meet the bright one on, and the light that
 * bleeds across both of those seams.
 *
 * A seam works when the two sides agree on colour *and* on light. Colour alone
 * leaves a visible line: the field stops being lit exactly where the section
 * ends. So each boundary is straddled by a matched pair of glows — one anchored
 * to the bottom edge of the section above, one to the top edge of the section
 * below, same colour, same alpha, same horizontal placement. At the shared
 * pixel row the two evaluate identically, so there is nothing to see.
 */
export const SEAM_GLOW = {
  /** Solutions → the bright field. The blue about to arrive, leaking upward. */
  top: 'rgb(44 133 229 / 0.10)',
  /** The bright field → the footer. The last of the field's light, dying out. */
  bottom: 'rgb(96 160 230 / 0.30)',
} as const

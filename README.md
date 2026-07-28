# Atria

A single-page marketing site. Full-bleed video hero, two feature sections, a
testimonial row, and a footer. All copy is Brazilian Portuguese
(`<html lang="pt-BR">`).

## Page structure

`src/App.tsx` composes the page and owns all feature copy:

| Section | Component | Background |
| --- | --- | --- |
| Nav | `Navbar` | Glass pill, fixed |
| Hero | `Hero` | The film, full bleed |
| Soluções | `Solutions` | Charcoal, lit by scroll |
| Operação | `FeatureSection reversed` | Blue gradient field |
| Depoimentos | `Testimonials` | ” |
| Rodapé | `Footer` | `#061a30` |

Section `id`s match the nav links (`#solucoes`, `#insight`, `#sobre`,
`#contato`), so the nav actually navigates.

## Solutions section

`src/components/Solutions.tsx`. One asymmetric editorial composition modelled
on `docs/image copy.png`, not a sequence of slides: two product-screen cards on
a diagonal, with an editorial block in each opposing quadrant.

### Heading

Modelled on `docs/image copy 2.png`: a small outlined pill over a centred serif
italic line. It is the **one** centred element in a section that is otherwise
deliberately off-axis, which is what makes the zig-zag below read as a choice.
The composition starts `clamp(84px, 6.5vw, 116px)` under it.

### Composition

| Row | Copy | Card |
| --- | --- | --- |
| 01 | Left, cols 1–5 | Right, cols 7–12 |
| 02 | Right, cols 8–12 | Left, cols 1–6 |
| 03 | Left, cols 1–5 | Right, cols 7–12 |

Twelve columns, `max-w-[1640px]`. All three cards are the same size
(`clamp(476px, 37.4vw, 663px)` at `1.45/1`), so the rhythm comes entirely from
placement — nothing is 50/50, and the empty columns between copy and card are
the composition rather than leftovers.

**The gutter is anchored, not inherited.** Every card is pinned to one
container edge (`justify-self-end` / `-start`) and every copy block to the
other, each on a 5-column track capped at 560px. Letting the column maths
decide instead produced gutters of 306 / 32 / 513px across the three rows —
the same placement, wildly different spacing, which is what read as broken.
Anchored, the gutter is identical on all three rows at every width: 306px at
1728, 245px at 1440.

DOM order is copy → card, three times over, so phones read
Texto 01 → Card 01 → Texto 02 → Card 02 → Texto 03 → Card 03 with no absolute
positioning. Grid placement alone does the diagonal at `lg`.

### Atria Cobalt v3

Tokens live in `src/index.css` under `@theme`. They did not exist before this
section; the hero, the blue gradient sections and the footer keep their own
colours, so these are scoped by use rather than applied globally.

| Token | Value | Role |
| --- | --- | --- |
| `ink` / `ink-raised` | `#07090d` / `#0b0e14` | Section ground, card fill |
| `mineral` | `#e9ecf2` | Text and hairlines |
| `cobalt` | `#2f6bff` | The one source of depth and light |
| `vermilion` | `#e8503a` | Editorial detail, one appearance |
| `acid` | `#c8f531` | Signal only |

Acid appears three times in the whole section: the live dot, `AJUSTE APLICADO`,
and the `97%` confidence figure — plus keyboard focus rings. It is never a
field. Vermilion appears once, on the dissenting-source marker.

### Cards

`SolutionCard.tsx` is a frame only: `18px`/`24px` corners, a `ring-mineral/12`
hairline, an interior top-edge light, and a cobalt reflection that tracks the
pointer. No drop shadow — a shadow would sit the card on a surface, and it
needs to float in the dark.

The card body is a full-bleed campaign film — the film *is* the card, as in
the reference, where each card is one luminous visual in a hairline frame. Two
things stood between the section and that reference, and both are gone now:

- **Fabricated dashboard interiors** (meters, chips, two-column readouts) —
  busy and dark-on-dark. `SolutionScreens.tsx` was deleted along with them.
- **Fabricated card chrome** — a top bar (`Atria` wordmark, a fake screen name,
  mock nav links, a status pill) and a bottom indicator strip
  (`Camadas 4 · Downtime 0s · Volume 10×` and the like), built to give the
  dashboard interiors somewhere to sit. Once the body became real footage,
  that chrome was just text labelling a photo for no reason — the reference
  has none of it. `SolutionCard` dropped the `screen` / `nav` / `status` /
  `indicators` props; it now takes only `children` and `className`.

| Card | File | Footage | Source |
| --- | --- | --- | --- |
| 01 Percepção | `sol-01` (945K) | Red studio, cyan light reading the face | higgsfield.ai/s/DuVqQ3QWrUQ |
| 02 Inteligência aplicada | `sol-02` (1.5M) | Coral-amber gradient, eyes closed, calm | higgsfield.ai/s/4MjNp-ubaIk |
| 03 Arquitetura | `sol-03` (1.1M) | Blue backlit profile, cyan sweep | higgsfield.ai/s/bQRkszE13M8 |

Every file is footage from those exact links, re-encoded and never
re-generated — `ffmpeg` only strips audio and drops bitrate. Card 02 was
swapped once already (a golden-grid scan first, replaced by the calmer
coral-amber piece above); the share link is the source of truth if it needs
to change again — resolve the link's UUID, then pull `rawUrl` for that id from
`show_generations`.

Masters are 1080p at ~55MB each; re-encode any replacement
(`ffmpeg -an -crf 25 -preset slow -movflags +faststart`). Posters are frame 0
as webp. Playback is gated by `SolutionMedia`: decode only within 300px of the
viewport, frame 0 under reduced motion. Verified: all three play inside the
section, pause at the top of the page, and hold at `0` under reduced motion.

The editorial blocks are three layers — serif italic title, short grey
paragraph, outline pill — with **no eyebrow label**. The uppercase eyebrows the
earlier pass added were the second thing making it read as a SaaS template
rather than the reference's editorial.

The background is near-black: three per-film halos at 0.06–0.07 alpha, each
taking its colour from the footage beside it (red, coral, blue). The cards
carry the light; the room stays dark.

Cards are opaque objects on ink: 24px corners, a 1px mineral hairline, interior
light from the top edge, and a cobalt reflection that tracks the pointer.
**No drop shadow** — a shadow would sit them on a surface, and the composition
wants them floating in the dark. The pointer reflection writes CSS custom
properties straight from the event, so it never enters React's render path.

### Motion

Opacity and 20px of `translateY` over 640ms, staggered so each card trails its
facing copy by 120ms. One `IntersectionObserver` flips `data-shown` on every
animated element once, then unobserves. No parallax and no scroll handler —
the section is a single still composition, so continuous motion would fight it.

Under `prefers-reduced-motion` everything resolves to its final state and the
pointer reflection is `display: none`.

### Verified

`tsc -b && vite build` clean.

| Viewport | Section | Cards | Gutter | Row gap | Overflow |
| --- | --- | --- | --- | --- | --- |
| 1728×1117 | 2124px | 646×446 ×3 | 306px ×3 | 121px | 0 |
| 1440×900 | 1806px | 539×371 ×3 | 245px ×3 | 101px | 0 |
| 1024×800 | 1629px | 476×328 ×3 | — | — | 0 * |
| 768×900 | one column | 688 ×3 | — | — | 0 |
| 390×844 | one column | 100% ×3 | — | — | 0 |

Cards alternate right / left / right at every width ≥1024, and DOM order reads
`TCTCTC` at all five. Heading to first card: 124px at 1728, 103px at 1440. One
navbar in the DOM. At 200% zoom (an 864×558 CSS viewport) there is no
horizontal overflow and no clipped text.

\* The 3px at 1024px comes from a footer link, not this section — see below.

> **Pre-existing, left alone:** at exactly 1024px the footer's three-column
> nav overflows by 3px on `contato@atria.com`. It is out of this section's
> scope and was not touched.

> **Tablet lost its diagonal.** Equal card sizes mean all three run full width
> between 768 and 1023px, so the staggered `md:w-[86%]` / `md:ml-auto` offsets
> that used to carry the zig-zag there are gone. Restoring it means breaking
> the equal-size rule at that breakpoint.

Final capture: `docs/solucoes-final-1728.png`.


### Type conventions

Headlines and card titles are uppercase; descriptions are sentence case. Stack
Sans Text carries titles, descriptions and all UI. Everything on the blue
gradient uses the ink `#08223d` at varying opacity rather than a separate grey
scale.

**Instrument Serif italic is the one exception** — reserved for the short pull
phrases in the solutions section (`Ver antes de responder.`). Never body copy,
never headlines. It is loaded italic-only (`ital@1`), so there is no upright
cut available by design.

### The gradient field

Sampled from `docs/image.png` — `#2c85e5` in the top-left corner falling to
`#b7defb`. It is modelled as a radial anchored at that corner, not a linear:
the reference's bottom-left (`#6bafef`) is lighter than its top-left, which is
falloff from a corner rather than a diagonal sweep.

It lives on **one wrapper** around all three middle sections, not on each
section. Per-section gradients would stamp the saturated corner three times
down the page.

The footer breaks out of it into deep ink. The page runs bright from the hero
down and needs something to close on.

### Cards

Frosted, not solid: `bg-white/55` + `backdrop-blur-xl` + `ring-1 ring-white/70`,
over a two-part shadow. Same edge logic as the CTA button below — on a blue
field a solid white card reads as a cut-out, while a frosted one reads as glass
over the gradient. This also matches the nav pill, so the whole page shares one
material.

> **Testimonials are placeholder copy.** The names, roles and companies in
> `src/components/Testimonials.tsx` are invented. Replace them with real,
> approved quotes before launch.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **lucide-react** for icons
- **Stack Sans Text** from Google Fonts (variable, weights 200–700), loaded in
  `index.html` and wired to `--font-sans` in `src/index.css`

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview
```

## Layout notes

`src/components/Hero.tsx` uses a two-column CSS grid at `lg` and above:

|           | column 1 (flexible) | column 2 (26.5rem) |
| --------- | ------------------- | ------------------ |
| **row 1** | —                   | `Entre no Futuro.` |
| **row 2** | `Atria` wordmark    | copy + CTA         |

Row 1 absorbs the free space, so the wordmark and the CTA both sit flush with
the bottom of the viewport, as in the reference.

Below `lg` the grid collapses to a single flex column ordered tagline →
wordmark → copy → CTA, with the block bottom-anchored via `mt-auto`.

### Nav bar

The floating pill in `src/components/Navbar.tsx` has taken two reductions —
-10%, then -15% — so every value is **76.5%** of its original geometry: height,
type, padding, icons, and width alike. It is `w-[76.5%] max-w-[1224px] mx-auto`.
The percentage matters: a smaller `max-w` alone would bite only above ~1512px
and leave the change invisible on most screens. `mx-auto` keeps it centred as
it narrows.

Measured: 58px tall at `lg`, 49px below; 1224px wide at 1728, 1047px at 1440,
274px at 390.

Its CTA uses `size="sm"` on `CtaButton`, scaled to match, so the button holds
its original 87.5% height-to-bar ratio rather than filling the shortened pill.
**Both scales move together** — shrinking the bar without the button leaves the
CTA nearly touching the pill's edges.

> Desktop nav links are now `11.5px` and the nav CTA label `11.5px`. That is
> below what is comfortable for sustained reading; it is what two compounding
> reductions produce. Worth revisiting if the nav starts feeling hard to hit.

### Type scale

Hero type is set at **80% of its original size**. The three values, each ×0.8:

| Element | Class |
| --- | --- |
| Tagline | `text-[clamp(1.2rem,1.92vw,1.72rem)]` |
| Wordmark | `text-[35.6cqw]` |
| Copy | `text-[12px]` / `sm:text-[13.6px]` |

The hero CTA was left at full size — it is a control, not body copy. If it now
reads as oversized next to the smaller paragraph, give it `size="sm"` (or add a
third entry to the `SIZES` map in `CtaButton.tsx` for a true -20%).

> The copy at 12px on mobile is below a comfortable reading size. It is what the
> -20% pass produces; bump it back toward 14px if it tests poorly.

### Wordmark sizing

The wordmark is sized in container-query units rather than `vw`, so it scales
with its own column instead of the viewport and can never overflow into the
copy. The number comes from measuring the string: "Atria" in Stack Sans Text at
weight 400 with `-0.035em` tracking advances ≈2.14× its font size, so
`1 / 2.14 ≈ 0.467`, trimmed to `0.445` for a ~95% column fill — that was the
original `44.5cqw`. The current `35.6cqw` is that at -20%, so the wordmark now
covers ~76% of its column and leaves the rest as trailing space.

Change the wordmark text and that number needs re-measuring — sum the glyph
`hmtx` advances at `wght=400`, subtract `0.035em` per character, then apply the
same -20%.

## Background film

The hero background is an 8s silent loop: translucent glass panels part to
reveal the subject, then the camera pushes into a macro shot of the skin. The
parting panels and the continuous push are what give the hero its sense of
depth — it reads as a moving space rather than a flat photo.

Three files in `public/`, served from the site root by Vite:

| File | Role |
| --- | --- |
| `hero-bg.webm` | VP9, ~1.0 MB — first `<source>`, taken by most browsers |
| `hero-bg.mp4` | H.264, ~2.1 MB — fallback (Safari/iOS, older engines) |
| `hero-poster.webp` | 38 KB first frame — paints before the video decodes |

The 1920×1080 master out of Higgsfield is 52 MB at 54 Mbps, which is unusable
as a hero. Re-encode any replacement before committing it:

```sh
ffmpeg -i master.mp4 -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 25 -preset slow -movflags +faststart public/hero-bg.mp4
ffmpeg -i public/hero-bg.mp4 -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
  -cpu-used 2 public/hero-bg.webm
ffmpeg -i public/hero-bg.mp4 -frames:v 1 -q:v 80 public/hero-poster.webp
```

`-an` matters: the video is muted, so shipping an audio track is dead weight.
`+faststart` moves the MP4 index to the front so playback can begin before the
file finishes downloading.

### Legibility

The film is bright end to end, so white type needs help — but **no filter is
applied to the video**. A flat `brightness` knock-down was tried first and read
as a dull, greyed-out hero; the blue and the glowing particles are the whole
point of the shot. Legibility instead comes from scrims pinned to where type
actually sits, each fading out before the middle of the frame:

- `from-black/75 via-black/20 via-22% to-transparent to-58%`, bottom-up, under
  the wordmark / copy / CTA. Stops at `45%` on `lg` — the stacked mobile layout
  runs type through more of the lower half, so it needs to reach higher.
- `h-44 from-black/45 to-transparent`, top-down, behind the nav pill only
- `from-black/25 to-transparent to-38%`, right-to-left, behind the copy column

Plus tightened `text-shadow`s on the type (small radius, high opacity — a tight
shadow lifts text off a busy background far better than a wide soft one, which
just hazes the area).

All of it sits over a black base, so a slow or blocked video degrades to the
plain black hero. `object-center` sets the crop focus, keeping the face in frame
as the viewport narrows to portrait.

> If you swap the film for a darker one, pull these opacities back down — they
> are tuned for a frame that is bright in every shot.

### Motion and playback gating

`src/components/AtriaFilm.tsx` owns the `<video>`; the hero and both feature
sections render it. Three copies of the same film on one page, so playback is
gated twice:

- **`prefers-reduced-motion: reduce`** — paused and rewound to frame 0.
  `autoplay` can't be undone declaratively, so it has to happen in an effect.
  It listens for changes, so toggling the OS setting takes effect without a
  reload.
- **Off-screen** — an `IntersectionObserver` (200px `rootMargin`, so it spins
  up just before scrolling in) pauses instances the viewer isn't looking at.
  Decoding three 1080p streams at once is real work for no benefit. The file is
  fetched once and shared, so this costs nothing extra on the network.

Verified: at the footer all three report `paused`; under reduced motion all
three sit at `currentTime === 0`.

The element is `autoPlay loop muted playsInline` — `muted` and `playsInline` are
both required for iOS to autoplay inline instead of going fullscreen.

## CTA button

One component, `src/components/CtaButton.tsx`, renders both buttons — the nav
pill (`size="sm"`) and the hero's (`size="default"`).

### Edge treatment

A flat white pill on a bright, moving film reads as a hole punched in the frame
rather than an object sitting on it — and the film goes near-white in places,
so the shape loses its boundary entirely there. Three layers fix that:

- `ring-1 ring-black/[0.07]` — a hairline that keeps the silhouette bounded
  against the palest frames
- `bg-linear-to-b from-white to-[#eff0f2]` — barely perceptible, enough to read
  as a surface catching light rather than a flat fill
- `shadow-[0_1px_1.5px_…,0_8px_20px_-10px_…]` — a tight contact shadow plus a
  wide soft one. Two shadows rather than one: the tight one seats the button,
  the wide one lifts it.

Worst case is the nav CTA on the opening frame, where the pill sits over
near-white glass. Check that frame after changing any of these.

### Interaction

- **Hover** — 1px lift and a deeper shadow.
- **Hover, badge** — two arrows stacked in one grid cell; the first exits right
  as the second enters from the left, so it reads as continuous forward motion.
  This replaced a 45° in-place rotation, which pointed the arrow down-right at
  nothing.
- **Active** — settles back down and scales to `0.985` at `duration-75`, faster
  than the release, so the press reads as a physical tap.
- **Reduced motion** — transitions and the lift are dropped, and the second
  arrow is hidden so no sliding occurs.

## Icons

The hero has no social icons — the X / LinkedIn / Instagram row was removed. The
only icons left are the CTA arrow and the mobile menu toggle, both from
`lucide-react`.

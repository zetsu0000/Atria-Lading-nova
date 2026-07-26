# Atria / Lumenet — Hero

A pure-black hero section built from the reference design: floating pill nav, an
oversized `Neutrals` wordmark anchored bottom-left, and a right-hand column
holding the tagline, description, and primary CTA.

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

|            | column 1 (flexible) | column 2 (26.5rem) |
| ---------- | ------------------- | ------------------ |
| **row 1**  | social icons        | `Enter the Future.`|
| **row 2**  | `Neutrals` wordmark | copy + CTA         |

Row 1 absorbs the free space, so the wordmark and the CTA both sit flush with
the bottom of the viewport, as in the reference.

Below `lg` the grid collapses to a single flex column ordered tagline →
wordmark → copy → CTA → icons, with the block bottom-anchored via `mt-auto`.

### Wordmark sizing

The wordmark is sized in container-query units (`text-[25cqw]`) rather than
`vw`, so it fills its own column edge-to-edge at every width instead of
overflowing into the copy. The `25` comes from measuring the string: "Neutrals"
in Stack Sans Text at `-0.035em` tracking advances ≈3.93× its font size, so
`1 / 3.93 ≈ 0.254`. Change the wordmark text and that number needs re-measuring.

## Background image

The hero expects a photo at **`public/hero-bg.jpg`**. That file is not in the
repo — drop yours there and it renders immediately (no import or config
change; Vite serves `public/` from the site root).

It sits on a black base, so if the file is missing or still loading the hero
degrades to the plain black version rather than a broken frame.

Because the reference photo is very light, white type needs the base pulled
down. `Hero.tsx` layers two scrims over the image:

- a flat `bg-black/45` tint, so the photo stays visible across the whole frame
- a bottom-up `from-black via-black/55 to-transparent` gradient, adding the
  extra contrast the wordmark and the copy column need

Lower those two values to let more of the photo through; raise them if you swap
in a brighter image. `bg-[position:60%_center]` sets the crop focus — it keeps
the subject in frame when the viewport gets narrow.

## Icons

The second reference image was not available, so the three bottom icons are
implemented as X / LinkedIn / Instagram social links from `lucide-react`,
positioned bottom-left above the wordmark on desktop and below the CTA on
mobile. Swap the `SOCIAL_LINKS` array at the top of `src/components/Hero.tsx`
to change which icons render or where they point.

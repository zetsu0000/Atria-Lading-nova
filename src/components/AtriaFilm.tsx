import { useEffect, useRef } from 'react'

type AtriaFilmProps = {
  className?: string
}

/**
 * The 8s glass-panel reveal, shared by the hero and both feature sections.
 *
 * Playback is gated two ways. `prefers-reduced-motion` holds it on frame 0 —
 * `autoplay` can't be undone declaratively, so it has to happen here. And each
 * instance only runs while it is on screen: three copies of the same film live
 * on one page, and decoding all of them at once is wasted CPU for the two the
 * viewer isn't looking at. The file itself is fetched once and shared, so this
 * costs no extra network.
 */
export default function AtriaFilm({ className = '' }: AtriaFilmProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // React sets `muted` as a DOM property, not an attribute — some iOS
    // builds only honour the attribute when deciding whether autoplay is
    // allowed, so both are forced here before any play() attempt.
    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let onScreen = true

    // iOS refuses autoplay in Low Power Mode and paints a play glyph over the
    // frame. The first touch anywhere is a user gesture, which unlocks
    // playback — retry there instead of leaving the glyph up.
    const retryOnGesture = () => {
      window.removeEventListener('touchend', retryOnGesture)
      window.removeEventListener('pointerdown', retryOnGesture)
      sync()
    }

    const sync = () => {
      if (reduceMotion.matches) {
        video.pause()
        video.currentTime = 0
        return
      }
      if (onScreen) {
        void video.play().catch(() => {
          window.addEventListener('touchend', retryOnGesture, { once: true, passive: true })
          window.addEventListener('pointerdown', retryOnGesture, { once: true, passive: true })
        })
      } else {
        video.pause()
      }
    }

    // Autoplay can also fail because not enough is buffered on a slow mobile
    // connection; try again once the first frames are decodable.
    video.addEventListener('loadeddata', sync)

    // Start a little before the section scrolls in, so it is already running by
    // the time it is actually visible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      { rootMargin: '200px' },
    )

    observer.observe(video)
    reduceMotion.addEventListener('change', sync)
    sync()

    return () => {
      observer.disconnect()
      reduceMotion.removeEventListener('change', sync)
      video.removeEventListener('loadeddata', sync)
      window.removeEventListener('touchend', retryOnGesture)
      window.removeEventListener('pointerdown', retryOnGesture)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className={className}
      poster="/hero-poster.webp"
      preload="auto"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="/hero-bg.webm" type="video/webm" />
      <source src="/hero-bg.mp4" type="video/mp4" />
    </video>
  )
}

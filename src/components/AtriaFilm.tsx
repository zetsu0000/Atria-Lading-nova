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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let onScreen = true

    const sync = () => {
      if (reduceMotion.matches) {
        video.pause()
        video.currentTime = 0
        return
      }
      if (onScreen) {
        // Rejects when autoplay is blocked; the poster stays up, which is fine.
        void video.play().catch(() => {})
      } else {
        video.pause()
      }
    }

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

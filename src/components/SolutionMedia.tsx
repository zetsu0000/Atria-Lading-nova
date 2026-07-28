import { useEffect, useRef, useState } from 'react'

export type MediaSource = {
  src: string
  type: string
}

export type SolutionMediaProps = {
  /**
   * Still frame. Doubles as the video's `poster` and as the standalone fallback
   * when no `sources` are given — which is the state today, before the
   * Higgsfield animations land.
   */
  image?: string
  /** Add these and the card upgrades itself to video; nothing else changes. */
  sources?: MediaSource[]
  alt: string
  className?: string
}

export default function SolutionMedia({
  image,
  sources,
  alt,
  className = '',
}: SolutionMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const hasVideo = Boolean(sources?.length)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let near = false

    const sync = () => {
      if (reduceMotion.matches) {
        video.pause()
        video.currentTime = 0
        return
      }
      if (near) void video.play().catch(() => {})
      else video.pause()
    }

    // Only decode while the card is near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        sync()
      },
      { rootMargin: '300px' },
    )

    observer.observe(video)
    reduceMotion.addEventListener('change', sync)
    sync()

    return () => {
      observer.disconnect()
      reduceMotion.removeEventListener('change', sync)
    }
  }, [hasVideo])

  // No media yet: the card falls back to its own chromatic wash rather than a
  // broken frame, so the composition still reads while the art is pending.
  if ((!image && !hasVideo) || failed) {
    return (
      <div
        className={`grid place-items-center bg-[radial-gradient(120%_100%_at_50%_0%,rgb(255_255_255/0.09),transparent_70%)] ${className}`}
      >
        <span className="px-6 text-center text-[11px] tracking-[0.2em] text-white/25 uppercase">
          Mídia pendente
        </span>
      </div>
    )
  }

  if (!hasVideo) {
    return (
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={className}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      className={className}
      poster={image}
      preload="metadata"
      aria-label={alt}
      loop
      muted
      playsInline
    >
      {sources?.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  )
}

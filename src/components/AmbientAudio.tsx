import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

/** Encoded at 64 kbps — it is a room tone, not a listening copy. */
const TRACK = '/atria-ambiente.mp3'

/**
 * Loud enough to be a room and quiet enough to be ignored. Anything above
 * ~0.4 starts competing with the page instead of sitting under it.
 */
const TARGET_VOLUME = 0.28

/** The track never cuts in or out — it arrives and it leaves. */
const FADE_IN_MS = 2800
const FADE_OUT_MS = 700

/**
 * Session, not local: the choice holds while the visitor is here and is not
 * carried into a visit they haven't started yet.
 */
const STORAGE_KEY = 'atria:ambiente'

function readPreference(): 'on' | 'off' | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored === 'on' || stored === 'off' ? stored : null
  } catch {
    // Private mode / blocked storage. The feature works, it just forgets.
    return null
  }
}

function writePreference(value: 'on' | 'off') {
  try {
    sessionStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* empty */
  }
}

/**
 * The page's room tone, plus the control that turns it off.
 *
 * Two things about sound on the web decide the whole shape of this component.
 * First: no browser will start audible playback before the visitor has touched
 * the page, so "plays on entry" really means "plays at the first gesture" —
 * the mount-time `play()` below is only for the rare browser that has already
 * decided this origin is trusted. Second: audio that runs for more than three
 * seconds has to be stoppable without leaving the page (WCAG 1.4.2), which is
 * what the button is — always mounted, always reachable, never hidden behind a
 * hover.
 */
export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeRef = useRef<number | null>(null)
  const [playing, setPlaying] = useState(false)

  // Whether the visitor turned it off by hand. A tab switch pauses the track
  // too, and that pause must not be remembered as a decision.
  const optedOutRef = useRef(readPreference() === 'off')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const cancelFade = () => {
      if (fadeRef.current !== null) {
        cancelAnimationFrame(fadeRef.current)
        fadeRef.current = null
      }
    }

    const fadeTo = (target: number, duration: number, onDone?: () => void) => {
      cancelFade()
      const from = audio.volume
      const start = performance.now()

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        // Ease-out: the last third of a fade is where a cut becomes audible.
        audio.volume = from + (target - from) * (1 - (1 - t) * (1 - t))
        if (t < 1) {
          fadeRef.current = requestAnimationFrame(step)
          return
        }
        fadeRef.current = null
        onDone?.()
      }

      fadeRef.current = requestAnimationFrame(step)
    }

    const start = async () => {
      if (optedOutRef.current) return false
      // Already running: report success so the gesture listeners stand down.
      if (!audio.paused) return true
      audio.volume = 0
      try {
        await audio.play()
      } catch {
        // Autoplay refused. Nothing to clean up — the gesture listeners below
        // are still armed and will try again.
        return false
      }
      fadeTo(TARGET_VOLUME, FADE_IN_MS)
      setPlaying(true)
      return true
    }

    // A gesture is what unlocks audio, and only some events count as one:
    // scrolling and mousemove do not, pointer/touch/key do. `once` is not
    // enough here — the first gesture may still be refused on a browser that
    // wants a more explicit one — so each listener removes the whole set only
    // after playback actually began.
    const GESTURES = ['pointerdown', 'touchstart', 'keydown'] as const

    const onGesture = () => {
      void start().then((began) => {
        if (began || optedOutRef.current) release()
      })
    }

    const release = () => {
      GESTURES.forEach((type) => window.removeEventListener(type, onGesture))
    }

    // Held back until the tab is visible: a page opened in a background tab
    // should not be playing to nobody, and Safari would refuse it anyway.
    const onVisibility = () => {
      if (document.hidden) {
        if (!audio.paused) {
          cancelFade()
          audio.pause()
          setPlaying(false)
        }
        return
      }
      if (!optedOutRef.current && audio.paused) void start()
    }

    if (!optedOutRef.current) {
      GESTURES.forEach((type) => window.addEventListener(type, onGesture, { passive: true }))
      // The one case where this succeeds unprompted: a browser that already
      // trusts the origin. Everywhere else it rejects and costs nothing.
      void start()
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      release()
      document.removeEventListener('visibilitychange', onVisibility)
      cancelFade()
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current)
      fadeRef.current = null
    }

    if (playing) {
      optedOutRef.current = true
      writePreference('off')
      setPlaying(false)

      const from = audio.volume
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / FADE_OUT_MS)
        audio.volume = from * (1 - t)
        if (t < 1) {
          fadeRef.current = requestAnimationFrame(step)
          return
        }
        fadeRef.current = null
        audio.pause()
      }
      fadeRef.current = requestAnimationFrame(step)
      return
    }

    // This click is itself the gesture, so playback is allowed here even if
    // every earlier attempt was refused.
    optedOutRef.current = false
    writePreference('on')
    audio.volume = 0
    void audio
      .play()
      .then(() => {
        setPlaying(true)
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / FADE_IN_MS)
          audio.volume = TARGET_VOLUME * (1 - (1 - t) * (1 - t))
          if (t < 1) fadeRef.current = requestAnimationFrame(step)
          else fadeRef.current = null
        }
        fadeRef.current = requestAnimationFrame(step)
      })
      .catch(() => setPlaying(false))
  }

  return (
    <>
      {/* `preload="none"`: 3.8 MB is not something to spend on a visitor who
          may never turn the sound on. The file is fetched at the first gesture,
          long after the hero film and the fonts have settled. */}
      <audio ref={audioRef} src={TRACK} loop preload="none" aria-hidden="true" />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Desligar a música de fundo' : 'Ligar a música de fundo'}
        title={playing ? 'Som ligado' : 'Som desligado'}
        className={[
          // Bottom left, opposite the scroll and clear of the nav pill. Fixed
          // rather than per-section: it has to be reachable from anywhere on
          // the page, over ink, over the blue field and over the paper footer,
          // which is why it carries its own dark ground.
          'group/som fixed bottom-5 left-5 z-40 sm:bottom-8 sm:left-8',
          'inline-flex size-11 items-center justify-center rounded-full',
          'bg-black/35 text-white/85 ring-1 ring-white/25 ring-inset backdrop-blur-md',
          'transition-[color,box-shadow,transform,background-color] duration-300 ease-out',
          'hover:bg-black/45 hover:text-white hover:ring-cobalt/70',
          'focus-visible:ring-2 focus-visible:ring-acid focus-visible:outline-none',
          'active:scale-[0.96] active:duration-75',
          'motion-reduce:transition-none motion-reduce:active:scale-100',
        ].join(' ')}
      >
        {playing ? (
          <Volume2 aria-hidden="true" className="size-[1.05rem]" />
        ) : (
          <VolumeX aria-hidden="true" className="size-[1.05rem]" />
        )}
      </button>
    </>
  )
}

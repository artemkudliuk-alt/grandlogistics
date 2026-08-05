/**
 * Проигрывает видео в обратную сторону (от конца к началу) через покадровый seek.
 * Отрицательный playbackRate браузеры не поддерживают, поэтому шагаем currentTime
 * назад на каждом кадре rAF — стандартная техника для reverse-переходов.
 * Возвращает функцию отмены.
 */
export function playTransitReverse(videoEl: HTMLVideoElement, onDone: () => void): () => void {
  let rafId: number | null = null
  let cancelled = false

  const start = () => {
    if (cancelled) return
    videoEl.pause()
    videoEl.currentTime = Math.max(0, videoEl.duration - 0.04)
    let last = performance.now()
    const step = (now: number) => {
      if (cancelled) return
      const dt = (now - last) / 1000
      last = now
      const t = videoEl.currentTime - dt
      if (t <= 0.04) {
        videoEl.currentTime = 0
        onDone()
        return
      }
      videoEl.currentTime = t
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
  }

  if (videoEl.readyState >= 1 && videoEl.duration > 0) {
    start()
  } else {
    videoEl.addEventListener('loadedmetadata', start, { once: true })
  }

  return () => {
    cancelled = true
    if (rafId !== null) cancelAnimationFrame(rafId)
  }
}

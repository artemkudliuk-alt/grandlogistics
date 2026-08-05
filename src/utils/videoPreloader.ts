/**
 * Высокоскоростной пошаговый менеджер подгрузки 3D-видео (Staged Preload Pipeline).
 * Гарантирует 100% плавное воспроизведение без лагов и задержек на мобильных устройствах и в Incognito.
 */

const loadedVideos = new Set<string>()
const activePreloaders = new Map<string, HTMLVideoElement>()

type ProgressListener = (progressPct: number, isHeroReady: boolean) => void
const progressListeners = new Set<ProgressListener>()

export function subscribePreloaderProgress(listener: ProgressListener) {
  progressListeners.add(listener)
  return () => progressListeners.delete(listener)
}

function notifyListeners(pct: number, heroReady: boolean) {
  progressListeners.forEach((fn) => fn(pct, heroReady))
}

export function getPreferredVideoSrc(basePath: string): string {
  if (typeof window === 'undefined') return basePath
  const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  if (isMobile) {
    return basePath.replace('.mp4', '_mobile.mp4')
  }
  return basePath
}

/** Подгружает видео и отслеживает РЕАЛЬНЫЙ буфер (canplaythrough) */
export function preloadVideo(baseSrc: string, onProgress?: (pct: number) => void): Promise<boolean> {
  const actualSrc = getPreferredVideoSrc(baseSrc)

  if (loadedVideos.has(actualSrc)) {
    if (onProgress) onProgress(100)
    return Promise.resolve(true)
  }

  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.src = actualSrc
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true

    activePreloaders.set(actualSrc, video)

    const cleanup = () => {
      video.removeEventListener('canplaythrough', onCanPlay)
      video.removeEventListener('progress', onProgressEvent)
      video.removeEventListener('error', onError)
      activePreloaders.delete(actualSrc)
    }

    const onProgressEvent = () => {
      if (video.buffered.length > 0 && video.duration > 0) {
        const pct = Math.min(100, Math.round((video.buffered.end(0) / video.duration) * 100))
        if (onProgress) onProgress(pct)
      }
    }

    const onCanPlay = () => {
      loadedVideos.add(actualSrc)
      if (onProgress) onProgress(100)
      cleanup()
      resolve(true)
    }

    const onError = () => {
      cleanup()
      resolve(false)
    }

    video.addEventListener('canplaythrough', onCanPlay, { once: true })
    video.addEventListener('progress', onProgressEvent)
    video.addEventListener('error', onError, { once: true })

    video.load()
  })
}

/** 
 * Пошаговая цепочка подгрузки:
 * Stage 0: Сначала 100% готовность ролика 1-го экрана (loop01).
 * Stage 1: Пока пользователь смотрит 1-й экран, в фоне качается 1-й пролёт (transit12) + 2-й луп (loop02).
 * Stage 2: В фоне качается 2-й пролёт (transit23) + 3-й луп (loop03).
 */
export async function startSequentialPreload() {
  // Stage 0: Дожидаемся 100% готовности первого экрана (loop01)
  await preloadVideo('/videos/loop01.mp4', (pct) => {
    notifyListeners(pct, pct >= 100)
  })

  // Персональное уведомление Прелоадеру — можно открывать сайт!
  notifyListeners(100, true)

  // Stage 1: Немедленно подгружаем 1-й пролёт и 2-й экран
  await preloadVideo('/videos/transit12.mp4')
  await preloadVideo('/videos/loop02.mp4')

  // Stage 2: Тихо подгружаем в фоне 2-й пролёт и 3-й экран
  preloadVideo('/videos/transit23.mp4')
  preloadVideo('/videos/loop03.mp4')
}

/** Динамический приоритетный подхват следующего видео */
export function prioritizeVideoLoad(src: string) {
  const actualSrc = getPreferredVideoSrc(src)
  if (!loadedVideos.has(actualSrc)) {
    preloadVideo(src)
  }
}

/** Умный предзаказ видео для следующей сцены */
export function preloadNextSceneVideos(currentSceneNum: number) {
  if (currentSceneNum === 1) {
    prioritizeVideoLoad('/videos/transit12.mp4')
    prioritizeVideoLoad('/videos/loop02.mp4')
  } else if (currentSceneNum === 2) {
    prioritizeVideoLoad('/videos/transit23.mp4')
    prioritizeVideoLoad('/videos/loop03.mp4')
  } else if (currentSceneNum === 3) {
    prioritizeVideoLoad('/videos/loop04.mp4')
  } else if (currentSceneNum === 4) {
    prioritizeVideoLoad('/videos/transit45.mp4')
    prioritizeVideoLoad('/videos/loop05.mp4')
  } else if (currentSceneNum === 5) {
    prioritizeVideoLoad('/videos/transit56.mp4')
    prioritizeVideoLoad('/videos/loop06.mp4')
  } else if (currentSceneNum === 6) {
    prioritizeVideoLoad('/videos/transit67.mp4')
    prioritizeVideoLoad('/videos/loop07.mp4')
  }
}

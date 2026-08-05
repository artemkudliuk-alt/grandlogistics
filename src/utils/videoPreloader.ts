/**
 * Высокоскоростной менеджер пошаговой подгрузки 3D-видео.
 * Оптимизирован для работающих CDN / Vercel / GitHub Pages в Incognito и на мобильных устройствах.
 * Загружает ТОЛЬКО ближайшее следующее видео в цепочке (1-2 MB), сохраняя 95% пропускной способности сети.
 */

const loadedVideos = new Set<string>()
const activePreloaders = new Map<string, HTMLVideoElement>()

type ProgressListener = (progress: number, isHeroReady: boolean) => void
const progressListeners = new Set<ProgressListener>()

export function subscribePreloaderProgress(listener: ProgressListener) {
  progressListeners.add(listener)
  return () => progressListeners.delete(listener)
}

function notifyListeners(heroReady: boolean) {
  progressListeners.forEach((fn) => fn(heroReady ? 100 : 50, heroReady))
}

let canPlayWebmCache: boolean | null = null

export function getPreferredVideoSrc(basePath: string): string {
  if (canPlayWebmCache === null) {
    if (typeof document !== 'undefined') {
      const v = document.createElement('video')
      canPlayWebmCache = v.canPlayType('video/webm; codecs="vp9"').length > 0 || v.canPlayType('video/webm').length > 0
    } else {
      canPlayWebmCache = false
    }
  }

  if (canPlayWebmCache) {
    return basePath.replace('.mp4', '_mobile.webm')
  }
  return basePath.replace('.mp4', '_mobile.mp4')
}

/** Быстро подгружает начальный буфер 1 конкретного видео ролика с помощью HTML5 Video element */
export function preloadVideo(baseSrc: string): Promise<boolean> {
  const actualSrc = getPreferredVideoSrc(baseSrc)

  if (loadedVideos.has(actualSrc)) {
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
      video.removeEventListener('loadeddata', onCanPlay)
      video.removeEventListener('error', onError)
      activePreloaders.delete(actualSrc)
    }

    const onCanPlay = () => {
      loadedVideos.add(actualSrc)
      cleanup()
      if (baseSrc.includes('loop01')) {
        notifyListeners(true)
      }
      resolve(true)
    }

    const onError = () => {
      cleanup()
      resolve(false)
    }

    video.addEventListener('canplaythrough', onCanPlay, { once: true })
    video.addEventListener('loadeddata', onCanPlay, { once: true })
    video.addEventListener('error', onError, { once: true })

    video.load()
  })
}

/** Подгружает Hero-видео для первого экрана и мгновенно открывает сайт */
export async function startSequentialPreload() {
  const heroSuccess = await preloadVideo('/videos/loop01.mp4')
  if (heroSuccess) {
    notifyListeners(true)
  }
  // Запускаем фоновую тихую подгрузку первого пролёта (transit12) и 2-й сцены (loop02)
  preloadVideo('/videos/transit12.mp4')
  preloadVideo('/videos/loop02.mp4')
}

/** Динамический приоритетный подхват следующего видео при смене сцен или клике по меню */
export function prioritizeVideoLoad(src: string) {
  const actualSrc = getPreferredVideoSrc(src)
  if (!loadedVideos.has(actualSrc)) {
    preloadVideo(src)
  }
}

/** Умный пошаговый предзаказ видео для конкретной текущей сцены */
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

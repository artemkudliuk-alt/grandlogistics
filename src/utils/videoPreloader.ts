/**
 * Менеджер последовательной приоритетной подгрузки 3D-видео в буфер.
 * Гарантирует мгновенный запуск первого экрана и плановую фоновую подгрузку всех остальных видео.
 */

const VIDEO_QUEUE: string[] = [
  '/videos/loop01.mp4',    // Приоритет 1: Hero видео (Главный экран)
  '/videos/transit12.mp4', // Приоритет 2: Пролёт 1->2
  '/videos/loop02.mp4',    // Приоритет 2: Сцена 2
  '/videos/transit23.mp4', // Приоритет 3: Пролёт 2->3
  '/videos/loop03.mp4',    // Приоритет 3: Сцена 3
  '/videos/loop04.mp4',    // Приоритет 4: 3D Сцена 4
  '/videos/transit45.mp4', // Приоритет 4: Пролёт 4->5
  '/videos/loop05.mp4',    // Приоритет 4: 3D Сцена 5
  '/videos/transit56.mp4', // Приоритет 4: Пролёт 5->6
  '/videos/loop06.mp4',    // Приоритет 4: 3D Сцена 6
  '/videos/transit67.mp4', // Приоритет 4: Пролёт 6->7
  '/videos/loop07.mp4',    // Приоритет 4: 3D Сцена 7
]

// Карта предзагруженных видеофайлов
const loadedVideos = new Set<string>()
const activePreloaders = new Map<string, HTMLVideoElement>()
let isQueueRunning = false

type ProgressListener = (progress: number, isHeroReady: boolean) => void
const progressListeners = new Set<ProgressListener>()

export function subscribePreloaderProgress(listener: ProgressListener) {
  progressListeners.add(listener)
  return () => progressListeners.delete(listener)
}

function notifyListeners(heroReady: boolean) {
  const loadedCount = loadedVideos.size
  const percent = heroReady ? 100 : Math.min(95, Math.round((loadedCount / 1) * 90))
  progressListeners.forEach((fn) => fn(percent, heroReady))
}

/** Подгружает одно конкретное видео с высоким приоритетом */
export async function preloadVideo(src: string): Promise<boolean> {
  if (loadedVideos.has(src)) {
    return true
  }

  // 1. Попытка быстрой подгрузки в HTTP-кэш (идеально для Incognito Mode)
  try {
    const response = await fetch(src, { cache: 'force-cache' })
    if (response.ok) {
      loadedVideos.add(src)
      if (src === VIDEO_QUEUE[0]) {
        notifyListeners(true)
      }
      return true
    }
  } catch {
    // В случае CORS или фолбэка используем HTMLVideoElement
  }

  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.src = src
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true

    activePreloaders.set(src, video)

    const cleanup = () => {
      video.removeEventListener('canplaythrough', onCanPlay)
      video.removeEventListener('loadeddata', onCanPlay)
      video.removeEventListener('error', onError)
      video.removeAttribute('src')
      video.load()
      activePreloaders.delete(src)
    }

    const onCanPlay = () => {
      loadedVideos.add(src)
      cleanup()
      if (src === VIDEO_QUEUE[0]) {
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

/** Запускает последовательную фоновую подгрузку всех остальных видео по очереди */
export async function startSequentialPreload() {
  if (isQueueRunning) return
  isQueueRunning = true

  // 1. Сначала приоритетно подгружаем Hero-видео
  const heroSuccess = await preloadVideo(VIDEO_QUEUE[0])
  if (heroSuccess) {
    notifyListeners(true)
  }

  // 2. Последовательно по одному ролику подгружаем остальные в фоновом режиме
  for (let i = 1; i < VIDEO_QUEUE.length; i++) {
    const url = VIDEO_QUEUE[i]
    if (!loadedVideos.has(url)) {
      await preloadVideo(url)
      notifyListeners(true)
    }
  }
}

/** Динамический приоритетный подхват видео при клике пользователя на навигацию */
export function prioritizeVideoLoad(src: string) {
  if (!loadedVideos.has(src)) {
    preloadVideo(src)
  }
}

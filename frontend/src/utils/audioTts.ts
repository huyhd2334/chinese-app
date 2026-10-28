/**
 * High-Clarity Loud Audio & TTS Engine for Chinese App
 * Optimized for Mobile (iOS Safari, Android) & Desktop Browsers
 * 
 * Solutions:
 * 1. Mobile & iOS Safari Autoplay & User Gesture compatibility.
 * 2. Automatic AudioContext & SpeechSynthesis unlocking on first touch/click.
 * 3. Workaround for Safari WebKit `createMediaElementSource` muting bug (plays direct native audio on Safari).
 * 4. Priority selection of the loudest Neural/Studio voices (Microsoft Xiaoxiao, Google, Apple Ting-Ting).
 * 5. Explicit volume = 1.0 (maximum) on all platforms.
 */

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Detect iOS, iPadOS or Safari
 */
export function isSafariOrIos(): boolean {
  if (!isBrowser()) return false
  const ua = navigator.userAgent
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
  return isIos || isSafari
}

let currentAudio: HTMLAudioElement | null = null
let audioContext: AudioContext | null = null
let gainNode: GainNode | null = null
let isUnlocked = false

/**
 * Automatic Audio & Speech Unlocker for iOS Safari & Mobile Browsers
 * Must be triggered by a user touch/click gesture.
 */
export function unlockAudioForMobile(): void {
  if (isUnlocked || !isBrowser()) return
  isUnlocked = true

  // 1. Unlock SpeechSynthesis
  if ('speechSynthesis' in window) {
    try {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0.01
      window.speechSynthesis.speak(u)
    } catch {}
  }

  // 2. Unlock AudioContext if present
  try {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {})
    }
  } catch {}

  // 3. Unlock HTMLAudioElement with silent 1-byte wav
  try {
    const silent = new Audio(
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
    )
    silent.setAttribute('playsinline', 'true')
    silent.setAttribute('webkit-playsinline', 'true')
    silent.play().then(() => silent.pause()).catch(() => {})
  } catch {}
}

// Attach unlock listeners on browser load
if (isBrowser()) {
  const handleFirstInteraction = () => {
    unlockAudioForMobile()
    window.removeEventListener('touchstart', handleFirstInteraction)
    window.removeEventListener('touchend', handleFirstInteraction)
    window.removeEventListener('pointerdown', handleFirstInteraction)
    window.removeEventListener('click', handleFirstInteraction)
  }

  window.addEventListener('touchstart', handleFirstInteraction, { passive: true })
  window.addEventListener('touchend', handleFirstInteraction, { passive: true })
  window.addEventListener('pointerdown', handleFirstInteraction, { passive: true })
  window.addEventListener('click', handleFirstInteraction, { passive: true })
}

/**
 * Initialize Web Audio API Gain Node for desktop Chrome/Firefox
 * (Skipped on Safari/iOS to avoid WebKit muting bugs)
 */
function getAmplifiedAudioNode(): { ctx: AudioContext; gain: GainNode } | null {
  if (!isBrowser() || isSafariOrIos()) return null
  try {
    if (!audioContext) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        audioContext = new AudioCtxClass()
        gainNode = audioContext.createGain()
        gainNode.gain.value = 1.6

        const compressor = audioContext.createDynamicsCompressor()
        compressor.threshold.setValueAtTime(-18, audioContext.currentTime)
        compressor.knee.setValueAtTime(20, audioContext.currentTime)
        compressor.ratio.setValueAtTime(8, audioContext.currentTime)
        compressor.attack.setValueAtTime(0.003, audioContext.currentTime)
        compressor.release.setValueAtTime(0.15, audioContext.currentTime)

        gainNode.connect(compressor)
        compressor.connect(audioContext.destination)
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {})
    }
    if (audioContext && gainNode) {
      return { ctx: audioContext, gain: gainNode }
    }
  } catch (e) {
    console.warn('Web Audio amplification skipped:', e)
  }
  return null
}

/**
 * Stop any ongoing TTS speech or audio element
 */
export function stopAllAudio(): void {
  if (!isBrowser()) return
  try {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      currentAudio = null
    }
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel()
      }
    }
  } catch (e) {
    console.warn('Error stopping audio:', e)
  }
}

/**
 * Find the loudest, highest-quality Chinese voice available
 */
let cachedVoice: SpeechSynthesisVoice | null = null

export function getBestChineseVoice(): SpeechSynthesisVoice | null {
  if (!isBrowser() || !('speechSynthesis' in window)) return null

  const voices = window.speechSynthesis.getVoices()
  if (!voices || voices.length === 0) return cachedVoice

  // Priority 1: Apple Ting-Ting / Sin-ji (iOS / macOS native hardware voice)
  const appleZh = voices.find(
    (v) =>
      (v.name.includes('Tingting') ||
        v.name.includes('Ting-Ting') ||
        v.name.includes('Sin-ji') ||
        v.name.includes('Mei-Jia')) &&
      (v.lang.startsWith('zh') || v.lang.startsWith('cmn'))
  )
  if (appleZh && isSafariOrIos()) {
    cachedVoice = appleZh
    return appleZh
  }

  // Priority 2: Microsoft Xiaoxiao (Online/Natural) - standard loudest Beijing Mandarin
  const xiaoxiao = voices.find(
    (v) =>
      (v.name.includes('Xiaoxiao') || v.name.includes('晓晓')) &&
      (v.lang.startsWith('zh') || v.lang.startsWith('cmn'))
  )
  if (xiaoxiao) {
    cachedVoice = xiaoxiao
    return xiaoxiao
  }

  // Priority 3: Google 普通话 (中国大陆)
  const googleZh = voices.find(
    (v) =>
      v.name.includes('Google') &&
      (v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.startsWith('zh'))
  )
  if (googleZh) {
    cachedVoice = googleZh
    return googleZh
  }

  // Priority 4: Any Natural / Online / Neural Chinese voice
  const naturalZh = voices.find(
    (v) =>
      (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Neural')) &&
      v.lang.startsWith('zh')
  )
  if (naturalZh) {
    cachedVoice = naturalZh
    return naturalZh
  }

  // Fallback to Ting-Ting on other platforms if available
  if (appleZh) {
    cachedVoice = appleZh
    return appleZh
  }

  // Priority 5: Any standard Mainland Chinese voice
  const zhCn = voices.find((v) => v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang === 'cmn-Hans-CN')
  if (zhCn) {
    cachedVoice = zhCn
    return zhCn
  }

  // Priority 6: Any Chinese voice
  const anyZh = voices.find((v) => v.lang.startsWith('zh') || v.lang.startsWith('cmn'))
  if (anyZh) {
    cachedVoice = anyZh
    return anyZh
  }

  return null
}

// Pre-load voices on browser load
if (isBrowser() && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = () => {
      getBestChineseVoice()
    }
  }
}

/**
 * Fallback to SpeechSynthesis with maximum volume and best voice
 * Specially guarded against Safari's cancel-immediate-speak silence bug
 */
function playViaSpeechSynthesis(
  text: string,
  options?: {
    rate?: number
    volume?: number
    lang?: 'zh' | 'en'
    onEnd?: () => void
    onError?: () => void
  }
): void {
  if (!isBrowser() || !('speechSynthesis' in window)) {
    options?.onError?.()
    return
  }

  const isEn = options?.lang === 'en'
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = isEn ? 'en-US' : 'zh-CN'
  utterance.volume = options?.volume !== undefined ? options.volume : 1.0
  utterance.rate = options?.rate !== undefined ? options.rate : 0.88
  utterance.pitch = 1.0

  if (!isEn) {
    const voice = getBestChineseVoice()
    if (voice) {
      utterance.voice = voice
    }
  }

  if (options?.onEnd) {
    utterance.onend = () => options.onEnd?.()
  }
  if (options?.onError) {
    utterance.onerror = () => options.onError?.()
  }

  // On Safari, if speech was speaking, cancel and delay 30ms so Safari queue resets cleanly
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance)
      } catch {
        options?.onError?.()
      }
    }, 40)
  } else {
    try {
      window.speechSynthesis.speak(utterance)
    } catch {
      options?.onError?.()
    }
  }
}

/**
 * Main Audio playback function:
 * Plays Chinese/English text with high clarity, loud volume, and full Safari touch support.
 */
export function playChineseAudio(
  text: string,
  options?: {
    rate?: number
    volume?: number
    lang?: 'zh' | 'en'
    onEnd?: () => void
    onError?: () => void
  }
): void {
  if (!text || !text.trim()) return
  const cleanText = text.trim()
  const lang = options?.lang || 'zh'

  unlockAudioForMobile()
  stopAllAudio()

  // For long reading passages (paragraphs > 80 chars), use SpeechSynthesis
  if (cleanText.length > 80) {
    playViaSpeechSynthesis(cleanText, options)
    return
  }

  // For words, idioms, short phrases & sentences: Use HD Studio Audio
  try {
    const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${lang}`
    const audio = new Audio(audioUrl)
    audio.volume = 1.0
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')
    currentAudio = audio

    // Only apply Web Audio amplification on non-Safari desktop browsers
    if (!isSafariOrIos()) {
      try {
        const amp = getAmplifiedAudioNode()
        if (amp) {
          const source = amp.ctx.createMediaElementSource(audio)
          source.connect(amp.gain)
        }
      } catch {}
    }

    let hasFallbackTriggered = false
    const fallbackToSpeech = () => {
      if (hasFallbackTriggered) return
      hasFallbackTriggered = true
      playViaSpeechSynthesis(cleanText, options)
    }

    // Safety fallback timeout
    const timeout = setTimeout(() => {
      if (audio.paused && audio.currentTime === 0) {
        fallbackToSpeech()
      }
    }, 1800)

    audio.onended = () => {
      clearTimeout(timeout)
      currentAudio = null
      options?.onEnd?.()
    }

    audio.onerror = () => {
      clearTimeout(timeout)
      fallbackToSpeech()
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        clearTimeout(timeout)
        fallbackToSpeech()
      })
    }
  } catch {
    playViaSpeechSynthesis(cleanText, options)
  }
}

/**
 * Universal click/touch helper for buttons
 */
export function playAudio(text: string, e?: React.MouseEvent | React.TouchEvent | Event): void {
  if (e && typeof (e as React.MouseEvent).stopPropagation === 'function') {
    (e as React.MouseEvent).stopPropagation()
  }
  playChineseAudio(text)
}

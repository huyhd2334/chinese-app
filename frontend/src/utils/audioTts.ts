/**
 * High-Clarity Loud Audio & TTS Engine for Chinese App
 * 
 * Solves:
 * 1. Low volume in browsers by prioritizing loud Neural/Online studio voices.
 * 2. Explicitly sets volume = 1.0 (maximum) and pitch/rate for maximum intelligibility.
 * 3. Uses HD Studio pronunciation via `/api/tts` for short words and phrases (with fallback to SpeechSynthesis).
 * 4. Web Audio API volume amplification (up to 1.8x gain) where supported.
 */

let currentAudio: HTMLAudioElement | null = null
let audioContext: AudioContext | null = null
let gainNode: GainNode | null = null

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Initialize Web Audio API Gain Node for volume amplification
 */
function getAmplifiedAudioNode(): { ctx: AudioContext; gain: GainNode } | null {
  if (!isBrowser()) return null
  try {
    if (!audioContext) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        audioContext = new AudioCtxClass()
        gainNode = audioContext.createGain()
        // Boost volume by 1.6x (approx +4.5dB) without clipping
        gainNode.gain.value = 1.6

        // Add dynamics compressor to prevent audio distortion at high gain
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
    console.warn('Web Audio amplification unavailable, using standard playback:', e)
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
      window.speechSynthesis.cancel()
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

  // Priority 1: Microsoft Xiaoxiao (Online/Natural) - standard loudest Beijing Mandarin
  const xiaoxiao = voices.find(
    (v) => (v.name.includes('Xiaoxiao') || v.name.includes('晓晓')) && (v.lang.startsWith('zh') || v.lang.startsWith('cmn'))
  )
  if (xiaoxiao) {
    cachedVoice = xiaoxiao
    return xiaoxiao
  }

  // Priority 2: Google 普通话 (中国大陆)
  const googleZh = voices.find(
    (v) => v.name.includes('Google') && (v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.startsWith('zh'))
  )
  if (googleZh) {
    cachedVoice = googleZh
    return googleZh
  }

  // Priority 3: Any Natural / Online / Neural Chinese voice (Chrome & Edge)
  const naturalZh = voices.find(
    (v) => (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Neural')) && v.lang.startsWith('zh')
  )
  if (naturalZh) {
    cachedVoice = naturalZh
    return naturalZh
  }

  // Priority 4: Apple Ting-Ting / Sin-ji (iOS / macOS Enhanced)
  const appleZh = voices.find(
    (v) => (v.name.includes('Tingting') || v.name.includes('Ting-Ting') || v.name.includes('Sin-ji')) && v.lang.startsWith('zh')
  )
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
 */
function playViaSpeechSynthesis(
  text: string,
  options?: { rate?: number; volume?: number; lang?: 'zh' | 'en'; onEnd?: () => void; onError?: () => void }
): void {
  if (!isBrowser() || !('speechSynthesis' in window)) {
    options?.onError?.()
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  const isEn = options?.lang === 'en'
  utterance.lang = isEn ? 'en-US' : 'zh-CN'
  // Explicitly maximize volume
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

  window.speechSynthesis.speak(utterance)
}

/**
 * Main Audio playback function:
 * Plays Chinese/English text with high clarity, crisp diction, and amplified volume.
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

  stopAllAudio()

  // For long reading passages (paragraphs > 80 chars), use SpeechSynthesis
  if (cleanText.length > 80) {
    playViaSpeechSynthesis(cleanText, options)
    return
  }

  // For words, idioms, short phrases & sentences, use HD Studio Audio via /api/tts
  try {
    const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${lang}`
    const audio = new Audio(audioUrl)
    audio.volume = 1.0
    currentAudio = audio

    // Attempt Web Audio API amplification if same-origin
    try {
      const amp = getAmplifiedAudioNode()
      if (amp) {
        const source = amp.ctx.createMediaElementSource(audio)
        source.connect(amp.gain)
      }
    } catch {
      // If already connected or CORS, fallback gracefully to standard audio.volume = 1.0
    }

    let hasFallbackTriggered = false
    const fallbackToSpeech = () => {
      if (hasFallbackTriggered) return
      hasFallbackTriggered = true
      playViaSpeechSynthesis(cleanText, options)
    }

    // If audio doesn't start or fails within 1.5 seconds, fallback immediately
    const timeout = setTimeout(() => {
      if (audio.paused && audio.currentTime === 0) {
        fallbackToSpeech()
      }
    }, 1500)

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
 * Universal click helper for buttons
 */
export function playAudio(text: string, e?: React.MouseEvent | Event): void {
  if (e && typeof (e as React.MouseEvent).stopPropagation === 'function') {
    (e as React.MouseEvent).stopPropagation()
  }
  playChineseAudio(text)
}

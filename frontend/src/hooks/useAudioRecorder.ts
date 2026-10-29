"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export interface AudioRecorderState {
  isRecording: boolean
  recordingTime: number
  audioUrl: string | null
  audioBlob: Blob | null
  error: string | null
  startRecording: () => Promise<boolean>
  stopRecording: () => void
  resetRecording: () => void
}

export function useAudioRecorder(): AudioRecorderState {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clear object URL on change or unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [audioUrl])

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setAudioBlob(null)
    setRecordingTime(0)
    setError(null)
    audioChunksRef.current = []
  }, [audioUrl])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsRecording(false)
  }, [])

  const startRecording = useCallback(async (): Promise<boolean> => {
    resetRecording()
    setError(null)

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Trình duyệt không hỗ trợ ghi âm trực tiếp.")
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      // Pick best supported mimeType
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "",
      ]
      const supportedType = mimeTypes.find(
        (type) => !type || (typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(type))
      )

      const options = supportedType ? { mimeType: supportedType } : undefined
      const recorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const mime = supportedType || "audio/webm"
          const blob = new Blob(audioChunksRef.current, { type: mime })
          setAudioBlob(blob)
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
        }
      }

      recorder.start(100) // chunk every 100ms
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      return true
    } catch (err: unknown) {
      const msg = (err as Error)?.message || ""
      if (msg.includes("Permission") || msg.includes("NotAllowedError") || msg.includes("denied")) {
        setError("Vui lòng cấp quyền Microphone trên trình duyệt để ghi âm giọng của bạn.")
      } else {
        setError("Không thể khởi động micro: " + msg)
      }
      setIsRecording(false)
      return false
    }
  }, [resetRecording])

  return {
    isRecording,
    recordingTime,
    audioUrl,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  }
}

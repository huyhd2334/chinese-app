/**
 * Tiện ích bảo mật Production: Sanitize dữ liệu đầu vào, chống XSS và giới hạn tốc độ gọi API (Rate Limit)
 */

export function sanitizeText(input: string, maxLength = 500): string {
  if (!input || typeof input !== "string") return ""
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
    .slice(0, maxLength)
}

export function isValidEmail(email: string): boolean {
  const clean = email.trim()
  if (clean.length > 254) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return emailRegex.test(clean)
}

/**
 * Bộ giới hạn tần suất (Rate Limiter) phía Client tránh spam API
 */
export function checkRateLimit(actionKey: string, maxAttempts: number, windowMs: number): { allowed: boolean; retryAfterSec: number } {
  if (typeof window === "undefined") return { allowed: true, retryAfterSec: 0 }

  try {
    const storageKey = `rl_${actionKey}`
    const now = Date.now()
    const raw = sessionStorage.getItem(storageKey)
    let timestamps: number[] = raw ? JSON.parse(raw) : []

    timestamps = timestamps.filter((t) => now - t < windowMs)

    if (timestamps.length >= maxAttempts) {
      const oldest = timestamps[0]
      const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000)
      return { allowed: false, retryAfterSec: Math.max(1, retryAfterSec) }
    }

    timestamps.push(now)
    sessionStorage.setItem(storageKey, JSON.stringify(timestamps))
    return { allowed: true, retryAfterSec: 0 }
  } catch {
    return { allowed: true, retryAfterSec: 0 }
  }
}

/**
 * Tạo mã kiểm tra toàn vẹn (Checksum) cho trạng thái gói cước lưu cục bộ
 */
export function computeSubChecksum(plan: string, expiresAt: number | null, uid: string): string {
  const payload = `${plan}|${expiresAt ?? 0}|${uid}|hsk_prod_salt_v1`
  let hash = 5381
  for (let i = 0; i < payload.length; i++) {
    hash = (hash * 33) ^ payload.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

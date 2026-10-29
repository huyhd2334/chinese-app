import { isProUser, triggerUpgradeModal } from "./subscription"

/**
 * Giới hạn tính năng của gói Miễn phí (soft-gate phía client).
 *
 * Lưu ý bảo mật: OCR chạy 100% trên máy người dùng (không tốn tài nguyên server) nên đây là cơ chế
 * khuyến khích nâng cấp, không phải biên giới bảo mật. Những thứ tốn tài nguyên/giá trị thật
 * (đồng bộ cloud, ghi srs_items) đã được chặn ở server bằng RLS + is_pro().
 */
export const FREE_OCR_DAILY_LIMIT = 5
export const FREE_PDF_PAGE_LIMIT = 5

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

const storageKey = (feature: string) => `hsk_quota_${feature}_${todayKey()}`

export function getDailyUsage(feature: string): number {
  if (typeof window === "undefined") return 0
  const n = Number(localStorage.getItem(storageKey(feature)))
  return Number.isFinite(n) ? n : 0
}

/**
 * Trừ 1 lượt dùng trong ngày. Trả về false (và mở modal nâng cấp) nếu gói Free đã hết lượt.
 * Người dùng Pro luôn được phép.
 */
export function consumeDailyQuota(feature: string, freeLimit: number): boolean {
  if (typeof window === "undefined" || isProUser()) return true
  const used = getDailyUsage(feature)
  if (used >= freeLimit) {
    triggerUpgradeModal("manual")
    return false
  }
  localStorage.setItem(storageKey(feature), String(used + 1))
  return true
}

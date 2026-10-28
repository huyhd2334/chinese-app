import { supabase } from "@/lib/supabase"
import { computeSubChecksum } from "./security"

export const FREE_REVIEW_LIMIT = 500

export type PlanType = "free" | "pro_monthly" | "pro_yearly"

export interface SubscriptionInfo {
  plan: PlanType
  expiresAt: number | null
  userId: string
  checksum: string
}

const SUB_STORAGE_KEY = "hsk_sub_state_v1"

export class ReviewLimitError extends Error {
  constructor(message = "Đã đạt giới hạn 500 từ ôn tập của gói Miễn phí.") {
    super(message)
    this.name = "ReviewLimitError"
  }
}

/**
 * Đọc trạng thái gói cước hiện tại từ bộ nhớ cục bộ (có kiểm tra chữ ký checksum chống giả mạo)
 */
export function getLocalSubscription(currentUserId = "guest"): SubscriptionInfo {
  if (typeof window === "undefined") {
    return { plan: "free", expiresAt: null, userId: currentUserId, checksum: "" }
  }

  try {
    const raw = localStorage.getItem(SUB_STORAGE_KEY)
    if (!raw) {
      return { plan: "free", expiresAt: null, userId: currentUserId, checksum: "" }
    }

    const parsed: SubscriptionInfo = JSON.parse(raw)
    const expectedChecksum = computeSubChecksum(parsed.plan, parsed.expiresAt, parsed.userId)

    // Nếu chữ ký không khớp hoặc đã hết hạn -> tự động về gói Free
    if (parsed.checksum !== expectedChecksum) {
      localStorage.removeItem(SUB_STORAGE_KEY)
      return { plan: "free", expiresAt: null, userId: currentUserId, checksum: "" }
    }

    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      return { plan: "free", expiresAt: null, userId: parsed.userId, checksum: "" }
    }

    return parsed
  } catch {
    return { plan: "free", expiresAt: null, userId: currentUserId, checksum: "" }
  }
}

/**
 * Kiểm tra nhanh người dùng hiện tại có đang là thành viên Pro hợp lệ hay không
 */
export function isProUser(): boolean {
  const sub = getLocalSubscription()
  if (sub.plan === "pro_monthly" || sub.plan === "pro_yearly") {
    if (!sub.expiresAt || sub.expiresAt > Date.now()) {
      return true
    }
  }
  return false
}

/**
 * Lưu trạng thái gói cước vào bộ nhớ cục bộ kèm chữ ký bảo mật
 */
export function saveLocalSubscription(plan: PlanType, expiresAt: number | null, userId = "guest"): SubscriptionInfo {
  const checksum = computeSubChecksum(plan, expiresAt, userId)
  const info: SubscriptionInfo = {
    plan,
    expiresAt,
    userId,
    checksum,
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(SUB_STORAGE_KEY, JSON.stringify(info))
    window.dispatchEvent(new CustomEvent("hsk-subscription-updated", { detail: info }))
  }
  return info
}

/**
 * Đồng bộ trạng thái gói đăng ký với Supabase Cloud
 */
export async function syncSubscriptionWithCloud(userId: string): Promise<SubscriptionInfo> {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    if (!error && data) {
      const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : null
      const isExpired = expiresAt !== null && expiresAt < Date.now()
      const activePlan: PlanType = isExpired ? "free" : (data.plan as PlanType) || "free"

      return saveLocalSubscription(activePlan, isExpired ? null : expiresAt, userId)
    }

    // Nếu trên Cloud chưa có nhưng dưới máy vừa kích hoạt thì đồng bộ lên Cloud
    const local = getLocalSubscription(userId)
    if (local.plan !== "free" && local.expiresAt && local.expiresAt > Date.now()) {
      await supabase.from("user_subscriptions").upsert({
        user_id: userId,
        plan: local.plan,
        status: "active",
        expires_at: new Date(local.expiresAt).toISOString(),
        updated_at: new Date().toISOString(),
      })
      return saveLocalSubscription(local.plan, local.expiresAt, userId)
    }

    return saveLocalSubscription("free", null, userId)
  } catch {
    return getLocalSubscription(userId)
  }
}

/**
 * Kích hoạt gói Pro (Theo tháng hoặc Theo năm) và lưu lên Supabase Cloud
 */
export async function activateProSubscription(
  plan: "pro_monthly" | "pro_yearly",
  userId?: string
): Promise<SubscriptionInfo> {
  const now = Date.now()
  const durationDays = plan === "pro_yearly" ? 365 : 30
  const expiresAt = now + durationDays * 24 * 60 * 60 * 1000
  const uid = userId || "guest"

  const info = saveLocalSubscription(plan, expiresAt, uid)

  if (userId) {
    try {
      await supabase.from("user_subscriptions").upsert({
        user_id: userId,
        plan,
        status: "active",
        started_at: new Date(now).toISOString(),
        expires_at: new Date(expiresAt).toISOString(),
        updated_at: new Date(now).toISOString(),
      })
    } catch (e) {
      console.warn("Could not sync subscription to Supabase:", e)
    }
  }

  return info
}

/**
 * Bắn sự kiện mở Modal nâng cấp Pro từ bất kỳ đâu trong ứng dụng
 */
export function triggerUpgradeModal(reason: "limit_500" | "manual" = "manual") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hsk-open-upgrade-modal", { detail: { reason } }))
  }
}

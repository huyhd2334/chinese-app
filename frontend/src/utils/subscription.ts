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

const SUB_STORAGE_KEY = "hsk_sub_state_v2"
const LEGACY_STORAGE_KEY = "hsk_sub_state_v1"

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
    // Xóa bản lưu thử nghiệm cũ (v1) nếu có
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    }

    const raw = localStorage.getItem(SUB_STORAGE_KEY)
    if (!raw) {
      return { plan: "free", expiresAt: null, userId: currentUserId, checksum: "" }
    }

    const parsed: SubscriptionInfo = JSON.parse(raw)

    // Không cho phép tài khoản guest giữ trạng thái Pro
    if (!parsed.userId || parsed.userId === "guest") {
      localStorage.removeItem(SUB_STORAGE_KEY)
      return { plan: "free", expiresAt: null, userId: currentUserId, checksum: "" }
    }

    const expectedChecksum = computeSubChecksum(parsed.plan, parsed.expiresAt, parsed.userId)

    // Nếu chữ ký không khớp hoặc đã hết hạn -> tự động về gói Free
    if (parsed.checksum !== expectedChecksum) {
      localStorage.removeItem(SUB_STORAGE_KEY)
      return { plan: "free", expiresAt: null, userId: currentUserId, checksum: "" }
    }

    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      localStorage.removeItem(SUB_STORAGE_KEY)
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
  if (sub.userId === "guest") return false
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
    if (plan === "free" || userId === "guest") {
      localStorage.removeItem(SUB_STORAGE_KEY)
    } else {
      localStorage.setItem(SUB_STORAGE_KEY, JSON.stringify(info))
    }
    window.dispatchEvent(new CustomEvent("hsk-subscription-updated", { detail: info }))
  }
  return info
}

/**
 * Đồng bộ trạng thái gói đăng ký từ Supabase Cloud (Chỉ đọc từ Server, không tự đẩy local lên)
 */
export async function syncSubscriptionWithCloud(userId: string): Promise<SubscriptionInfo> {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    if (!error && data && data.status === "active") {
      const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : null
      const isExpired = expiresAt !== null && expiresAt < Date.now()
      const activePlan: PlanType = isExpired ? "free" : (data.plan as PlanType) || "free"

      if (activePlan === "pro_monthly" || activePlan === "pro_yearly") {
        return saveLocalSubscription(activePlan, expiresAt, userId)
      }
    }

    return saveLocalSubscription("free", null, userId)
  } catch {
    return saveLocalSubscription("free", null, userId)
  }
}

/**
 * Kiểm tra giao dịch chuyển khoản ngân hàng trên Supabase (Không tự động nâng cấp nếu chưa có xác nhận thực tế)
 */
export async function verifyBankTransferPayment(
  userId: string,
  transferRef: string
): Promise<{ verified: boolean; message: string; subInfo?: SubscriptionInfo }> {
  // 1. Kiểm tra xem webhook ngân hàng đã kích hoạt gói Pro trên bảng user_subscriptions chưa
  const synced = await syncSubscriptionWithCloud(userId)
  if (synced.plan === "pro_monthly" || synced.plan === "pro_yearly") {
    return {
      verified: true,
      message: "Giao dịch đã được xác nhận! Tài khoản của bạn đã được nâng cấp lên Gói Pro.",
      subInfo: synced,
    }
  }

  // 2. Chưa có xác nhận: webhook ngân hàng sẽ tự kích hoạt Pro ngay khi nhận được tiền.
  //    (Đơn hàng được tạo & đối soát hoàn toàn ở server qua /api/payment/create-order + /api/payment/webhook)
  return {
    verified: false,
    message: `Hệ thống chưa ghi nhận được giao dịch chuyển khoản ngân hàng với nội dung "${transferRef}". Vui lòng hoàn tất chuyển khoản đúng số tiền & nội dung rồi bấm kiểm tra lại sau 1–3 phút.`,
  }
}

export interface PaymentOrder {
  orderCode: string
  amount: number
  paidAmount: number
  qrUrl: string | null
  reused: boolean
}

/**
 * Tạo (hoặc lấy lại) đơn hàng VietQR từ server. Server tự quyết định số tiền theo gói.
 */
export async function createPaymentOrder(
  plan: "pro_monthly" | "pro_yearly"
): Promise<{ order?: PaymentOrder; error?: string }> {
  try {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return { error: "Vui lòng đăng nhập trước khi thanh toán." }

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan }),
    })
    const body = await res.json().catch(() => ({}))

    if (res.status === 429) return { error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút." }
    if (!res.ok) return { error: body?.message || "Không thể tạo đơn hàng lúc này. Vui lòng thử lại." }
    return { order: body as PaymentOrder }
  } catch {
    return { error: "Không thể kết nối máy chủ thanh toán. Vui lòng kiểm tra mạng và thử lại." }
  }
}

/**
 * Kích hoạt Gói Pro bằng Mã Kích Hoạt thông qua hàm RPC bảo mật trên Supabase
 */
export async function redeemActivationCodeOnServer(
  code: string,
  userId: string
): Promise<{ success: boolean; message: string; subInfo?: SubscriptionInfo }> {
  const cleanCode = code.trim().toUpperCase()
  if (!cleanCode) {
    return { success: false, message: "Vui lòng nhập mã kích hoạt." }
  }

  // Mã kích hoạt đặc quyền dành cho Admin / Chủ sở hữu web thử nghiệm
  if (cleanCode === "TIEULU2026" || cleanCode === "HSKPRO2026" || cleanCode === "TIEULU_PRO") {
    const expiresAt = Date.now() + 365 * 86400000 // 1 năm
    const info = saveLocalSubscription("pro_yearly", expiresAt, userId)
    return {
      success: true,
      message: "Chúc mừng! Bạn đã kích hoạt thành công Gói Pro 1 Năm 🎉",
      subInfo: info,
    }
  }

  try {
    const { data, error } = await supabase.rpc("redeem_activation_code", {
      p_code: cleanCode,
    })

    if (error) {
      return {
        success: false,
        message: "Mã kích hoạt không hợp lệ hoặc hệ thống chưa cấu hình bảng mã kích hoạt trên Supabase.",
      }
    }

    if (data && data.success) {
      const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : Date.now() + 30 * 86400000
      const plan = (data.plan as PlanType) || "pro_monthly"
      const info = saveLocalSubscription(plan, expiresAt, userId)
      return {
        success: true,
        message: data.message || "Kích hoạt Gói Pro thành công!",
        subInfo: info,
      }
    }

    return {
      success: false,
      message: data?.message || "Mã kích hoạt không tồn tại hoặc đã hết lượt sử dụng.",
    }
  } catch {
    return {
      success: false,
      message: "Không thể xác thực mã kích hoạt lúc này. Vui lòng thử lại sau.",
    }
  }
}

/**
 * Đưa tài khoản về lại Gói Miễn Phí (Hủy gói Pro trên cả máy và Supabase)
 */
export async function resetToFreeSubscription(userId?: string): Promise<SubscriptionInfo> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    localStorage.removeItem(SUB_STORAGE_KEY)
  }

  if (userId) {
    try {
      await supabase.rpc("cancel_my_subscription")
    } catch {
      // Fallback nếu chưa chạy RPC mới
    }
    try {
      await supabase
        .from("user_subscriptions")
        .update({ plan: "free", status: "cancelled", expires_at: null })
        .eq("user_id", userId)
    } catch {
      // Ignore
    }
  }

  return saveLocalSubscription("free", null, userId || "guest")
}

/**
 * Bắn sự kiện mở Modal nâng cấp Pro từ bất kỳ đâu trong ứng dụng
 */
export function triggerUpgradeModal(reason: "limit_500" | "manual" = "manual") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hsk-open-upgrade-modal", { detail: { reason } }))
  }
}

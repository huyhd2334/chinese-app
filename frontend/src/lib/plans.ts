/**
 * Nguồn sự thật duy nhất cho giá & thời hạn gói cước (dùng chung Client + Server).
 * Server luôn tự tính số tiền từ đây, KHÔNG tin số tiền do client gửi lên.
 */
export type PaidPlan = "pro_monthly" | "pro_yearly"

export const PLANS: Record<PaidPlan, { label: string; amount: number; days: number }> = {
  pro_monthly: { label: "Pro Theo Tháng", amount: 49000, days: 30 },
  pro_yearly: { label: "Pro Theo Năm", amount: 399000, days: 365 },
}

export function isPaidPlan(value: unknown): value is PaidPlan {
  return value === "pro_monthly" || value === "pro_yearly"
}

/** Mã đơn: HSK + 8 ký tự A-Z0-9 (khớp regex trong process_payment_webhook) */
export const ORDER_CODE_REGEX = /HSK[A-Z0-9]{8}/

/** Thời gian giữ QR của 1 đơn pending để tái sử dụng (tránh spam tạo đơn) */
export const ORDER_REUSE_WINDOW_MS = 30 * 60 * 1000

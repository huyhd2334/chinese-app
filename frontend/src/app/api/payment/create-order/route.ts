import { NextRequest, NextResponse } from "next/server"
import { randomInt } from "node:crypto"
import { getSupabaseAdmin, getUserFromRequest } from "@/lib/server/supabaseAdmin"
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/server/rateLimit"
import { ORDER_REUSE_WINDOW_MS, PLANS, isPaidPlan } from "@/lib/plans"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // bỏ ký tự dễ nhầm: 0 O 1 I

function generateOrderCode(): string {
  let out = "HSK"
  for (let i = 0; i < 8; i++) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
  return out
}

function buildQrUrl(amount: number, orderCode: string): string | null {
  const bin = process.env.BANK_BIN
  const account = process.env.BANK_ACCOUNT_NO
  const name = process.env.BANK_ACCOUNT_NAME || "HSK LEARNING PRO"
  if (!bin || !account) return null
  return (
    `https://img.vietqr.io/image/${encodeURIComponent(bin)}-${encodeURIComponent(account)}-compact2.png` +
    `?amount=${amount}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(name)}`
  )
}

/**
 * Tạo (hoặc tái sử dụng) đơn hàng PENDING cho user đang đăng nhập.
 * Số tiền do SERVER quyết định theo gói - client không thể sửa giá.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const ipLimit = await rateLimit(`create-order:ip:${ip}`, 30, 3600)
  if (!ipLimit.allowed) return tooManyRequests(ipLimit.retryAfterSec)

  const admin = getSupabaseAdmin()
  if (!admin || !process.env.BANK_BIN || !process.env.BANK_ACCOUNT_NO) {
    return NextResponse.json(
      { error: "payment_not_configured", message: "Cổng thanh toán chưa được cấu hình. Vui lòng liên hệ hỗ trợ." },
      { status: 503 }
    )
  }

  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "unauthorized", message: "Vui lòng đăng nhập." }, { status: 401 })
  }

  const userLimit = await rateLimit(`create-order:user:${user.id}`, 10, 3600)
  if (!userLimit.allowed) return tooManyRequests(userLimit.retryAfterSec)

  let plan: unknown
  try {
    plan = (await req.json())?.plan
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  if (!isPaidPlan(plan)) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 })
  }
  const { amount } = PLANS[plan]

  // Tái sử dụng đơn pending còn mới của cùng gói -> không sinh rác trong DB
  const since = new Date(Date.now() - ORDER_REUSE_WINDOW_MS).toISOString()
  const { data: existing } = await admin
    .from("orders")
    .select("order_code, amount, paid_amount, created_at")
    .eq("user_id", user.id)
    .eq("plan", plan)
    .eq("status", "pending")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({
      orderCode: existing.order_code,
      amount: existing.amount,
      paidAmount: existing.paid_amount,
      qrUrl: buildQrUrl(existing.amount, existing.order_code),
      reused: true,
    })
  }

  // Sinh mã duy nhất (xung đột cực hiếm; thử lại tối đa 5 lần)
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderCode = generateOrderCode()
    const { error } = await admin.from("orders").insert({
      order_code: orderCode,
      user_id: user.id,
      plan,
      amount,
      payment_method: "vietqr",
    })
    if (!error) {
      return NextResponse.json({
        orderCode,
        amount,
        paidAmount: 0,
        qrUrl: buildQrUrl(amount, orderCode),
        reused: false,
      })
    }
    if (error.code !== "23505") {
      console.error("[create-order] insert failed:", error.message)
      return NextResponse.json({ error: "server_error" }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "server_error" }, { status: 500 })
}

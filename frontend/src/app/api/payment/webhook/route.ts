import { NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "node:crypto"
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin"
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/server/rateLimit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/**
 * Xác thực webhook. Hỗ trợ 2 chế độ (đặt biến môi trường tương ứng):
 *  1) SePay / Casso kiểu API key:  Authorization: Apikey <PAYMENT_WEBHOOK_API_KEY>
 *  2) HMAC-SHA256 trên raw body:    x-signature: hex(hmac(PAYMENT_WEBHOOK_SECRET, rawBody))
 *     (tùy chọn x-timestamp: epoch giây, lệch > 5 phút bị từ chối - chống replay; khi có, chữ ký tính trên `${ts}.${rawBody}`)
 */
function verifyWebhook(req: NextRequest, rawBody: string): boolean {
  const apiKey = process.env.PAYMENT_WEBHOOK_API_KEY
  const secret = process.env.PAYMENT_WEBHOOK_SECRET

  if (apiKey) {
    const header = req.headers.get("authorization") || ""
    const expected = `Apikey ${apiKey}`
    if (safeEqual(header, expected)) return true
  }

  if (secret) {
    const signature = (req.headers.get("x-signature") || "").toLowerCase()
    if (signature) {
      const ts = req.headers.get("x-timestamp")
      let payload = rawBody
      if (ts) {
        const drift = Math.abs(Date.now() / 1000 - Number(ts))
        if (!Number.isFinite(drift) || drift > 300) return false
        payload = `${ts}.${rawBody}`
      }
      const computed = createHmac("sha256", secret).update(payload).digest("hex")
      if (safeEqual(signature, computed)) return true
    }
  }

  return false
}

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(3000),
    })
  } catch {
    // Thông báo là best-effort, không được làm hỏng luồng webhook
  }
}

/**
 * Webhook nhận biến động số dư ngân hàng (SePay / Casso / tương thích).
 * Mô hình payload SePay: { id, transferType: "in", transferAmount, content, referenceCode, ... }
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = await rateLimit(`webhook:ip:${ip}`, 120, 60)
  if (!rl.allowed) return tooManyRequests(rl.retryAfterSec)

  if (!process.env.PAYMENT_WEBHOOK_API_KEY && !process.env.PAYMENT_WEBHOOK_SECRET) {
    console.error("[webhook] Chưa cấu hình PAYMENT_WEBHOOK_API_KEY / PAYMENT_WEBHOOK_SECRET")
    return NextResponse.json({ success: false, error: "not_configured" }, { status: 503 })
  }

  const rawBody = await req.text()
  if (rawBody.length > 20_000) {
    return NextResponse.json({ success: false, error: "payload_too_large" }, { status: 413 })
  }

  if (!verifyWebhook(req, rawBody)) {
    return NextResponse.json({ success: false, error: "invalid_signature" }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ success: false, error: "bad_json" }, { status: 400 })
  }

  // Chỉ xử lý tiền VÀO tài khoản
  const transferType = String(payload.transferType ?? payload.type ?? "in").toLowerCase()
  if (transferType !== "in" && transferType !== "credit") {
    return NextResponse.json({ success: true, ignored: "not_incoming" })
  }

  const amount = Math.round(Number(payload.transferAmount ?? payload.amount ?? 0))
  const content = String(payload.content ?? payload.description ?? "")
  const txId = String(payload.id ?? payload.referenceCode ?? payload.tid ?? "")

  if (!txId || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ success: false, error: "not_configured" }, { status: 503 })
  }

  const provider = String(payload.gateway ?? payload.provider ?? "bank").slice(0, 40)
  const { data, error } = await admin.rpc("process_payment_webhook", {
    p_provider: provider,
    p_tx_id: txId.slice(0, 120),
    p_content: content.slice(0, 500),
    p_amount: amount,
    p_raw: payload,
  })

  if (error) {
    console.error("[webhook] RPC error:", error.message)
    // 500 -> nhà cung cấp sẽ tự retry; RPC idempotent nên retry an toàn
    return NextResponse.json({ success: false, error: "processing_failed" }, { status: 500 })
  }

  const result = (data as { result?: string; plan?: string; order_code?: string; amount?: number; missing?: number }) || {}

  if (result.result === "completed") {
    void notifyTelegram(`💰 Đơn ${result.order_code} hoàn tất: +${(result.amount ?? amount).toLocaleString("vi-VN")}đ (${result.plan})`)
  } else if (result.result === "unmatched") {
    void notifyTelegram(`⚠️ Giao dịch không khớp đơn nào: ${amount.toLocaleString("vi-VN")}đ - "${content.slice(0, 120)}" (tx ${txId})`)
  } else if (result.result === "partial") {
    void notifyTelegram(`⚠️ Đơn ${result.order_code} chuyển thiếu ${result.missing?.toLocaleString("vi-VN")}đ`)
  }

  return NextResponse.json({ success: true, result: result.result ?? "ok" })
}

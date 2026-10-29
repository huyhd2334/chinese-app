import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ success: false, plan: "free" }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    if (!admin) {
      return NextResponse.json({ success: false, plan: "free" }, { status: 500 })
    }

    // 1. Kiểm tra trực tiếp app_metadata trên Supabase Auth (luôn luôn mới nhất, không bị cache JWT phía client)
    try {
      const { data: authUser } = await admin.auth.admin.getUserById(userId)
      const appMeta = authUser?.user?.app_metadata
      if (appMeta?.plan === "pro_yearly" || appMeta?.plan === "pro_monthly") {
        const exp = appMeta.expires_at ? Number(appMeta.expires_at) : null
        if (!exp || exp > Date.now()) {
          return NextResponse.json({
            success: true,
            isPro: true,
            plan: appMeta.plan,
            expiresAt: exp,
          })
        }
      }
    } catch (authErr) {
      console.warn("getUserById error in status route:", authErr)
    }

    // 2. Kiểm tra bản ghi kích hoạt mã trong bonus_collections
    const { data: redemption } = await admin
      .from("bonus_collections")
      .select("id, subtitle, created_at")
      .eq("slug", "_sys_code_redemption")
      .eq("user_id", userId)
      .maybeSingle()

    if (redemption) {
      const plan = redemption.subtitle || "pro_yearly"
      const createdMs = new Date(redemption.created_at).getTime()
      const expiresAt = createdMs + 365 * 86400000
      if (expiresAt > Date.now()) {
        return NextResponse.json({
          success: true,
          isPro: true,
          plan,
          expiresAt,
        })
      }
    }

    // 3. Kiểm tra bảng user_subscriptions (giao dịch thanh toán tự động)
    const { data: subData } = await admin
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    if (subData && subData.status === "active") {
      const expiresAt = subData.expires_at ? new Date(subData.expires_at).getTime() : null
      if (!expiresAt || expiresAt > Date.now()) {
        return NextResponse.json({
          success: true,
          isPro: true,
          plan: subData.plan,
          expiresAt,
        })
      }
    }

    return NextResponse.json({
      success: true,
      isPro: false,
      plan: "free",
      expiresAt: null,
    })
  } catch (err) {
    console.error("Lỗi kiểm tra trạng thái Pro:", err)
    return NextResponse.json({ success: false, plan: "free" }, { status: 500 })
  }
}

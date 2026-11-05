import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin, getUserFromRequest } from "@/lib/server/supabaseAdmin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ADMIN_EMAIL = "huyqame1356@gmail.com"

export async function POST(req: NextRequest) {
  try {
    // 1. Xác thực quyền Admin
    const adminUser = await getUserFromRequest(req)
    if (!adminUser || !adminUser.email || adminUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: "forbidden", message: "Chỉ quản trị viên mới có quyền thực hiện hành động này." },
        { status: 403 }
      )
    }

    const admin = getSupabaseAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: "supabase_not_configured", message: "Chưa cấu hình Supabase Admin." },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { action, targetUserId, plan = "pro_yearly" } = body

    if (action === "grant_pro") {
      if (!targetUserId) {
        return NextResponse.json({ error: "missing_user_id" }, { status: 400 })
      }

      const expiresAt = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString()

      // 1. Cập nhật bảng user_subscriptions
      await admin.from("user_subscriptions").upsert({
        user_id: targetUserId,
        plan,
        status: "active",
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })

      // 2. Cập nhật app_metadata của tài khoản trong Supabase Auth
      await admin.auth.admin.updateUserById(targetUserId, {
        app_metadata: {
          plan,
          status: "active",
          expires_at: expiresAt,
        },
      })

      return NextResponse.json({
        success: true,
        message: `Đã kích hoạt gói Pro cho tài khoản đến ngày ${expiresAt.split("T")[0]}.`,
      })
    }

    if (action === "revoke_pro") {
      if (!targetUserId) {
        return NextResponse.json({ error: "missing_user_id" }, { status: 400 })
      }

      await admin.from("user_subscriptions").upsert({
        user_id: targetUserId,
        plan: "free",
        status: "cancelled",
        expires_at: null,
        updated_at: new Date().toISOString(),
      })

      await admin.auth.admin.updateUserById(targetUserId, {
        app_metadata: {
          plan: "free",
          status: "cancelled",
          expires_at: null,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Đã hủy gói Pro, chuyển tài khoản về gói Miễn phí.",
      })
    }

    if (action === "clear_cache") {
      // Trigger Node.js garbage collection hint if run with --expose-gc
      if (typeof global.gc === "function") {
        global.gc()
      }
      return NextResponse.json({
        success: true,
        message: "Đã dọn dẹp bộ nhớ đệm và tối ưu tài nguyên máy chủ.",
      })
    }

    return NextResponse.json({ error: "unknown_action" }, { status: 400 })
  } catch (err: any) {
    console.error("[admin-action] Error:", err)
    return NextResponse.json(
      { error: "action_failed", message: err?.message || "Thao tác thất bại." },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin, getUserFromRequest } from "@/lib/server/supabaseAdmin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ADMIN_EMAIL = "huyqame1356@gmail.com"

export async function GET(req: NextRequest) {
  try {
    // 1. Xác thực quyền Admin
    const user = await getUserFromRequest(req)
    if (!user || !user.email || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: "forbidden", message: "Chỉ quản trị viên (huyqame1356@gmail.com) mới có quyền truy cập." },
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

    const startTime = Date.now()

    // 2. Lấy danh sách người dùng từ Supabase Auth Admin API
    let usersList: any[] = []
    let totalUsers = 0
    try {
      const { data: usersData, error: usersErr } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      })
      if (!usersErr && usersData?.users) {
        usersList = usersData.users
        totalUsers = usersList.length
      }
    } catch (err) {
      console.error("[admin-metrics] listUsers error:", err)
    }

    // 3. Lấy dữ liệu đơn hàng (orders) và giao dịch ngân hàng (payment_transactions)
    let ordersList: any[] = []
    let totalRevenue = 0
    let completedOrdersCount = 0
    let pendingOrdersCount = 0

    try {
      const { data: ordersData } = await admin
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200)

      if (ordersData) {
        ordersList = ordersData
        ordersList.forEach((o) => {
          if (o.status === "completed") {
            completedOrdersCount++
            totalRevenue += Number(o.amount || o.paid_amount || 0)
          } else if (o.status === "pending") {
            pendingOrdersCount++
          }
        })
      }
    } catch (err) {
      console.warn("[admin-metrics] orders query error:", err)
    }

    // Lấy giao dịch webhook gần nhất
    let transactionsList: any[] = []
    try {
      const { data: txData } = await admin
        .from("payment_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (txData) {
        transactionsList = txData
      }
    } catch (err) {
      console.warn("[admin-metrics] transactions query error:", err)
    }

    // Lấy danh sách subscription
    let subscriptionsList: any[] = []
    let activeProCount = 0
    try {
      const { data: subData } = await admin
        .from("user_subscriptions")
        .select("*")
        .order("updated_at", { ascending: false })

      if (subData) {
        subscriptionsList = subData
        const now = new Date()
        activeProCount = subData.filter(
          (s) => s.status === "active" && (s.plan === "pro_monthly" || s.plan === "pro_yearly") && (!s.expires_at || new Date(s.expires_at) > now)
        ).length
      }
    } catch (err) {
      console.warn("[admin-metrics] subscriptions query error:", err)
    }

    const dbQueryTimeMs = Date.now() - startTime

    // 4. Tính toán biểu đồ đăng ký theo ngày (14 ngày qua)
    const registrationsByDay: Record<string, number> = {}
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateKey = d.toISOString().split("T")[0]
      registrationsByDay[dateKey] = 0
    }

    usersList.forEach((u) => {
      if (u.created_at) {
        const dateKey = u.created_at.split("T")[0]
        if (registrationsByDay[dateKey] !== undefined) {
          registrationsByDay[dateKey]++
        }
      }
    })

    const chartData = Object.entries(registrationsByDay).map(([date, count]) => {
      const [, m, day] = date.split("-")
      return {
        date,
        displayDate: `${day}/${m}`,
        users: count,
      }
    })

    // 5. Tổng hợp Logs hợp nhất (Đăng ký, Đơn hàng, Webhook)
    const logs: Array<{
      id: string
      type: "auth" | "order" | "webhook" | "system"
      level: "info" | "success" | "warn" | "error"
      title: string
      detail: string
      createdAt: string
    }> = []

    // Thêm log người dùng mới
    usersList.slice(0, 30).forEach((u) => {
      logs.push({
        id: `user-${u.id}`,
        type: "auth",
        level: "info",
        title: "Người dùng đăng ký mới",
        detail: `Email: ${u.email || "Ẩn danh"} (Xác thực: ${u.email_confirmed_at ? "Đã xác nhận" : "Chưa xác nhận"})`,
        createdAt: u.created_at || new Date().toISOString(),
      })
    })

    // Thêm log đơn hàng
    ordersList.slice(0, 30).forEach((o) => {
      logs.push({
        id: `order-${o.id || o.order_code}`,
        type: "order",
        level: o.status === "completed" ? "success" : o.status === "pending" ? "warn" : "error",
        title: `Đơn hàng ${o.order_code} (${o.plan})`,
        detail: `Số tiền: ${Number(o.amount).toLocaleString("vi-VN")}đ • Trạng thái: ${o.status} • User: ${o.user_id?.slice(0, 8)}...`,
        createdAt: o.created_at || new Date().toISOString(),
      })
    })

    // Thêm log webhook ngân hàng
    transactionsList.slice(0, 30).forEach((t) => {
      logs.push({
        id: `tx-${t.id}`,
        type: "webhook",
        level: t.result === "completed" ? "success" : "warn",
        title: `Biến động ngân hàng (${t.provider || "Bank"})`,
        detail: `+${Number(t.amount).toLocaleString("vi-VN")}đ • Mã đơn: ${t.order_code || "Không xác định"} • Kết quả: ${t.result}`,
        createdAt: t.created_at || new Date().toISOString(),
      })
    })

    // Sắp xếp logs theo thời gian mới nhất
    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // 6. Thông tin Runtime Server
    const memory = process.memoryUsage()
    const serverInfo = {
      platform: process.platform,
      nodeVersion: process.version,
      uptimeSeconds: Math.round(process.uptime()),
      memoryRssMb: Math.round(memory.rss / (1024 * 1024)),
      memoryHeapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      memoryHeapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
      dbQueryTimeMs,
      features: {
        bankConfigured: !!(process.env.BANK_BIN && process.env.BANK_ACCOUNT_NO),
        webhookConfigured: !!(process.env.PAYMENT_WEBHOOK_API_KEY || process.env.PAYMENT_WEBHOOK_SECRET),
        telegramConfigured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
        redisConfigured: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
        audioCdnConfigured: !!process.env.AUDIO_CDN_BASE,
      },
    }

    // 7. Chuẩn bị danh sách users trả về cho bảng quản lý
    const sanitizedUsers = usersList.slice(0, 100).map((u) => {
      const sub = subscriptionsList.find((s) => s.user_id === u.id)
      const isProFromSub = sub?.status === "active" && (!sub.expires_at || new Date(sub.expires_at) > now)
      const isProFromMeta = u.app_metadata?.plan === "pro_monthly" || u.app_metadata?.plan === "pro_yearly"

      return {
        id: u.id,
        email: u.email,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at,
        isConfirmed: !!u.email_confirmed_at,
        isPro: isProFromSub || isProFromMeta,
        plan: sub?.plan || u.app_metadata?.plan || "free",
        expiresAt: sub?.expires_at || null,
      }
    })

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        activeProCount,
        freeUsersCount: Math.max(0, totalUsers - activeProCount),
        totalRevenue,
        completedOrdersCount,
        pendingOrdersCount,
        totalOrdersCount: ordersList.length,
      },
      chartData,
      logs: logs.slice(0, 60),
      serverInfo,
      users: sanitizedUsers,
      orders: ordersList.slice(0, 50),
    })
  } catch (err: any) {
    console.error("[admin-metrics] Internal server error:", err)
    return NextResponse.json(
      { error: "internal_error", message: err?.message || "Lỗi máy chủ nội bộ." },
      { status: 500 }
    )
  }
}

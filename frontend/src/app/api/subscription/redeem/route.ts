import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin"

// Danh sách các mã kích hoạt được thiết lập giới hạn tối đa 10 tài khoản
const PRO_CODES_CONFIG: Record<
  string,
  {
    plan: "pro_yearly" | "pro_monthly"
    maxUses: number
    durationDays: number
    label: string
  }
> = {
  TIEULU2026: {
    plan: "pro_yearly",
    maxUses: 10,
    durationDays: 365,
    label: "Gói Pro 1 Năm (Mã TIEULU2026)",
  },
  HSKPRO2026: {
    plan: "pro_yearly",
    maxUses: 10,
    durationDays: 365,
    label: "Gói Pro 1 Năm (Mã HSKPRO2026)",
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, userId } = body

    if (!code || typeof code !== "string" || !userId || typeof userId !== "string") {
      return NextResponse.json(
        { success: false, message: "Dữ liệu kích hoạt không hợp lệ." },
        { status: 400 }
      )
    }

    const cleanCode = code.trim().toUpperCase()
    const admin = getSupabaseAdmin()

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Lỗi kết nối máy chủ quản trị." },
        { status: 500 }
      )
    }

    // 1. Kiểm tra mã trong cấu hình giới hạn 10 tài khoản
    const config = PRO_CODES_CONFIG[cleanCode]
    if (!config) {
      return NextResponse.json(
        { success: false, message: "Mã kích hoạt không chính xác hoặc đã hết hạn." },
        { status: 400 }
      )
    }

    // 2. Chặn 1 tài khoản nhập nhiều lần redeem:
    // Kiểm tra xem tài khoản này đã từng kích hoạt bất kỳ mã nào trên Supabase chưa
    const { data: userRedemptions, error: userRedemptionsError } = await admin
      .from("bonus_collections")
      .select("id, title")
      .eq("slug", "_sys_code_redemption")
      .eq("user_id", userId)

    if (userRedemptions && userRedemptions.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Tài khoản của bạn đã được kích hoạt Gói Pro rồi (Mã: ${userRedemptions[0].title}). Mỗi tài khoản chỉ được kích hoạt 1 lần duy nhất.`,
        },
        { status: 400 }
      )
    }

    // Kiểm tra thêm app_metadata của tài khoản trên Supabase Auth
    const { data: authUserData } = await admin.auth.admin.getUserById(userId)
    const appMeta = authUserData?.user?.app_metadata
    if (appMeta?.plan === "pro_yearly" || appMeta?.plan === "pro_monthly") {
      const exp = appMeta.expires_at ? Number(appMeta.expires_at) : null
      if (!exp || exp > Date.now()) {
        return NextResponse.json(
          {
            success: false,
            message: "Tài khoản của bạn hiện đang là thành viên Gói Pro. Mỗi tài khoản chỉ được kích hoạt 1 lần duy nhất.",
          },
          { status: 400 }
        )
      }
    }

    // 3. Kiểm tra số lượng tài khoản đã kích hoạt mã này trên Supabase Cloud (Tối đa 10 tài khoản)
    const { data: existingRedemptions, error: queryError } = await admin
      .from("bonus_collections")
      .select("id, user_id, title")
      .eq("slug", "_sys_code_redemption")
      .eq("title", cleanCode)

    if (queryError) {
      console.error("Lỗi truy vấn mã kích hoạt:", queryError)
      return NextResponse.json(
        { success: false, message: "Không thể kiểm tra mã lúc này. Vui lòng thử lại sau." },
        { status: 500 }
      )
    }

    const redemptions = existingRedemptions || []

    // 4. Kiểm tra giới hạn tối đa 10 tài khoản cho mã này
    if (redemptions.length >= config.maxUses) {
      return NextResponse.json(
        {
          success: false,
          message: `Mã ${cleanCode} đã đạt giới hạn tối đa ${config.maxUses} tài khoản sử dụng.`,
        },
        { status: 400 }
      )
    }

    // 5. Ghi nhận lượt kích hoạt thành công vào cơ sở dữ liệu Supabase
    const redemptionRecordId = `redemption_${cleanCode}_${userId}`
    const { error: insertError } = await admin.from("bonus_collections").insert({
      id: redemptionRecordId,
      user_id: userId,
      slug: "_sys_code_redemption",
      title: cleanCode,
      subtitle: config.plan,
      description: `Kích hoạt tài khoản thứ ${redemptions.length + 1}/${config.maxUses} vào lúc ${new Date().toISOString()}`,
      language: "zh",
      badge: "PRO",
    })

    if (insertError) {
      console.error("Lỗi lưu lượt kích hoạt:", insertError)
      return NextResponse.json(
        { success: false, message: "Không thể lưu lượt kích hoạt. Vui lòng thử lại." },
        { status: 500 }
      )
    }

    // 6. Cập nhật app_metadata cho tài khoản trên Supabase Auth
    const expiresAt = Date.now() + config.durationDays * 86400000
    try {
      await admin.auth.admin.updateUserById(userId, {
        app_metadata: {
          plan: config.plan,
          expires_at: expiresAt,
          activation_code: cleanCode,
        },
      })
    } catch (authErr) {
      console.warn("Không thể update app_metadata:", authErr)
    }

    const currentCount = redemptions.length + 1

    return NextResponse.json({
      success: true,
      plan: config.plan,
      expiresAt,
      message: `Chúc mừng! Bạn đã kích hoạt thành công ${config.label} (Tài khoản ${currentCount}/${config.maxUses}) 🎉`,
    })
  } catch (err) {
    console.error("Lỗi xử lý kích hoạt mã Pro:", err)
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi trong quá trình kích hoạt." },
      { status: 500 }
    )
  }
}

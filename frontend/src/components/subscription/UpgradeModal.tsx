"use client"

import React, { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  FREE_REVIEW_LIMIT,
  getLocalSubscription,
  activateProSubscription,
  syncSubscriptionWithCloud,
  type PlanType,
  type SubscriptionInfo,
} from "@/utils/subscription"

export default function UpgradeModal() {
  const { user, openAuthModal } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [triggerReason, setTriggerReason] = useState<"limit_500" | "manual">("manual")
  const [selectedPlan, setSelectedPlan] = useState<"pro_monthly" | "pro_yearly">("pro_monthly")
  const [paymentTab, setPaymentTab] = useState<"qr" | "code">("qr")
  const [promoCode, setPromoCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [subInfo, setSubInfo] = useState<SubscriptionInfo>({
    plan: "free",
    expiresAt: null,
    userId: "guest",
    checksum: "",
  })

  // Đồng bộ trạng thái gói cước khi user đăng nhập
  useEffect(() => {
    if (user?.id) {
      syncSubscriptionWithCloud(user.id).then(setSubInfo)
    } else {
      setSubInfo(getLocalSubscription("guest"))
    }
  }, [user?.id])

  // Lắng nghe sự kiện mở modal hoặc cập nhật gói cước
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ reason?: "limit_500" | "manual" }>
      setTriggerReason(customEvent.detail?.reason || "manual")
      setFeedback(null)
      setSubInfo(getLocalSubscription(user?.id || "guest"))
      setIsOpen(true)
    }

    const handleUpdated = () => {
      setSubInfo(getLocalSubscription(user?.id || "guest"))
    }

    window.addEventListener("hsk-open-upgrade-modal", handleOpen)
    window.addEventListener("hsk-subscription-updated", handleUpdated)
    return () => {
      window.removeEventListener("hsk-open-upgrade-modal", handleOpen)
      window.removeEventListener("hsk-subscription-updated", handleUpdated)
    }
  }, [user?.id])

  if (!isOpen) return null

  const isPro =
    (subInfo.plan === "pro_monthly" || subInfo.plan === "pro_yearly") &&
    (!subInfo.expiresAt || subInfo.expiresAt > Date.now())

  const priceAmount = selectedPlan === "pro_monthly" ? 49000 : 399000
  const transferRef = `HSKPRO ${(user?.email?.split("@")[0] || "HOCVIEN").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 10)}`
  const qrUrl = `https://img.vietqr.io/image/MB-0388888888-compact2.png?amount=${priceAmount}&addInfo=${encodeURIComponent(transferRef)}&accountName=${encodeURIComponent("HSK LEARNING PRO")}`

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    setFeedback(null)
    try {
      await new Promise((r) => setTimeout(r, 800))
      const updated = await activateProSubscription(selectedPlan, user?.id)
      setSubInfo(updated)
      setFeedback({
        type: "success",
        text: `Kích hoạt thành công ${selectedPlan === "pro_monthly" ? "Gói Pro Theo Tháng" : "Gói Pro Theo Năm"}! Bạn đã mở khóa toàn bộ giới hạn ôn tập.`,
      })
    } catch {
      setFeedback({
        type: "error",
        text: "Có lỗi xảy ra khi kích hoạt. Vui lòng thử lại.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = promoCode.trim().toUpperCase()
    if (!clean) return

    setIsProcessing(true)
    setFeedback(null)

    try {
      await new Promise((r) => setTimeout(r, 500))
      const validCodes = ["HSKPRO", "VIP30", "PRO2026", "HSK500", "ADMINPRO"]
      if (!validCodes.includes(clean)) {
        setFeedback({
          type: "error",
          text: "Mã kích hoạt không hợp lệ. (Gợi ý mã trải nghiệm: HSKPRO)",
        })
        return
      }

      const updated = await activateProSubscription(selectedPlan, user?.id)
      setSubInfo(updated)
      setPromoCode("")
      setFeedback({
        type: "success",
        text: "Đã kích hoạt Gói Pro thành công! Bạn có thể ôn tập không giới hạn từ vựng.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatExpiry = (ts: number | null) => {
    if (!ts) return "Vĩnh viễn"
    return new Date(ts).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-china-ink/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-china-paper/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-china-ink text-china-gold text-[10px] font-bold uppercase tracking-wider rounded-md">
                HSK Learning Pro
              </span>
              <h3 className="font-serif font-bold text-china-ink text-base sm:text-lg">
                Nâng cấp tài khoản học tập
              </h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Mở khóa giới hạn {FREE_REVIEW_LIMIT} từ ôn tập và đồng bộ đám mây toàn diện
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-muted hover:text-china-ink rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Cảnh báo khi chạm mốc 500 từ */}
          {triggerReason === "limit_500" && !isPro && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed">
              <p className="font-bold">Bạn đã chạm mốc {FREE_REVIEW_LIMIT}/{FREE_REVIEW_LIMIT} từ ôn tập miễn phí!</p>
              <p className="text-amber-800 mt-0.5">
                Tài khoản miễn phí cho phép lưu tối đa {FREE_REVIEW_LIMIT} từ trong lộ trình Review. Hãy đăng ký gói Pro theo tháng để học trọn bộ 11,470+ từ HSK 1–7 không giới hạn.
              </p>
            </div>
          )}

          {/* Thông báo kết quả */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium ${
                feedback.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Trạng thái nếu đã là Pro */}
          {isPro && (
            <div className="p-4 rounded-2xl bg-china-paper border border-china-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-china-jade text-white text-[10px] font-bold rounded uppercase">
                    Đang hoạt động
                  </span>
                  <span className="font-serif font-bold text-china-ink text-sm sm:text-base">
                    {subInfo.plan === "pro_yearly" ? "Gói Pro Theo Năm" : "Gói Pro Theo Tháng"}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1">
                  Hạn sử dụng đến: <b className="text-china-ink">{formatExpiry(subInfo.expiresAt)}</b> · Quyền lợi: Không giới hạn từ ôn tập
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-china-ink text-white text-xs font-semibold hover:bg-china-ink/85 transition-colors self-start sm:self-auto"
              >
                Tiếp tục học tập
              </button>
            </div>
          )}

          {/* So sánh quyền lợi & Chọn gói */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gói Tháng */}
            <div
              onClick={() => setSelectedPlan("pro_monthly")}
              className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                selectedPlan === "pro_monthly"
                  ? "border-china-red bg-china-red/[0.03] ring-1 ring-china-red"
                  : "border-border bg-white hover:border-china-ink/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">
                    Gói Theo Tháng
                  </span>
                  <span className="px-2 py-0.5 rounded bg-china-paper border border-border text-[10px] font-semibold text-china-ink">
                    Linh hoạt
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-china-ink">
                    49.000đ
                  </span>
                  <span className="text-xs text-muted">/ tháng</span>
                </div>
                <ul className="space-y-2 mt-3 text-xs text-china-ink/85">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-china-red shrink-0" />
                    <span>Ôn tập Review <b>không giới hạn</b> (vượt mốc 500 từ)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-china-red shrink-0" />
                    <span>Trọn bộ 11,470+ từ HSK 1–7 & Kho Bonus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-china-red shrink-0" />
                    <span>Đồng bộ tài khoản đám mây tự động</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Gói Năm */}
            <div
              onClick={() => setSelectedPlan("pro_yearly")}
              className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                selectedPlan === "pro_yearly"
                  ? "border-china-red bg-china-red/[0.03] ring-1 ring-china-red"
                  : "border-border bg-white hover:border-china-ink/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-china-red">
                    Gói Theo Năm
                  </span>
                  <span className="px-2 py-0.5 rounded bg-china-red text-white text-[10px] font-bold">
                    Tiết kiệm 32%
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-china-ink">
                    399.000đ
                  </span>
                  <span className="text-xs text-muted">/ năm (~33k/tháng)</span>
                </div>
                <ul className="space-y-2 mt-3 text-xs text-china-ink/85">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-china-red shrink-0" />
                    <span>Toàn bộ quyền lợi Gói Tháng suốt 365 ngày</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-china-red shrink-0" />
                    <span>Dịch & tạo thẻ từ vựng hàng loạt không giới hạn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-china-red shrink-0" />
                    <span>Ưu tiên cập nhật đề thi & tính năng mới</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Khu vực thanh toán */}
          {!isPro && (
            <div className="rounded-2xl border border-border bg-china-paper/50 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentTab("qr")}
                    className={`text-xs sm:text-sm font-semibold pb-1 border-b-2 transition-colors ${
                      paymentTab === "qr"
                        ? "border-china-red text-china-red"
                        : "border-transparent text-muted hover:text-china-ink"
                    }`}
                  >
                    Chuyển khoản QR tự động
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab("code")}
                    className={`text-xs sm:text-sm font-semibold pb-1 border-b-2 transition-colors ${
                      paymentTab === "code"
                        ? "border-china-red text-china-red"
                        : "border-transparent text-muted hover:text-china-ink"
                    }`}
                  >
                    Nhập mã kích hoạt
                  </button>
                </div>

                {!user && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      openAuthModal()
                    }}
                    className="text-xs text-china-red hover:underline font-medium"
                  >
                    Đăng nhập để lưu vào tài khoản →
                  </button>
                )}
              </div>

              {paymentTab === "qr" ? (
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-white border border-border p-2 shrink-0 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrUrl}
                      alt="VietQR Payment"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-2 text-xs sm:text-sm w-full">
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span className="text-muted">Gói đăng ký:</span>
                      <span className="font-bold text-china-ink">
                        {selectedPlan === "pro_monthly" ? "Pro Theo Tháng (30 ngày)" : "Pro Theo Năm (365 ngày)"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span className="text-muted">Số tiền:</span>
                      <span className="font-bold text-china-red">
                        {priceAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span className="text-muted">Nội dung CK:</span>
                      <span className="font-mono font-bold text-china-ink bg-white px-2 py-0.5 rounded border border-border">
                        {transferRef}
                      </span>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleConfirmPayment}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-china-red hover:bg-china-red-hover text-white text-xs sm:text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isProcessing ? "Đang kiểm tra & kích hoạt..." : "Xác nhận đã thanh toán"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="space-y-3">
                  <p className="text-xs text-muted">
                    Nhập mã kích hoạt Pro hoặc mã ưu đãi học viên (Nhập <code className="px-1.5 py-0.5 bg-white border border-border rounded font-mono text-china-ink">HSKPRO</code> để kích hoạt thử nghiệm):
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Nhập mã kích hoạt (VD: HSKPRO)..."
                      className="flex-1 px-3.5 py-2 bg-white border border-border rounded-xl text-xs sm:text-sm font-mono uppercase text-china-ink focus:outline-hidden focus:border-china-red"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing || !promoCode.trim()}
                      className="px-5 py-2 rounded-xl bg-china-ink hover:bg-china-ink/85 text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 active:scale-95"
                    >
                      {isProcessing ? "Đang xử lý..." : "Kích hoạt"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

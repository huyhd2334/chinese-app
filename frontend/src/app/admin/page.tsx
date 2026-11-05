"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  CreditCard,
  Server,
  Activity,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
  Crown,
  Database,
  TrendingUp,
  Cpu,
  Zap,
  ArrowRight,
  LogOut,
  Sliders,
  BellRing,
  ExternalLink,
  Lock,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const ADMIN_EMAIL = "huyqame1356@gmail.com"

interface AdminMetrics {
  totalUsers: number
  activeProCount: number
  freeUsersCount: number
  totalRevenue: number
  completedOrdersCount: number
  pendingOrdersCount: number
  totalOrdersCount: number
}

interface ChartItem {
  date: string
  displayDate: string
  users: number
}

interface LogItem {
  id: string
  type: "auth" | "order" | "webhook" | "system"
  level: "info" | "success" | "warn" | "error"
  title: string
  detail: string
  createdAt: string
}

interface ServerInfo {
  platform: string
  nodeVersion: string
  uptimeSeconds: number
  memoryRssMb: number
  memoryHeapUsedMb: number
  memoryHeapTotalMb: number
  dbQueryTimeMs: number
  features: {
    bankConfigured: boolean
    webhookConfigured: boolean
    telegramConfigured: boolean
    redisConfigured: boolean
    audioCdnConfigured: boolean
  }
}

interface ManagedUser {
  id: string
  email: string
  createdAt: string
  lastSignInAt: string | null
  isConfirmed: boolean
  isPro: boolean
  plan: string
  expiresAt: string | null
}

interface OrderItem {
  id: string
  order_code: string
  user_id: string
  plan: string
  amount: number
  status: string
  created_at: string
}

export default function AdminDashboardPage() {
  const { user, session, isLoading: authLoading, openAuthModal, signOut } = useAuth()

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "orders" | "logs" | "server">("overview")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [chartData, setChartData] = useState<ChartItem[]>([])
  const [logs, setLogs] = useState<LogItem[]>([])
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [orders, setOrders] = useState<OrderItem[]>([])

  // Search & Filters
  const [userSearch, setUserSearch] = useState("")
  const [logFilter, setLogFilter] = useState<string>("all")
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const isSuperAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  const fetchMetrics = useCallback(async () => {
    if (!isSuperAdmin || !session?.access_token) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/admin/metrics", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Không thể tải dữ liệu quản trị.")
      }

      setMetrics(data.metrics)
      setChartData(data.chartData || [])
      setLogs(data.logs || [])
      setServerInfo(data.serverInfo || null)
      setUsers(data.users || [])
      setOrders(data.orders || [])
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi kết nối tới máy chủ quản trị.")
    } finally {
      setLoading(false)
    }
  }, [isSuperAdmin, session?.access_token])

  useEffect(() => {
    if (isSuperAdmin && session?.access_token) {
      fetchMetrics()
    }
  }, [isSuperAdmin, session?.access_token, fetchMetrics])

  // Xử lý cấp / hủy gói Pro
  const handleTogglePro = async (targetUserId: string, currentIsPro: boolean) => {
    if (!session?.access_token) return
    setActionLoadingId(targetUserId)
    setActionSuccessMsg(null)

    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: currentIsPro ? "revoke_pro" : "grant_pro",
          targetUserId,
          plan: "pro_yearly",
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Thao tác thất bại.")
      }

      setActionSuccessMsg(data.message)
      await fetchMetrics()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Dọn dẹp cache server
  const handleClearCache = async () => {
    if (!session?.access_token) return
    setActionLoadingId("clear_cache")
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "clear_cache" }),
      })
      const data = await res.json()
      setActionSuccessMsg(data.message)
      await fetchMetrics()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Format Helpers
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h} giờ ${m} phút`
  }

  // 1. TRƯỜNG HỢP ĐANG TẢI AUTH
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-china-ink">
        <RefreshCw className="w-6 h-6 animate-spin text-china-red" />
      </div>
    )
  }

  // 2. TRƯỜNG HỢP CHƯA ĐĂNG NHẬP HOẶC KHÔNG PHẢI HUYQAME1356@GMAIL.COM
  if (!user || !isSuperAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-card border border-border rounded-2xl shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-china-ink">Trung tâm quản trị (Admin Portal)</h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Khu vực này được bảo vệ nghiêm ngặt và chỉ cấp quyền truy cập duy nhất cho:
          </p>
          <div className="mt-2 inline-block px-3 py-1 bg-stone-100 dark:bg-stone-800 border border-border rounded-lg text-xs font-mono font-bold text-china-red">
            {ADMIN_EMAIL}
          </div>
        </div>

        {user ? (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            Bạn đang đăng nhập với tài khoản: <strong>{user.email}</strong>. Tài khoản này không có quyền quản trị viên.
            <button
              onClick={() => signOut()}
              className="mt-3 w-full py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất & Đổi tài khoản</span>
            </button>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="w-full py-2.5 bg-china-red text-white rounded-xl font-semibold hover:bg-china-red-hover transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Lock className="w-4 h-4" />
            <span>Đăng nhập với Google / Email</span>
          </button>
        )}
      </div>
    )
  }

  // Lọc Users theo từ khóa tìm kiếm
  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true
    return u.email?.toLowerCase().includes(userSearch.toLowerCase())
  })

  // Lọc Logs theo loại
  const filteredLogs = logs.filter((l) => {
    if (logFilter === "all") return true
    return l.type === logFilter
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      
      {/* Top Header */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-china-red/10 text-china-red">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-china-red uppercase tracking-wider">
              Trung tâm quản trị & Vận hành máy chủ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-china-ink">
            Admin Dashboard & Server Scalability
          </h1>
          <p className="text-xs text-muted">
            Quản trị viên tối cao: <strong className="text-china-ink font-mono">{ADMIN_EMAIL}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl border border-border bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-semibold text-china-ink transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-china-red" : ""}`} />
            <span>Làm mới số liệu</span>
          </button>
        </div>
      </div>

      {/* Thông báo thành công hoặc lỗi */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-xs underline cursor-pointer">Đóng</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-xs underline cursor-pointer">Đóng</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-border/80 text-xs font-semibold">
        {[
          { id: "overview", label: "Tổng quan & Tăng trưởng", icon: TrendingUp },
          { id: "users", label: `Người dùng (${metrics?.totalUsers || 0})`, icon: Users },
          { id: "orders", label: `Đơn hàng (${metrics?.totalOrdersCount || 0})`, icon: CreditCard },
          { id: "logs", label: `Nhật ký Logs (${logs.length})`, icon: Terminal },
          { id: "server", label: "Điều khiển Server & Scale", icon: Server },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-slate-900 dark:bg-stone-100 text-white dark:text-slate-900 font-bold"
                  : "text-muted hover:text-china-ink hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: TỔNG QUAN & BIỂU ĐỒ TĂNG TRƯỞNG */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* 4 Cards Chỉ số chính */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Tổng người đăng ký</span>
                <Users className="w-4 h-4 text-china-red" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-china-ink">
                {metrics?.totalUsers.toLocaleString() || 0}
              </div>
              <p className="text-[11px] text-muted">
                {metrics?.freeUsersCount || 0} người dùng gói Miễn phí
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Học viên gói Pro</span>
                <Crown className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">
                {metrics?.activeProCount || 0}
              </div>
              <p className="text-[11px] text-muted">
                Tỷ lệ chuyển đổi:{" "}
                <strong className="text-china-ink">
                  {metrics?.totalUsers ? ((metrics.activeProCount / metrics.totalUsers) * 100).toFixed(1) : 0}%
                </strong>
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Tổng doanh thu</span>
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
                {(metrics?.totalRevenue || 0).toLocaleString("vi-VN")} <span className="text-xs font-normal">đ</span>
              </div>
              <p className="text-[11px] text-muted">
                {metrics?.completedOrdersCount || 0} đơn hàng thành công ({metrics?.pendingOrdersCount || 0} đang chờ)
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Tài nguyên Server</span>
                <Activity className="w-4 h-4 text-china-jade" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-china-ink">
                {serverInfo?.memoryHeapUsedMb || 0} <span className="text-xs font-normal">MB RAM</span>
              </div>
              <p className="text-[11px] text-muted">
                Uptime: {serverInfo ? formatUptime(serverInfo.uptimeSeconds) : "..."} (DB: {serverInfo?.dbQueryTimeMs || 0}ms)
              </p>
            </div>
          </div>

          {/* Biểu đồ số người đăng ký theo ngày */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-china-ink flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-china-red" />
                  <span>Biểu đồ người dùng đăng ký mới (14 ngày qua)</span>
                </h2>
                <p className="text-xs text-muted">Theo dõi tốc độ tăng trưởng học viên hàng ngày để chuẩn bị scale</p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 self-start sm:self-auto">
                Chu kỳ: 14 ngày
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} stroke="#8c857d" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#8c857d" axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as ChartItem
                        return (
                          <div className="p-2.5 rounded-xl bg-card border border-border shadow-md text-xs space-y-1">
                            <div className="font-semibold text-china-ink">Ngày {item.date}</div>
                            <div className="text-china-red font-bold">{item.users} người đăng ký mới</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="users" radius={[4, 4, 0, 0]} fill="#c8102e">
                    {chartData.map((_, i) => (
                      <Cell key={`bar-${i}`} fill="#c8102e" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bảng tư vấn & Dự báo Scaling */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-china-ink flex items-center gap-2">
              <Server className="w-4 h-4 text-china-jade" />
              <span>Chỉ số & Khuyến nghị mở rộng hệ thống (Scaling Guide)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border space-y-1.5">
                <div className="text-xs font-bold text-slate-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-china-red" />
                  <span>Cơ sở dữ liệu (Supabase)</span>
                </div>
                <div className="text-xs text-muted leading-relaxed">
                  Hiện đang có <strong>{metrics?.totalUsers || 0} tài khoản</strong>. Gói Free của Supabase chịu tải tốt tới 50.000 users. Khi chạm mốc 10.000 DAU, hãy bật Transaction Pooler cổng 6543.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border space-y-1.5">
                <div className="text-xs font-bold text-slate-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Âm thanh & TTS Proxy</span>
                </div>
                <div className="text-xs text-muted leading-relaxed">
                  Đang dùng cơ chế LRU RAM Cache và Request Coalescing. Để giảm tải 100% cho server khi có trên 5.000 người nghe cùng lúc, hãy chạy script tải trước audio lên Cloudflare R2.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border space-y-1.5">
                <div className="text-xs font-bold text-slate-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-china-jade" />
                  <span>Bộ nhớ đệm Rate-Limit (Redis)</span>
                </div>
                <div className="text-xs text-muted leading-relaxed">
                  Trạng thái: <strong>{serverInfo?.features.redisConfigured ? "Đã kết nối Upstash Redis" : "Dùng bộ nhớ RAM cục bộ (Tự dọn rác)"}</strong>. Đủ chịu tải cho 1 VPS hoặc môi trường serverless ban đầu.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ NGƯỜI DÙNG */}
      {activeTab === "users" && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-china-ink">Danh sách học viên đăng ký ({filteredUsers.length})</h2>
              <p className="text-xs text-muted">Xem email, trạng thái gói cước và cấp quyền Pro trực tiếp</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm email học viên..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-900/60 border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-china-ink focus:outline-none focus:border-china-red"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 dark:bg-stone-800/80 text-muted uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">Email Học Viên</th>
                  <th className="p-3">Ngày đăng ký</th>
                  <th className="p-3">Đăng nhập gần nhất</th>
                  <th className="p-3">Gói hiện tại</th>
                  <th className="p-3 text-right rounded-r-xl">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((u) => {
                  const isActionRunning = actionLoadingId === u.id
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="p-3 font-medium text-china-ink flex items-center gap-2">
                        <span>{u.email}</span>
                        {u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
                          <span className="px-1.5 py-0.2 rounded bg-china-red/10 text-china-red text-[10px] font-bold">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                      <td className="p-3 text-muted">
                        {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleString("vi-VN") : "Chưa từng"}
                      </td>
                      <td className="p-3">
                        {u.isPro ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[11px] inline-flex items-center gap-1 border border-amber-500/20">
                            <Crown className="w-3 h-3" />
                            <span>Pro ({u.plan})</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-muted font-medium text-[11px]">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleTogglePro(u.id, u.isPro)}
                          disabled={isActionRunning}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                            u.isPro
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                          } disabled:opacity-50`}
                        >
                          {isActionRunning ? "Đang xử lý..." : u.isPro ? "Hạ xuống Free" : "Kích hoạt Pro"}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ĐƠN HÀNG & VIETQR */}
      {activeTab === "orders" && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-china-ink">Lịch sử đơn hàng chuyển khoản ({orders.length})</h2>
            <p className="text-xs text-muted">Đối soát các giao dịch tạo mã VietQR và trạng thái thanh toán</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 dark:bg-stone-800/80 text-muted uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">Mã đơn (Nội dung CK)</th>
                  <th className="p-3">Gói</th>
                  <th className="p-3">Số tiền</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 rounded-r-xl">Thời gian tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map((o) => (
                  <tr key={o.id || o.order_code} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-mono font-bold text-china-ink">{o.order_code}</td>
                    <td className="p-3 capitalize">{o.plan}</td>
                    <td className="p-3 font-bold text-china-ink">
                      {Number(o.amount).toLocaleString("vi-VN")} đ
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === "completed"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                          : o.status === "pending"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                          : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted">
                      {new Date(o.created_at).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: NHẬT KÝ LOGS HỆ THỐNG */}
      {activeTab === "logs" && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-china-ink flex items-center gap-2">
                <Terminal className="w-4 h-4 text-china-red" />
                <span>Nhật ký thời gian thực (Audit Logs)</span>
              </h2>
              <p className="text-xs text-muted">Ghi nhận các sự kiện đăng ký, giao dịch đơn hàng và webhook</p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {["all", "auth", "order", "webhook"].map((f) => (
                <button
                  key={f}
                  onClick={() => setLogFilter(f)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer capitalize ${
                    logFilter === f
                      ? "bg-slate-900 dark:bg-stone-100 text-white dark:text-slate-900"
                      : "bg-stone-100 dark:bg-stone-800 text-muted hover:text-china-ink"
                  }`}
                >
                  {f === "all" ? "Tất cả" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-border bg-stone-50/50 dark:bg-stone-900/40 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      log.level === "success" ? "bg-emerald-500" :
                      log.level === "warn" ? "bg-amber-500" :
                      log.level === "error" ? "bg-rose-500" : "bg-blue-500"
                    }`} />
                    <span className="font-bold text-china-ink">{log.title}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-muted">
                      {log.type}
                    </span>
                  </div>
                  <div className="text-muted truncate">{log.detail}</div>
                </div>

                <span className="text-[11px] text-muted whitespace-nowrap font-mono shrink-0">
                  {new Date(log.createdAt).toLocaleTimeString("vi-VN")} {new Date(log.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ĐIỀU KHIỂN SERVER & RUNTIME */}
      {activeTab === "server" && serverInfo && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-china-ink flex items-center gap-2">
              <Cpu className="w-4 h-4 text-china-red" />
              <span>Thông số phần cứng & Môi trường Runtime</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border space-y-1">
                <span className="text-muted">Hệ điều hành / OS</span>
                <div className="text-sm font-bold text-china-ink uppercase">{serverInfo.platform}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border space-y-1">
                <span className="text-muted">Phiên bản Node.js</span>
                <div className="text-sm font-bold text-china-ink">{serverInfo.nodeVersion}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border space-y-1">
                <span className="text-muted">Bộ nhớ Heap sử dụng</span>
                <div className="text-sm font-bold text-china-ink">
                  {serverInfo.memoryHeapUsedMb} / {serverInfo.memoryHeapTotalMb} MB
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border space-y-1">
                <span className="text-muted">Độ trễ truy vấn Supabase</span>
                <div className="text-sm font-bold text-china-jade">{serverInfo.dbQueryTimeMs} ms</div>
              </div>
            </div>
          </div>

          {/* Kiểm tra cấu hình môi trường bên thứ 3 */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-china-ink flex items-center gap-2">
              <Sliders className="w-4 h-4 text-china-jade" />
              <span>Trạng thái kết nối dịch vụ mở rộng</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-china-ink">Tài khoản ngân hàng VietQR</div>
                  <div className="text-[11px] text-muted">BANK_BIN, BANK_ACCOUNT_NO</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                  serverInfo.features.bankConfigured
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-stone-100 dark:bg-stone-800 text-muted"
                }`}>
                  {serverInfo.features.bankConfigured ? "Đã bật" : "Chưa đặt"}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-china-ink">Webhook đối soát SePay / Casso</div>
                  <div className="text-[11px] text-muted">PAYMENT_WEBHOOK_API_KEY</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                  serverInfo.features.webhookConfigured
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-stone-100 dark:bg-stone-800 text-muted"
                }`}>
                  {serverInfo.features.webhookConfigured ? "Đã bật" : "Chưa đặt"}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-china-ink">Bắn tin báo Telegram Bot</div>
                  <div className="text-[11px] text-muted">TELEGRAM_BOT_TOKEN, CHAT_ID</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                  serverInfo.features.telegramConfigured
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-stone-100 dark:bg-stone-800 text-muted"
                }`}>
                  {serverInfo.features.telegramConfigured ? "Đã bật" : "Chưa đặt"}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-china-ink">Upstash Redis (Rate limiting)</div>
                  <div className="text-[11px] text-muted">UPSTASH_REDIS_REST_URL</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                  serverInfo.features.redisConfigured
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-stone-100 dark:bg-stone-800 text-muted"
                }`}>
                  {serverInfo.features.redisConfigured ? "Đã bật" : "Bộ nhớ RAM"}
                </span>
              </div>
            </div>

            {/* Server Action Button */}
            <div className="pt-2">
              <button
                onClick={handleClearCache}
                disabled={actionLoadingId === "clear_cache"}
                className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${actionLoadingId === "clear_cache" ? "animate-spin" : ""}`} />
                <span>Dọn dẹp bộ nhớ đệm RAM & Giải phóng tài nguyên</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import Link from "next/link"
import type { ReactNode } from "react"

export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"
export const LEGAL_UPDATED = "28/10/2026"

export default function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-full bg-china-paper">
      <header className="border-b border-border bg-white/70 backdrop-blur-xs">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-serif font-bold text-china-red">
            <span className="bg-china-red text-white rounded-lg px-2.5 py-1">学</span>
            HSK Learning
          </Link>
          <Link href="/" className="text-xs font-semibold text-china-ink hover:text-china-red">
            ← Về trang học
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8 pb-16">
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-china-ink">{title}</h1>
        <p className="text-xs text-muted mt-1">Cập nhật lần cuối: {LEGAL_UPDATED}</p>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-china-ink/90 [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-base [&_h2]:text-china-ink [&_h2]:mt-6 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>

        <nav className="mt-10 pt-5 border-t border-border flex flex-wrap gap-4 text-xs text-muted">
          <Link href="/terms" className="hover:text-china-red underline">Điều khoản dịch vụ</Link>
          <Link href="/privacy" className="hover:text-china-red underline">Chính sách bảo mật</Link>
          <Link href="/refund" className="hover:text-china-red underline">Chính sách hoàn tiền</Link>
        </nav>
      </main>
    </div>
  )
}

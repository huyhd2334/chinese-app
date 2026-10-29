import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Supabase client quyền cao (service_role) - CHỈ dùng trong API route phía server.
 * Không bao giờ import file này từ component client ("server-only" sẽ báo lỗi build nếu lỡ làm vậy).
 */
let cached: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!url || !key) return null
  if (!cached) {
    cached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  return cached
}

/** Xác thực Bearer token của user (JWT Supabase) -> trả về user id hoặc null */
export async function getUserFromRequest(req: Request): Promise<{ id: string; email: string | null } | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null
  const auth = req.headers.get("authorization") || ""
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : ""
  if (!token) return null
  const { data, error } = await admin.auth.getUser(token)
  if (error || !data.user) return null
  return { id: data.user.id, email: data.user.email ?? null }
}

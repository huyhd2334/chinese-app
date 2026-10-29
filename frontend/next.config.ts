import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

// Content-Security-Policy ở chế độ REPORT-ONLY: quan sát vi phạm trong DevTools/Console trước,
// sau khi chạy ổn định vài ngày thì đổi key bên dưới thành "Content-Security-Policy" để bật chặn thật.
// Lưu ý: tesseract.js / pdf.js nạp worker + model từ CDN nên cần nằm trong allowlist.
const supabaseHost = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://*.supabase.co").replace(/\/$/, "");
const supabaseWs = supabaseHost.replace(/^https/, "wss");
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://cdn.jsdelivr.net https://unpkg.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.vietqr.io",
  "font-src 'self' data:",
  "media-src 'self' blob: data:",
  `connect-src 'self' blob: data: ${supabaseHost} ${supabaseWs} https://*.supabase.co wss://*.supabase.co https://cdn.jsdelivr.net https://unpkg.com https://tessdata.projectnaptha.com`,
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

securityHeaders.push({
  key: "Content-Security-Policy-Report-Only",
  value: cspReportOnly,
});
securityHeaders.push({
  key: "Cross-Origin-Opener-Policy",
  value: "same-origin-allow-popups", // giữ tương thích đăng nhập Google OAuth popup/redirect
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Service worker phải luôn được kiểm tra bản mới
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        // API không bao giờ được cache ở trình duyệt/CDN (trừ khi route tự đặt header, ví dụ /api/tts)
        source: "/api/payment/(.*)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/content/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/books/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*\\.(?:svg|png|jpg|jpeg|webp|ico|woff2?))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

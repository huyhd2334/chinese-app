import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 })
  }

  // Chỉ cho phép proxy các URL hợp lệ từ các domain âm thanh được tin cậy
  try {
    const parsed = new URL(url)
    if (
      !parsed.hostname.includes("mandarinzone.com") &&
      !parsed.hostname.includes("chinesetest.cn") &&
      !parsed.hostname.includes("github.com") &&
      !parsed.hostname.includes("githubusercontent.com")
    ) {
      return new NextResponse("Host not allowed", { status: 403 })
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    })

    if (!res.ok) {
      return new NextResponse(`Upstream returned ${res.status}`, { status: res.status })
    }

    const contentType = res.headers.get("content-type") || "audio/mpeg"

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error"
    return new NextResponse(message, { status: 500 })
  }
}

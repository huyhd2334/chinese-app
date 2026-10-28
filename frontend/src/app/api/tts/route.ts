import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const text = searchParams.get('text') || ''
  const lang = searchParams.get('lang') || 'zh'

  if (!text.trim()) {
    return new NextResponse('Missing text parameter', { status: 400 })
  }

  // Sanitize text: maximum 200 chars for TTS endpoint
  const cleanText = text.trim().slice(0, 200)

  // Try Youdao Studio TTS first (crisp native pronunciation)
  try {
    const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanText)}&le=${lang === 'en' ? 'en' : 'zh'}`
    const res = await fetch(youdaoUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (res.ok && res.body) {
      const audioBuffer = await res.arrayBuffer()
      if (audioBuffer.byteLength > 200) {
        return new NextResponse(audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=604800, immutable',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    }
  } catch (err) {
    console.warn('Youdao TTS failed, trying Google fallback:', err)
  }

  // Fallback to Google Translate TTS
  try {
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${lang === 'en' ? 'en' : 'zh-CN'}&client=tw-ob`
    const gRes = await fetch(googleUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (gRes.ok && gRes.body) {
      const gBuffer = await gRes.arrayBuffer()
      return new NextResponse(gBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=604800, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
  } catch (gErr) {
    console.warn('Google TTS failed:', gErr)
  }

  return new NextResponse('TTS audio unavailable', { status: 502 })
}

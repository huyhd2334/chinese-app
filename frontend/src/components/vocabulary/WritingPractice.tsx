"use client"

import React, { useEffect, useRef, useState } from "react"

interface WritingPracticeProps {
  hanzi: string
}

type Point = [number, number]
type Stroke = Point[]

interface WritingData {
  character: string
  strokes: string[]
  medians: Point[][]
}

const CANVAS_SIZE = 500
const NORMALIZE_POINTS = 40

const WritingPractice = ({ hanzi }: WritingPracticeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const currentStroke = useRef<Stroke>([])
  const strokesRef = useRef<Stroke[]>([])

  const [selectedChar, setSelectedChar] = useState(hanzi[0] ?? "")
  const [writingData, setWritingData] =
    useState<WritingData | null>(null)

  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [drawing, setDrawing] = useState(false)
  const [loading, setLoading] = useState(true)

  const [score, setScore] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  const characters = [...hanzi]

  // =========================================================
  // CANVAS
  // =========================================================

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(
      0,
      0,
      CANVAS_SIZE,
      CANVAS_SIZE
    )

    currentStroke.current = []
    strokesRef.current = []

    setStrokes([])
    setScore(null)
    setMessage("")
  }

  useEffect(() => {
    const loadWritingData = async () => {
      try {
        setLoading(true)
        setWritingData(null)

        const res = await fetch(
          "/content/writing.json"
        )

        if (!res.ok) {
          throw new Error(
            "Cannot load writing.json"
          )
        }

        const data = await res.json()

        const characterData =
          data[selectedChar]

        if (!characterData) {
          console.warn(
            `No writing data for ${selectedChar}`
          )
          return
        }

        setWritingData(characterData)
      } catch (error) {
        console.error(
          "Load writing data error:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadWritingData()
  }, [selectedChar])

  useEffect(() => {
    clearCanvas()
  }, [selectedChar])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#111"
  }, [])

  // =========================================================
  // POINTER
  // =========================================================

  const getPoint = (
    e: React.PointerEvent<HTMLCanvasElement>
  ): Point | null => {
    const canvas = canvasRef.current

    if (!canvas) return null

    const rect =
      canvas.getBoundingClientRect()

    return [
      ((e.clientX - rect.left) /
        rect.width) *
        CANVAS_SIZE,

      ((e.clientY - rect.top) /
        rect.height) *
        CANVAS_SIZE
    ]
  }

  const startDrawing = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const point = getPoint(e)

    if (!point) return

    canvas.setPointerCapture(
      e.pointerId
    )

    currentStroke.current = [point]

    const ctx = canvas.getContext("2d")

    if (!ctx) return

    ctx.beginPath()

    ctx.moveTo(
      point[0],
      point[1]
    )

    setDrawing(true)
  }

  const draw = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!drawing) return

    const point = getPoint(e)

    if (!point) return

    const ctx =
      canvasRef.current?.getContext("2d")

    if (!ctx) return

    currentStroke.current.push(point)

    ctx.lineTo(
      point[0],
      point[1]
    )

    ctx.stroke()
  }

  const stopDrawing = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!drawing) return

    const stroke = [
      ...currentStroke.current
    ]

    if (stroke.length >= 2) {
      const newStrokes = [
        ...strokesRef.current,
        stroke
      ]

      strokesRef.current =
        newStrokes

      setStrokes(newStrokes)

      console.log(
        "Stroke added:",
        stroke.length
      )

      console.log(
        "Total strokes:",
        newStrokes.length
      )
    }

    currentStroke.current = []

    setDrawing(false)

    try {
      canvasRef.current?.releasePointerCapture(
        e.pointerId
      )
    } catch {}
  }

  // =========================================================
  // GEOMETRY
  // =========================================================

  const distance = (
    a?: Point,
    b?: Point
  ): number => {
    if (!a || !b) {
      return Infinity
    }

    const dx =
      a[0] - b[0]

    const dy =
      a[1] - b[1]

    return Math.sqrt(
      dx * dx + dy * dy
    )
  }

  const strokeLength = (
    stroke: Stroke
  ): number => {
    let total = 0

    for (
      let i = 1;
      i < stroke.length;
      i++
    ) {
      total += distance(
        stroke[i - 1],
        stroke[i]
      )
    }

    return total
  }

  // =========================================================
  // RESAMPLE STROKE
  // =========================================================

  const normalizeStroke = (
    stroke: Stroke,
    count = NORMALIZE_POINTS
  ): Stroke => {
    if (stroke.length < 2) {
      return []
    }

    const result: Stroke = []

    for (
      let i = 0;
      i < count;
      i++
    ) {
      const t =
        i / (count - 1)

      const index =
        t *
        (stroke.length - 1)

      const left =
        Math.floor(index)

      const right =
        Math.min(
          left + 1,
          stroke.length - 1
        )

      const ratio =
        index - left

      const x =
        stroke[left][0] +
        (
          stroke[right][0] -
          stroke[left][0]
        ) *
          ratio

      const y =
        stroke[left][1] +
        (
          stroke[right][1] -
          stroke[left][1]
        ) *
          ratio

      result.push([x, y])
    }

    return result
  }

  // =========================================================
  // TRANSLATION NORMALIZATION
  //
  // Đưa stroke về cùng điểm bắt đầu.
  //
  // Điều này giúp:
  //
  // User viết lệch vị trí
  //        ↓
  // không bị mất quá nhiều điểm
  // =========================================================

  const alignStrokeToStart = (
    stroke: Stroke
  ): Stroke => {
    if (!stroke.length) {
      return []
    }

    const start = stroke[0]

    return stroke.map(
      ([x, y]) => [
        x - start[0],
        y - start[1]
      ]
    )
  }

  // =========================================================
  // SCALE NORMALIZATION
  //
  // Nếu user viết chữ hơi to / nhỏ
  // vẫn có thể đạt điểm cao.
  // =========================================================

  const scaleStroke = (
    stroke: Stroke
  ): Stroke => {
    if (!stroke.length) {
      return []
    }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const [x, y] of stroke) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)

      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }

    const width =
      maxX - minX

    const height =
      maxY - minY

    const size =
      Math.max(
        width,
        height,
        1
      )

    return stroke.map(
      ([x, y]) => [
        ((x - minX) / size) *
          100,

        ((y - minY) / size) *
          100
      ]
    )
  }

  // =========================================================
  // SHAPE SCORE
  // =========================================================

  const shapeScore = (
    user: Stroke,
    expected: Stroke
  ): number => {
    if (
      user.length < 2 ||
      expected.length < 2
    ) {
      return 0
    }

    const userNorm =
      normalizeStroke(user)

    const expectedNorm =
      normalizeStroke(expected)

    if (
      !userNorm.length ||
      !expectedNorm.length
    ) {
      return 0
    }

    /*
     * Đưa về cùng scale.
     *
     * Ví dụ:
     *
     * User:
     * 50px
     *
     * Expected:
     * 80px
     *
     * Không nên coi đó là hình dạng hoàn toàn khác.
     */

    const userScaled =
      scaleStroke(
        userNorm
      )

    const expectedScaled =
      scaleStroke(
        expectedNorm
      )

    /*
     * Đưa điểm đầu về (0,0)
     */

    const userAligned =
      alignStrokeToStart(
        userScaled
      )

    const expectedAligned =
      alignStrokeToStart(
        expectedScaled
      )

    let total = 0

    for (
      let i = 0;
      i < userAligned.length;
      i++
    ) {
      total += distance(
        userAligned[i],
        expectedAligned[i]
      )
    }

    const average =
      total /
      userAligned.length

    /*
     * Threshold dựa trên
     * hệ tọa độ 0 -> 100
     */

    if (average < 3) return 100
    if (average < 5) return 95
    if (average < 8) return 90
    if (average < 12) return 85
    if (average < 16) return 75
    if (average < 22) return 65
    if (average < 30) return 50
    if (average < 40) return 35

    return 20
  }

  // =========================================================
  // START / END SCORE
  // =========================================================

  const startEndScore = (
    user: Stroke,
    expected: Stroke
  ): number => {
    if (
      user.length < 2 ||
      expected.length < 2
    ) {
      return 0
    }

    const userNorm =
      normalizeStroke(user)

    const expectedNorm =
      normalizeStroke(expected)

    if (
      !userNorm.length ||
      !expectedNorm.length
    ) {
      return 0
    }

    /*
     * Scale về 100x100
     */

    const userScaled =
      scaleStroke(userNorm)

    const expectedScaled =
      scaleStroke(expectedNorm)

    /*
     * Vì shape đã được normalize,
     * start/end không dùng tọa độ tuyệt đối.
     */

    const startDistance =
      distance(
        userScaled[0],
        expectedScaled[0]
      )

    const userEnd =
      userScaled[
        userScaled.length - 1
      ]

    const expectedEnd =
      expectedScaled[
        expectedScaled.length - 1
      ]

    const endDistance =
      distance(
        userEnd,
        expectedEnd
      )

    const startScore =
      Math.max(
        0,
        100 -
          startDistance * 2
      )

    const endScore =
      Math.max(
        0,
        100 -
          endDistance * 2
      )

    return (
      startScore +
      endScore
    ) / 2
  }

  // =========================================================
  // DIRECTION SCORE
  //
  // Kiểm tra hướng đi của nét.
  // =========================================================

  const directionScore = (
    user: Stroke,
    expected: Stroke
  ): number => {
    if (
      user.length < 2 ||
      expected.length < 2
    ) {
      return 0
    }

    const userNorm =
      normalizeStroke(
        user,
        10
      )

    const expectedNorm =
      normalizeStroke(
        expected,
        10
      )

    let total = 0
    let count = 0

    for (
      let i = 1;
      i < userNorm.length;
      i++
    ) {
      const userDx =
        userNorm[i][0] -
        userNorm[i - 1][0]

      const userDy =
        userNorm[i][1] -
        userNorm[i - 1][1]

      const expectedDx =
        expectedNorm[i][0] -
        expectedNorm[i - 1][0]

      const expectedDy =
        expectedNorm[i][1] -
        expectedNorm[i - 1][1]

      const userLen =
        Math.sqrt(
          userDx * userDx +
          userDy * userDy
        )

      const expectedLen =
        Math.sqrt(
          expectedDx *
            expectedDx +
          expectedDy *
            expectedDy
        )

      if (
        userLen === 0 ||
        expectedLen === 0
      ) {
        continue
      }

      const dot =
        (userDx *
          expectedDx +
          userDy *
            expectedDy) /
        (userLen *
          expectedLen)

      /*
       * dot:
       *
       *  1  = cùng hướng
       *  0  = vuông góc
       * -1  = ngược hướng
       */

      const similarity =
        ((dot + 1) / 2) *
        100

      total += similarity
      count++
    }

    if (count === 0) {
      return 0
    }

    return total / count
  }

  // =========================================================
  // CHECK
  // =========================================================

  const handleCheck = () => {
    const userStrokes =
      strokesRef.current.filter(
        stroke =>
          stroke.length >= 2
      )

    console.log(
      "================================="
    )

    console.log(
      "CHECK USER STROKES"
    )

    console.log(
      "Character:",
      selectedChar
    )

    console.log(
      "User strokes:",
      userStrokes
    )

    console.log(
      "================================="
    )

    if (!writingData) {
      setMessage(
        "Không có dữ liệu viết cho chữ này."
      )

      return
    }

    if (!userStrokes.length) {
      setMessage(
        "Bạn chưa viết chữ."
      )

      setScore(null)

      return
    }

    const expectedStrokes =
      writingData.medians.filter(
        stroke =>
          stroke.length >= 2
      )

    if (!expectedStrokes.length) {
      setMessage(
        "Dữ liệu nét chữ không hợp lệ."
      )

      return
    }

    // =====================================================
    // STROKE COUNT
    // =====================================================

    const userCount =
      userStrokes.length

    const expectedCount =
      expectedStrokes.length

    const strokeDifference =
      Math.abs(
        userCount -
          expectedCount
      )

    let strokeCountScore = 100

    if (
      strokeDifference === 1
    ) {
      strokeCountScore = 75
    } else if (
      strokeDifference === 2
    ) {
      strokeCountScore = 50
    } else if (
      strokeDifference === 3
    ) {
      strokeCountScore = 30
    } else if (
      strokeDifference >= 4
    ) {
      strokeCountScore = 0
    }

    // =====================================================
    // COMPARE
    // =====================================================

    const compareCount =
      Math.min(
        userCount,
        expectedCount
      )

    let shapeTotal = 0
    let startEndTotal = 0
    let directionTotal = 0

    for (
      let i = 0;
      i < compareCount;
      i++
    ) {
      const userStroke =
        userStrokes[i]

      const expectedStroke =
        expectedStrokes[i]

      if (
        !userStroke ||
        !expectedStroke
      ) {
        continue
      }

      const shape =
        shapeScore(
          userStroke,
          expectedStroke
        )

      const startEnd =
        startEndScore(
          userStroke,
          expectedStroke
        )

      const direction =
        directionScore(
          userStroke,
          expectedStroke
        )

      console.log(
        `Stroke ${i + 1}`
      )

      console.log(
        "Shape:",
        shape
      )

      console.log(
        "Start/end:",
        startEnd
      )

      console.log(
        "Direction:",
        direction
      )

      shapeTotal += shape
      startEndTotal += startEnd
      directionTotal += direction
    }

    if (compareCount > 0) {
      shapeTotal /=
        compareCount

      startEndTotal /=
        compareCount

      directionTotal /=
        compareCount
    }

    // =====================================================
    // FINAL SCORE
    // =====================================================

    /*
     * Shape:     55%
     * Direction: 20%
     * Start/end: 10%
     * Count:     15%
     */

    const finalScore =
      Math.round(
        shapeTotal * 0.55 +
        directionTotal * 0.20 +
        startEndTotal * 0.10 +
        strokeCountScore * 0.15
      )

    const final =
      Math.max(
        0,
        Math.min(
          100,
          finalScore
        )
      )

    setScore(final)

    // =====================================================
    // MESSAGE
    // =====================================================

    if (final >= 90) {
      setMessage(
        "Excellent! 🎉"
      )
    } else if (final >= 75) {
      setMessage(
        "Good job! 👍"
      )
    } else if (final >= 50) {
      setMessage(
        "Keep practicing! 💪"
      )
    } else {
      setMessage(
        "Try again!"
      )
    }

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      "================================="
    )

    console.log(
      "FINAL RESULT"
    )

    console.log({
      character: selectedChar,

      userStrokes:
        userCount,

      expectedStrokes:
        expectedCount,

      strokeCountScore,

      shapeScore:
        shapeTotal,

      startEndScore:
        startEndTotal,

      directionScore:
        directionTotal,

      finalScore: final
    })

    console.log(
      "================================="
    )
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mt-8">
        Loading writing data...
      </div>
    )
  }

  // =========================================================
  // NO DATA
  // =========================================================

  if (!writingData) {
    return (
      <div className="mt-8">
        <p className="text-red-500">
          Không tìm thấy dữ liệu cho "
          {selectedChar}"
        </p>
      </div>
    )
  }

  // =========================================================
  // UI
  // =========================================================

  const expectedCount =
    writingData.medians.filter(
      stroke =>
        stroke.length >= 2
    ).length

  return (
    <div className="mt-8">

      {/* CHARACTER SELECTOR */}

      <div className="mb-6 flex flex-wrap items-center gap-3">

        <div className="flex flex-wrap gap-2">

          {characters.map(char => (
            <button
              key={char}
              onClick={() =>
                setSelectedChar(char)
              }
              className={`rounded-lg border px-4 py-2 text-3xl ${
                selectedChar === char
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {char}
            </button>
          ))}

        </div>

        {/* STROKE COUNT */}

        <div className="text-sm text-gray-500">
          Strokes:{" "}
          {strokes.length} /{" "}
          {expectedCount}
        </div>

        {/* SCORE */}

        {score !== null && (
          <div className="text-xl font-bold">
            Score: {score}/100
          </div>
        )}

        {/* MESSAGE */}

        {message && (
          <div className="text-sm">
            {message}
          </div>
        )}

        {/* CLEAR */}

        <button
          onClick={clearCanvas}
          className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
        >
          Clear
        </button>

        {/* CHECK */}

        <button
          onClick={handleCheck}
          className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
        >
          Check
        </button>

      </div>

      {/* TITLE */}

      <h2 className="mb-4 text-2xl font-semibold">
        Practice: {selectedChar}
      </h2>

      {/* CANVAS */}

      <div className="relative aspect-square w-full max-w-[500px]">

        {/* GUIDE CHARACTER */}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">

          <span className="text-[min(60vw,300px)] leading-none text-gray-200">
            {selectedChar}
          </span>

        </div>

        {/* DRAWING CANVAS */}

        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="relative h-full w-full touch-none rounded-xl border-2 border-gray-300 bg-transparent"
          onPointerDown={
            startDrawing
          }
          onPointerMove={
            draw
          }
          onPointerUp={
            stopDrawing
          }
          onPointerCancel={
            stopDrawing
          }
        />

      </div>

    </div>
  )
}

export default WritingPractice
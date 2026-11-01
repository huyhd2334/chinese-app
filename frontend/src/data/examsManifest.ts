export interface ExamMeta {
  id: string
  title: string
  level: number
  code: string
  questions: number
  timeMinutes: number
  sourceFile: string
  type: "standard" | "hsk4_mock"
  sections: {
    listening: number
    reading: number
    writing: number
  }
}

export const ALL_EXAMS: ExamMeta[] = [
  // --- HSK 1 ---
  {
    id: "hsk1_01",
    title: "HSK 1 Mock Exam 01",
    level: 1,
    code: "H1-01",
    questions: 40,
    timeMinutes: 40,
    sourceFile: "/content/published_exams/hsk1-exam-01.json",
    type: "standard",
    sections: { listening: 20, reading: 20, writing: 0 }
  },
  // --- HSK 2 ---
  {
    id: "hsk2_01",
    title: "HSK 2 Mock Exam 01",
    level: 2,
    code: "H2-01",
    questions: 60,
    timeMinutes: 55,
    sourceFile: "/content/published_exams/hsk2-exam-01.json",
    type: "standard",
    sections: { listening: 35, reading: 25, writing: 0 }
  },
  // --- HSK 3 ---
  {
    id: "hsk3_01",
    title: "HSK 3 Mock Exam 01",
    level: 3,
    code: "H3-01",
    questions: 70,
    timeMinutes: 90,
    sourceFile: "/content/published_exams/hsk3-exam-01.json",
    type: "standard",
    sections: { listening: 35, reading: 25, writing: 10 }
  },
  // --- HSK 5 (Đề chuẩn đã giải phóng bản quyền & có giải thích) ---
  {
    id: "hsk5_01",
    title: "HSK 5 Full Simulation 01",
    level: 5,
    code: "H5-01",
    questions: 72,
    timeMinutes: 125,
    sourceFile: "/content/published_exams/hsk5-exam-01.json",
    type: "standard",
    sections: { listening: 36, reading: 26, writing: 10 }
  },
  // --- HSK 6 ---
  {
    id: "hsk6_01",
    title: "HSK 6 Full Simulation 01",
    level: 6,
    code: "H6-01",
    questions: 82,
    timeMinutes: 140,
    sourceFile: "/content/published_exams/hsk6-exam-01.json",
    type: "standard",
    sections: { listening: 40, reading: 32, writing: 10 }
  },
  // --- HSK 4 (19 đề luyện tập chuyên sâu) ---
  ...Array.from({ length: 19 }, (_, i) => {
    const num = i + 1
    const pad = num < 10 ? "0" + num : "" + num
    return {
      id: `hsk4_${pad}`,
      title: `HSK 4 Mock Exam ${pad}`,
      level: 4,
      code: `H4-${pad}`,
      questions: num === 4 ? 99 : num === 7 ? 76 : 100,
      timeMinutes: 105,
      sourceFile: `/content/hsk4_exams/test-${pad}.json`,
      type: "hsk4_mock" as const,
      sections: { listening: 45, reading: 40, writing: 15 }
    }
  })
]

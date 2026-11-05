import { BookCourse, CurriculumLesson } from "@/types/curriculum"
import { NEW_HSK1_ALL_LESSONS } from "./newHsk1Lessons"
import { NEW_HSK2_ALL_LESSONS } from "./newHsk2Lessons"
import { NEW_HSK3_ALL_LESSONS } from "./newHsk3Lessons"

export const PRESET_BOOKS: BookCourse[] = [
  {
    id: "new_hsk1_standard",
    title: "Giáo trình HSK 1 (Chuẩn 3.0)",
    chineseTitle: "新HSK教程 1 (3.0)",
    level: 1,
    description: "15 bài học căn bản với 300 từ vựng cốt lõi, 40 điểm ngữ pháp, hội thoại thực tế và bài tập đọc - nghe.",
    totalLessons: 15,
    badge: "HSK 1",
    colorTheme: "from-rose-600 to-red-700",
    coverImage: "/books/hsk1_30.jpg",
  },
  {
    id: "new_hsk2_standard",
    title: "Giáo trình HSK 2 (Chuẩn 3.0)",
    chineseTitle: "新HSK教程 2 (3.0)",
    level: 2,
    description: "15 bài học với 300 từ vựng mở rộng, ngữ pháp trọng điểm, bài đọc hiểu và luyện nghe hội thoại.",
    totalLessons: 15,
    badge: "HSK 2",
    colorTheme: "from-emerald-600 to-teal-700",
    coverImage: "/books/hsk2_30.jpg",
  },
  {
    id: "new_hsk3_standard",
    title: "Giáo trình HSK 3 (Chuẩn 3.0)",
    chineseTitle: "新HSK教程 3 (3.0)",
    level: 3,
    description: "18 bài học với 400 từ vựng, câu chữ 把, 被, bổ ngữ xu hướng và bài khóa nâng cao.",
    totalLessons: 18,
    badge: "HSK 3",
    colorTheme: "from-amber-600 to-orange-700",
    coverImage: "/books/hsk3_30.jpg",
  },
  {
    id: "hsk4_standard",
    title: "Giáo trình Chuẩn HSK 4",
    chineseTitle: "HSK 标准教程 4",
    level: 4,
    description: "20 bài học mở rộng 1200 từ vựng, diễn đạt mạch lạc theo các chủ đề đời sống và công việc.",
    totalLessons: 20,
    badge: "HSK 4",
    colorTheme: "from-rose-600 to-pink-700",
    coverImage: "/books/hsk4.jpg",
  },
  {
    id: "hsk5_standard",
    title: "Giáo trình Chuẩn HSK 5",
    chineseTitle: "HSK 标准教程 5",
    level: 5,
    description: "36 bài học với 2500 từ vựng, đọc hiểu báo chí, văn bản chuyên đề và giao tiếp nâng cao.",
    totalLessons: 36,
    badge: "HSK 5",
    colorTheme: "from-cyan-700 to-blue-800",
    coverImage: "/books/hsk5.jpg",
  },
  {
    id: "hsk6_standard",
    title: "Giáo trình Chuẩn HSK 6",
    chineseTitle: "HSK 标准教程 6",
    level: 6,
    description: "40 bài học với 5000 từ vựng chuyên sâu, làm chủ văn phong học thuật và văn chương.",
    totalLessons: 40,
    badge: "HSK 6",
    colorTheme: "from-slate-700 to-zinc-900",
    coverImage: "/books/hsk6.jpg",
  },
]

export const PRESET_LESSONS: Record<string, CurriculumLesson[]> = {
  hsk1_standard: NEW_HSK1_ALL_LESSONS,
  new_hsk1_standard: NEW_HSK1_ALL_LESSONS,
  hsk2_standard: NEW_HSK2_ALL_LESSONS,
  new_hsk2_standard: NEW_HSK2_ALL_LESSONS,
  hsk3_standard: NEW_HSK3_ALL_LESSONS,
  new_hsk3_standard: NEW_HSK3_ALL_LESSONS,
}

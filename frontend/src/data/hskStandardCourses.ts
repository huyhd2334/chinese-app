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
]

export const PRESET_LESSONS: Record<string, CurriculumLesson[]> = {
  hsk1_standard: NEW_HSK1_ALL_LESSONS,
  new_hsk1_standard: NEW_HSK1_ALL_LESSONS,
  hsk2_standard: NEW_HSK2_ALL_LESSONS,
  new_hsk2_standard: NEW_HSK2_ALL_LESSONS,
  hsk3_standard: NEW_HSK3_ALL_LESSONS,
  new_hsk3_standard: NEW_HSK3_ALL_LESSONS,
}

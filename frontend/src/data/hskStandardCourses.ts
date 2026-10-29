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
    description: "Bộ giáo trình HSK 3.0 mới nhất gồm 15 bài học, 300 từ vựng cốt lõi, 40 điểm ngữ pháp, bài khóa hội thoại thực tế, đoạn văn đọc hiểu và bài luyện nghe chuẩn kỳ thi HSK 3.0.",
    totalLessons: 15,
    badge: "HSK 3.0 Mới",
    colorTheme: "from-rose-600 to-red-700",
    coverImage: "/books/hsk1.jpg",
  },
  {
    id: "new_hsk2_standard",
    title: "Giáo trình HSK 2 (Chuẩn 3.0)",
    chineseTitle: "新HSK教程 2 (3.0)",
    level: 2,
    description: "Bộ giáo trình HSK 3.0 mới nhất gồm 15 bài học với 300 từ vựng nâng cao, điểm ngữ pháp trọng điểm, bài khóa thực tế, bài đọc hiểu và luyện nghe chuyên sâu chuẩn HSK 3.0.",
    totalLessons: 15,
    badge: "HSK 3.0 Mới",
    colorTheme: "from-emerald-600 to-teal-700",
    coverImage: "/books/hsk2.jpg",
  },
  {
    id: "new_hsk3_standard",
    title: "Giáo trình HSK 3 (Chuẩn 3.0)",
    chineseTitle: "新HSK教程 3 (3.0)",
    level: 3,
    description: "Bộ giáo trình HSK 3.0 mới nhất gồm 18 bài học chuyên sâu với hơn 400 từ vựng, câu chữ 把, 被, bổ ngữ xu hướng, bài đọc hiểu và luyện nghe đa dạng chuẩn HSK 3.0.",
    totalLessons: 18,
    badge: "HSK 3.0 Mới",
    colorTheme: "from-amber-600 to-orange-700",
    coverImage: "/books/hsk3.jpg",
  },
  {
    id: "hsk4_standard",
    title: "Giáo trình Chuẩn HSK 4",
    chineseTitle: "HSK 标准教程 4",
    level: 4,
    description: "Bàn luận sâu về các chủ đề xã hội, đọc hiểu tin tức báo chí và diễn đạt mạch lạc với 1200 từ vựng (20 bài học).",
    totalLessons: 20,
    badge: "Trung cấp 2",
    colorTheme: "from-rose-600 to-pink-700",
    coverImage: "/books/hsk4.jpg",
  },
  {
    id: "hsk5_standard",
    title: "Giáo trình Chuẩn HSK 5",
    chineseTitle: "HSK 标准教程 5",
    level: 5,
    description: "Đọc báo chí, thưởng thức phim ảnh tiếng Trung, thuyết trình chuyên đề chuyên sâu với 2500 từ vựng (36 bài học).",
    totalLessons: 36,
    badge: "Cao cấp",
    colorTheme: "from-cyan-700 to-blue-800",
    coverImage: "/books/hsk5.jpg",
  },
  {
    id: "hsk6_standard",
    title: "Giáo trình Chuẩn HSK 6",
    chineseTitle: "HSK 标准教程 6",
    level: 6,
    description: "Làm chủ 5000+ từ vựng học thuật, văn chương và đàm phán thương mại chuyên nghiệp như người bản xứ (40 bài học).",
    totalLessons: 40,
    badge: "Chuyên gia",
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

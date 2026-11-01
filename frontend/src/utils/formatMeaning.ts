import { Word } from "../../db/database"

const COMMON_EN_VI_FALLBACK: Record<string, string> = {
  bread: "bánh mì",
  apple: "quả táo",
  water: "nước",
  tea: "trà",
  coffee: "cà phê",
  book: "sách",
  friend: "bạn bè",
  student: "học sinh",
  teacher: "giáo viên",
  doctor: "bác sĩ",
  eat: "ăn",
  drink: "uống",
  read: "đọc",
  write: "viết",
  see: "nhìn, xem",
  listen: "nghe",
  speak: "nói",
  go: "đi",
  come: "đến",
  buy: "mua",
  sell: "bán",
  big: "to, lớn",
  small: "nhỏ, bé",
  good: "tốt, hay",
  bad: "xấu, tồi",
  cat: "con mèo",
  dog: "con chó",
  hospital: "bệnh viện",
  school: "trường học",
  money: "tiền",
  time: "thời gian",
  today: "hôm nay",
  tomorrow: "ngày mai",
  yesterday: "hôm qua",
  year: "năm",
  month: "tháng",
  day: "ngày",
  father: "bố, cha",
  mother: "mẹ",
  brother: "anh/em trai",
  sister: "chị/em gái",
}

/**
 * Lấy nghĩa tiếng Việt ngắn gọn, súc tích (1-2 nghĩa chính), loại bỏ các giải thích dài dòng.
 */
export function getShortMeaningVi(word?: Partial<Word> | null, maxItems = 2): string {
  if (!word) return ""

  // 1. Ưu tiên meanings_vi nếu có
  if (word.meanings_vi && word.meanings_vi.length > 0) {
    const cleanList = word.meanings_vi
      .map((m) => m.trim())
      .filter((m) => m && !m.startsWith("lượng từ cho một số đồ") && !m.startsWith("thán từ dùng để"))

    const picked = (cleanList.length > 0 ? cleanList : word.meanings_vi)
      .slice(0, maxItems)
      .map((m) => {
        // Cắt gọn các chú thích trong ngoặc đơn dài để ngắn gọn
        return m.replace(/\s*\([^)]*\)/g, "").trim() || m
      })
      .filter(Boolean)

    if (picked.length > 0) {
      return picked.join("; ")
    }
  }

  // 2. Fallback nếu IndexedDB chưa kịp nạp meanings_vi
  if (word.meanings && word.meanings.length > 0) {
    const enFirst = word.meanings[0].trim().toLowerCase()
    if (COMMON_EN_VI_FALLBACK[enFirst]) {
      return COMMON_EN_VI_FALLBACK[enFirst]
    }
    // Lấy 1 nghĩa đầu tiên ngắn gọn
    return word.meanings.slice(0, 1).join("; ")
  }

  return ""
}

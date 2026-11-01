import { GrammarPoint } from "@/types/grammar"

// 1. Structure terminology dictionary
export function translateStructure(str: string): string {
  if (!str) return ""
  return str
    .replace(/Subj\./g, "Chủ ngữ")
    .replace(/\bSubj\b/g, "Chủ ngữ")
    .replace(/\bSubject\b/g, "Chủ ngữ")
    .replace(/\bVerb Phrase\b/g, "Cụm ĐT")
    .replace(/\bVP\b/g, "Cụm ĐT")
    .replace(/\bVerb\b/g, "Động từ")
    .replace(/Obj\./g, "Tân ngữ")
    .replace(/\bObj\b/g, "Tân ngữ")
    .replace(/\bObject\b/g, "Tân ngữ")
    .replace(/Adj\./g, "Tính từ")
    .replace(/\bAdj\b/g, "Tính từ")
    .replace(/\bAdjective\b/g, "Tính từ")
    .replace(/\bNoun Phrase\b/g, "Cụm danh từ")
    .replace(/\bNominal Phrase\b/g, "Cụm danh từ")
    .replace(/\bNP\b/g, "Cụm danh từ")
    .replace(/\bNoun\b/g, "Danh từ")
    .replace(/\bPlace Phrase\b/g, "Nơi chốn")
    .replace(/\bPlace\b/g, "Nơi chốn")
    .replace(/\bTime Phrase\b/g, "Thời gian")
    .replace(/\bTime\b/g, "Thời gian")
    .replace(/\bClause\b/g, "Mệnh đề")
    .replace(/\bReason\b/g, "Nguyên nhân")
    .replace(/\bResult\b/g, "Kết quả")
    .replace(/\bCondition\b/g, "Điều kiện")
    .replace(/\bNumber\b/g, "Số từ")
    .replace(/\bMeasure Word\b/g, "Lượng từ")
    .replace(/\bMW\b/g, "Lượng từ")
    .replace(/\bClassifier\b/g, "Lượng từ")
    .replace(/\bPronoun\b/g, "Đại từ")
    .replace(/\bPreposition\b/g, "Giới từ")
    .replace(/\bAdverb\b/g, "Phó từ")
    .replace(/Adv\./g, "Phó từ")
    .replace(/\bPredicate\b/g, "Vị ngữ")
    .replace(/\bhow\b/g, "mức độ")
}

// 2. Used For dictionary
const USED_FOR_MAP: Record<string, string> = {
  "describing actions": "miêu tả hành động",
  "indicating conditions": "chỉ trạng thái / điều kiện",
  "referring to the present": "biểu thị thời hiện tại",
  "referring to the past": "biểu thị sự việc trong quá khứ",
  "referring to the future": "biểu thị sự việc trong tương lai",
  "expressing possession": "biểu thị sự sở hữu",
  "connecting ideas": "liên kết các vế câu và ý tưởng",
  "adding more explanation": "bổ sung thêm giải thích",
  "expressing similarity": "biểu thị sự giống nhau, tương đồng",
  "making comparisons": "so sánh hơn, kém hoặc bằng",
  "expressing passive": "biểu thị thể bị động",
  "disposal sentence": "câu xử lý tân ngữ (câu chữ 把)",
  "indicating purpose": "biểu thị mục đích thực hiện",
  "expressing contrast": "biểu thị sự đối lập, tương phản",
  "softening tone": "làm dịu ngữ khí, lịch sự nhẹ nhàng",
  "expressing degree": "biểu thị mức độ (rất, cực kỳ, quá...)",
  "indicating change": "biểu thị sự thay đổi trạng thái",
  "expressing obligation": "biểu thị sự bắt buộc, bổn phận",
  "expressing permission": "biểu thị sự cho phép",
  "asking questions": "dùng để đặt câu hỏi",
  "expressing time": "biểu thị thời gian",
  "expressing frequency": "biểu thị tần suất",
  "giving commands": "đưa ra mệnh lệnh hoặc yêu cầu",
  "expressing ability": "biểu thị năng lực hoặc kỹ năng",
  "expressing possibility": "biểu thị khả năng xảy ra",
  "expressing negation": "biểu thị ý phủ định",
  "negating": "phủ định",
  "denying and refusing": "từ chối và bác bỏ",
  "negating, denying and refusing": "phủ định, từ chối và bác bỏ",
  "expressing emphasis": "nhấn mạnh ngữ khí hoặc thông tin",
  "expressing cause and effect": "biểu thị nguyên nhân - kết quả",
  "expressing condition": "biểu thị điều kiện giả định",
  "general": "ngữ pháp trọng điểm HSK",
}

export function translateUsedFor(str: string): string {
  if (!str) return "ngữ pháp trọng điểm HSK"
  const parts = str.split(",").map((s) => s.trim().toLowerCase())
  const viParts = parts.map((p) => USED_FOR_MAP[p] || p)
  return viParts.join(", ")
}

// 3. Title Vietnamese Translator
export function translateTitle(title: string): string {
  if (!title) return ""
  const t = title.trim()

  if (/^Expressing actions in progress with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing actions in progress with\s+(.*)$/i, 'Biểu thị hành động đang diễn ra với "$1"')
  }
  if (/^Expressing existence in a place with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing existence in a place with\s+(.*)$/i, 'Biểu thị sự tồn tại ở địa điểm với "$1"')
  }
  if (/^Expressing possession with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing possession with\s+(.*)$/i, 'Biểu thị sở hữu với "$1"')
  }
  if (/^Connecting nouns with\s+(.*)$/i.test(t)) {
    return t.replace(/^Connecting nouns with\s+(.*)$/i, 'Nối danh từ với "$1"')
  }
  if (/^Connecting sentences with\s+(.*)$/i.test(t)) {
    return t.replace(/^Connecting sentences with\s+(.*)$/i, 'Liên kết câu với "$1"')
  }
  if (/^Negation of\s+(.*?)\s+with\s+(.*)$/i.test(t)) {
    return t.replace(/^Negation of\s+(.*?)\s+with\s+(.*)$/i, 'Phủ định của "$1" bằng "$2"')
  }
  if (/^Negation with\s+(.*)$/i.test(t)) {
    return t.replace(/^Negation with\s+(.*)$/i, 'Phủ định với "$1"')
  }
  if (/^Yes-no questions with\s+(.*)$/i.test(t)) {
    return t.replace(/^Yes-no questions with\s+(.*)$/i, 'Câu hỏi Đúng-Sai với trợ từ "$1"')
  }
  if (/^Questions with\s+(.*)$/i.test(t)) {
    return t.replace(/^Questions with\s+(.*)$/i, 'Câu hỏi với "$1"')
  }
  if (/^Asking (.*?) with\s+(.*)$/i.test(t)) {
    return t.replace(/^Asking (.*?) with\s+(.*)$/i, 'Hỏi $1 với "$2"')
  }
  if (/^Expressing\s+"(.*?)"\s+with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing\s+"(.*?)"\s+with\s+(.*)$/i, 'Diễn đạt ý nghĩa "$1" với "$2"')
  }
  if (/^Expressing\s+(.*?)\s+with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing\s+(.*?)\s+with\s+(.*)$/i, 'Biểu thị $1 với "$2"')
  }
  if (/^Comparisons with\s+(.*)$/i.test(t)) {
    return t.replace(/^Comparisons with\s+(.*)$/i, 'Câu so sánh với "$1"')
  }
  if (/^Continuation with\s+(.*)$/i.test(t)) {
    return t.replace(/^Continuation with\s+(.*)$/i, 'Biểu thị tiếp diễn với "$1"')
  }
  if (/^Simultaneous actions with\s+(.*)$/i.test(t)) {
    return t.replace(/^Simultaneous actions with\s+(.*)$/i, 'Biểu thị hai hành động đồng thời với "$1"')
  }
  if (/^The\s+"(.*?)"\s+sentence$/i.test(t)) {
    return t.replace(/^The\s+"(.*?)"\s+sentence$/i, 'Cấu trúc câu chữ "$1"')
  }
  if (/^Adjectives with\s+(.*)$/i.test(t)) {
    return t.replace(/^Adjectives with\s+(.*)$/i, 'Tính từ kết hợp với "$1"')
  }
  if (/^Expressing a date$/i.test(t)) return "Cách diễn đạt ngày tháng năm"
  if (/^Expressing time of day$/i.test(t)) return "Cách nói thời gian trong ngày"
  if (/^Basic sentences:\s*(.*)$/i.test(t)) return `Mẫu câu cơ bản: ${t.replace(/^Basic sentences:\s*/i, "")}`

  return t
}

// 4. Sample sentence translations
const COMMON_TRANSLATIONS: Record<string, string> = {
  "She is reading.": "Cô ấy đang đọc sách.",
  "Mom is calling.": "Mẹ đang gọi điện thoại.",
  "Who is taking a bath inside?": "Ai đang tắm ở bên trong thế?",
  "The aunt is cleaning our room.": "Dì đang dọn dẹp phòng của chúng tôi.",
  "At 7 o'clock last night, we were eating.": "Tối qua lúc 7 giờ, chúng tôi đang ăn cơm.",
  "I have no problem.": "Tôi không có vấn đề gì.",
  "We have no money now.": "Bây giờ chúng tôi không có tiền.",
  "Is he not working?": "Anh ấy không có việc làm à?",
  "They don't have parents.": "Họ không có cha mẹ.",
  "We don't have a house in Beijing.": "Chúng tôi không có nhà ở Bắc Kinh.",
  "I am a student.": "Tôi là học sinh.",
  "He has a younger brother.": "Anh ấy có một người em trai.",
  "The weather is nice today.": "Thời tiết hôm nay rất đẹp.",
  "I don't have time.": "Tôi không có thời gian.",
  "I still think about this matter.": "Chuyện này tôi vẫn đang suy nghĩ.",
  "It's noon, is he still sleeping?": "Đã trưa rồi, anh ấy vẫn còn đang ngủ à?",
  "Is she still angry?": "Cô ấy vẫn còn giận à?",
  "Why are you still using that old phone?": "Sao bạn vẫn còn dùng chiếc điện thoại cũ đó thế?",
  "Are you still playing games?": "Bạn vẫn đang chơi điện tử đấy à?",
}

// 5. Normalize an entire GrammarPoint object to 100% Vietnamese
export function normalizeGrammarPoint(item: GrammarPoint): GrammarPoint {
  const isEnTitle = !item.titleVi || item.titleVi === item.title || /^[A-Za-z\s,.'":;!?-]+$/.test(item.titleVi)
  const titleVi = isEnTitle ? translateTitle(item.titleVi || item.title) : item.titleVi

  const structure = translateStructure(item.structure || "")
  const usedFor = translateUsedFor(item.usedFor || "")

  const examples = (item.examples || []).map((ex) => {
    let translation = ex.translation || ""
    if (COMMON_TRANSLATIONS[translation]) {
      translation = COMMON_TRANSLATIONS[translation]
    }
    return {
      ...ex,
      translation,
    }
  })

  return {
    ...item,
    titleVi,
    structure,
    usedFor,
    examples,
  }
}

export function normalizeGrammarList(list: GrammarPoint[]): GrammarPoint[] {
  if (!Array.isArray(list)) return []
  return list.map(normalizeGrammarPoint)
}

// 6. In-Memory Singleton Cache (0ms navigation lag)
const GRAMMAR_VERSION = "20261101_v2"
let cachedGrammarList: GrammarPoint[] | null = null
let pendingPromise: Promise<GrammarPoint[]> | null = null

export async function fetchGrammarList(): Promise<GrammarPoint[]> {
  // If already loaded in RAM memory, return instantly (0ms)
  if (cachedGrammarList && cachedGrammarList.length > 0) {
    return cachedGrammarList
  }

  // If a fetch is already running, wait for it (deduplicate simultaneous requests)
  if (pendingPromise) {
    return pendingPromise
  }

  pendingPromise = (async () => {
    try {
      const res = await fetch(`/content/grammar/hsk_grammar_full.json?v=${GRAMMAR_VERSION}`)
      const data: GrammarPoint[] = await res.json()
      cachedGrammarList = normalizeGrammarList(data)
      return cachedGrammarList
    } catch (err) {
      console.error("Failed to load grammar data:", err)
      return []
    } finally {
      pendingPromise = null
    }
  })()

  return pendingPromise
}

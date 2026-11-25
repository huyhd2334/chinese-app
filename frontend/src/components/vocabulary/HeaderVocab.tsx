import React from "react"

interface HeaderVocabProps {
  totalWords?: number
  studyingWords?: number
}

const HeaderVocab = ({ totalWords = 0, studyingWords = 0 }: HeaderVocabProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Từ điển HSK 3.0
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Tra cứu chữ Hán, Pinyin, âm Hán-Việt và thứ tự nét viết từ HSK 1 đến HSK 7
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
        <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-muted font-medium">
          Cấp này: <strong className="text-foreground font-semibold">{totalWords.toLocaleString("vi-VN")} từ</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-china-paper border border-border text-china-jade font-semibold">
          {studyingWords.toLocaleString("vi-VN")} đang học
        </span>
      </div>
    </div>
  )
}

export default HeaderVocab

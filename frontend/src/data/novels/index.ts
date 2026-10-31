import { Novel } from "@/types/novel"
import weiweiData from "./weiwei.json"
import tutouData from "./tutou.json"
import nanongData from "./nanong.json"
import kuangbiaoData from "./kuangbiao.json"

export const NOVELS: Novel[] = [
  tutouData as unknown as Novel,
  nanongData as unknown as Novel,
  kuangbiaoData as unknown as Novel,
  weiweiData as unknown as Novel,
]

export function getNovelById(id: string): Novel | undefined {
  return NOVELS.find((n) => n.id === id)
}

export function getNovelChapter(novelId: string, chapterNumber: number) {
  const novel = getNovelById(novelId)
  if (!novel) return undefined
  return novel.chapters.find((ch) => ch.chapterNumber === chapterNumber)
}

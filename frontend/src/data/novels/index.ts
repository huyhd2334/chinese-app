import { Novel } from "@/types/novel"
import weiweiData from "./weiwei.json"
import tutouData from "./tutou.json"
import aqZhengZhuanData from "./aqzhengzhuan.json"
import kuangbiaoData from "./kuangbiao.json"

export const NOVELS: Novel[] = [
  weiweiData as unknown as Novel,
  aqZhengZhuanData as unknown as Novel,
  tutouData as unknown as Novel,
  kuangbiaoData as unknown as Novel,
]

export function getNovelById(id: string): Novel | undefined {
  return NOVELS.find((n) => n.id === id)
}

export function getNovelChapter(novelId: string, chapterNumber: number) {
  const novel = getNovelById(novelId)
  if (!novel) return undefined
  return novel.chapters.find((ch) => ch.chapterNumber === chapterNumber)
}

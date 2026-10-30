import { Novel } from "@/types/novel"
import weiweiData from "./weiwei.json"

export const NOVELS: Novel[] = [
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

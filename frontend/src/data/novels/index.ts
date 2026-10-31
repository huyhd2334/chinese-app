import { Novel } from "@/types/novel"
import weiweiData from "./weiwei.json"
import aqZhengZhuanData from "./aqzhengzhuan.json"
import zhaoHuaXiShiData from "./zhaohuaxishi.json"
import minJianGuShiData from "./minjiangushi.json"

export const NOVELS: Novel[] = [
  weiweiData as unknown as Novel,
  aqZhengZhuanData as unknown as Novel,
  zhaoHuaXiShiData as unknown as Novel,
  minJianGuShiData as unknown as Novel,
]

export function getNovelById(id: string): Novel | undefined {
  return NOVELS.find((n) => n.id === id)
}

export function getNovelChapter(novelId: string, chapterNumber: number) {
  const novel = getNovelById(novelId)
  if (!novel) return undefined
  return novel.chapters.find((ch) => ch.chapterNumber === chapterNumber)
}

declare module 'hanviet-pinyin-words' {
  export const hanvietData: Record<string, unknown>
  export function getHanviet(
    text: string,
    pinyinWords?: string[],
    strict?: boolean
  ): string
}

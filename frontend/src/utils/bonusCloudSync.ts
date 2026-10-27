import { supabase } from "@/lib/supabase"
import type { BonusCollection, BonusWord } from "@/types/bonus"

// Table names
const COLLECTIONS_TABLE = "bonus_collections"
const CARDS_TABLE = "bonus_cards"

/**
 * Đồng bộ các bộ sưu tập từ Supabase về LocalStorage
 */
export async function syncCollectionsWithCloud(userId: string): Promise<BonusCollection[]> {
  try {
    // 1. Lấy dữ liệu từ Supabase
    const { data, error } = await supabase
      .from(COLLECTIONS_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Lỗi khi tải bộ thẻ từ Supabase:", error.message)
      // Nếu lỗi (ví dụ chưa chạy SQL), trả về dữ liệu local
      return getLocalCollections()
    }

    const cloudCols: BonusCollection[] = (data || []).map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle || "",
      language: row.language || "zh",
      itemCount: 0,
      badge: row.badge || "Tự Tạo",
      description: row.description || "",
      isCustom: true,
      createdAt: new Date(row.created_at).getTime(),
    }))

    // 2. Kiểm tra nếu có bộ sưu tập local chưa upload lên cloud thì đẩy lên
    const localCols = getLocalCollections()
    const cloudSlugSet = new Set(cloudCols.map(c => c.slug))
    const unsynced = localCols.filter(c => !cloudSlugSet.has(c.slug))

    if (unsynced.length > 0) {
      for (const col of unsynced) {
        await saveCollectionToCloud(userId, col)
      }
      cloudCols.unshift(...unsynced)
    }

    // 3. Cập nhật lại localStorage để ứng dụng dùng mượt mà
    localStorage.setItem("bonus_custom_collections", JSON.stringify(cloudCols))
    return cloudCols
  } catch (err) {
    console.error("syncCollectionsWithCloud error:", err)
    return getLocalCollections()
  }
}

/**
 * Lưu 1 bộ sưu tập lên Cloud
 */
export async function saveCollectionToCloud(userId: string, col: BonusCollection): Promise<void> {
  try {
    const { error } = await supabase.from(COLLECTIONS_TABLE).upsert({
      id: col.id || col.slug,
      user_id: userId,
      slug: col.slug,
      title: col.title,
      subtitle: col.subtitle || "",
      language: col.language || "zh",
      badge: col.badge || "Tự Tạo",
      description: col.description || "",
      created_at: col.createdAt ? new Date(col.createdAt).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.warn("Không thể lưu bộ thẻ lên Supabase:", error.message)
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * Xóa 1 bộ sưu tập khỏi Cloud
 */
export async function deleteCollectionFromCloud(userId: string, slug: string): Promise<void> {
  try {
    await supabase.from(CARDS_TABLE).delete().eq("user_id", userId).eq("collection_slug", slug)
    await supabase.from(COLLECTIONS_TABLE).delete().eq("user_id", userId).eq("slug", slug)
  } catch (e) {
    console.error(e)
  }
}

/**
 * Đồng bộ thẻ từ vựng của 1 bộ sưu tập từ Supabase
 */
export async function syncCardsWithCloud(userId: string, collectionSlug: string): Promise<BonusWord[]> {
  try {
    const { data, error } = await supabase
      .from(CARDS_TABLE)
      .select("*")
      .eq("user_id", userId)
      .eq("collection_slug", collectionSlug)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Lỗi khi tải thẻ từ Supabase:", error.message)
      return getLocalCards(collectionSlug)
    }

    const cloudCards: BonusWord[] = (data || []).map((row: any) => ({
      id: row.id,
      stt: new Date(row.created_at).getTime(),
      word: row.word,
      hanzi: row.hanzi || undefined,
      pinyin: row.pinyin || undefined,
      phonetic: row.phonetic || undefined,
      hanViet: row.han_viet || undefined,
      partOfSpeech: row.part_of_speech || "Từ vựng",
      meaning: row.meaning,
      example: row.example || undefined,
      examplePinyin: row.example_pinyin || undefined,
      topic: row.topic || "Từ vựng tự thêm",
      language: row.language || "zh",
      isCustom: true,
      createdAt: new Date(row.created_at).getTime(),
    }))

    // Đồng bộ thẻ chưa upload từ local lên cloud
    const localCards = getLocalCards(collectionSlug)
    const cloudIdSet = new Set(cloudCards.map(c => c.id))
    const unsyncedCards = localCards.filter(c => !cloudIdSet.has(c.id))

    if (unsyncedCards.length > 0) {
      await saveCardsBatchToCloud(userId, collectionSlug, unsyncedCards)
      cloudCards.unshift(...unsyncedCards)
    }

    localStorage.setItem(`bonus_custom_cards_${collectionSlug}`, JSON.stringify(cloudCards))
    return cloudCards
  } catch (err) {
    console.error("syncCardsWithCloud error:", err)
    return getLocalCards(collectionSlug)
  }
}

/**
 * Lưu 1 thẻ từ vựng lên Cloud
 */
export async function saveCardToCloud(userId: string, collectionSlug: string, card: BonusWord): Promise<void> {
  try {
    const { error } = await supabase.from(CARDS_TABLE).upsert({
      id: card.id,
      user_id: userId,
      collection_slug: collectionSlug,
      word: card.word,
      hanzi: card.hanzi || null,
      pinyin: card.pinyin || null,
      phonetic: card.phonetic || null,
      han_viet: card.hanViet || null,
      part_of_speech: card.partOfSpeech || "Từ vựng",
      meaning: card.meaning,
      example: card.example || null,
      example_pinyin: card.examplePinyin || null,
      topic: card.topic || "Từ vựng tự thêm",
      language: card.language || "zh",
      created_at: card.createdAt ? new Date(card.createdAt).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.warn("Không thể lưu thẻ lên Supabase:", error.message)
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * Lưu nhiều thẻ cùng lúc lên Cloud
 */
export async function saveCardsBatchToCloud(
  userId: string,
  collectionSlug: string,
  cards: BonusWord[]
): Promise<void> {
  if (cards.length === 0) return

  try {
    const rows = cards.map(c => ({
      id: c.id,
      user_id: userId,
      collection_slug: collectionSlug,
      word: c.word,
      hanzi: c.hanzi || null,
      pinyin: c.pinyin || null,
      phonetic: c.phonetic || null,
      han_viet: c.hanViet || null,
      part_of_speech: c.partOfSpeech || "Từ vựng",
      meaning: c.meaning,
      example: c.example || null,
      example_pinyin: c.examplePinyin || null,
      topic: c.topic || "Từ vựng tự thêm",
      language: c.language || "zh",
      created_at: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    }))

    const { error } = await supabase.from(CARDS_TABLE).upsert(rows)
    if (error) {
      console.warn("Lỗi lưu batch cards lên Supabase:", error.message)
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * Xóa 1 thẻ từ vựng khỏi Cloud
 */
export async function deleteCardFromCloud(userId: string, cardId: string): Promise<void> {
  try {
    await supabase.from(CARDS_TABLE).delete().eq("user_id", userId).eq("id", cardId)
  } catch (e) {
    console.error(e)
  }
}

function getLocalCollections(): BonusCollection[] {
  try {
    const stored = localStorage.getItem("bonus_custom_collections")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function getLocalCards(collectionSlug: string): BonusWord[] {
  try {
    const stored = localStorage.getItem(`bonus_custom_cards_${collectionSlug}`)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

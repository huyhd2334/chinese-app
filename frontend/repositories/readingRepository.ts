import { db } from "../db/database"

export const readingRepository = {

  async getRandomSet() {
    const readings = await db.readings.toArray()

    if (!readings.length) {
      return null
    }

    // Lấy danh sách document
    const documentIds = [
      ...new Set(
        readings.map(r => r.source_document_id)
      )
    ]

    // Những document chưa hoàn thành
    const unfinishedDocumentIds = documentIds.filter(documentId => {
      const questions = readings.filter(
        r => r.source_document_id === documentId
      )

      return !questions.every(q => q.completed)
    })

    if (!unfinishedDocumentIds.length) {
      return null
    }

    // Random 1 DOCUMENT
    const sourceDocumentId =
      unfinishedDocumentIds[
        Math.floor(
          Math.random() * unfinishedDocumentIds.length
        )
      ]

    // Chỉ lấy question của document đó
    const questions = readings
      .filter(
        r => r.source_document_id === sourceDocumentId
      )
      .sort((a, b) => {
        const aIndex =
          Number(a.id.match(/q(\d+)$/)?.[1] ?? 0)

        const bIndex =
          Number(b.id.match(/q(\d+)$/)?.[1] ?? 0)

        return aIndex - bIndex
      })

    console.log(
      "SELECTED DOCUMENT:",
      sourceDocumentId
    )

    console.log(
      "QUESTIONS:",
      questions.map(q => ({
        id: q.id,
        source_document_id: q.source_document_id,
        question: q.question
      }))
    )

    return {
      source_document_id: sourceDocumentId,
      passage: questions[0].passage,
      questions
    }
  },

  async getByDocumentId(sourceDocumentId: string) {
    return await db.readings
      .where("source_document_id")
      .equals(sourceDocumentId)
      .sortBy("id")
  },

  async complete(readingId: string) {
    await db.readings.update(readingId, {
      completed: true
    })
  },

  async get(readingId: string) {
    return await db.readings.get(readingId)
  },

  async remove(readingId: string) {
    await db.readings.delete(readingId)
  }
}
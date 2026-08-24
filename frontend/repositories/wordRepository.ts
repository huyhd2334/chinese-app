import { db } from "../db/database"

export const wordRepository = {

  async getById(id: string) {
    return db.words.get(id)
  },

  async getByHanzi(hanzi: string) {
    return db.words
      .where("hanzi")
      .equals(hanzi)
      .first()
  },

  async getByHsk(level: number) {
    return db.words
      .where("hskLevel")
      .equals(level)
      .toArray()
  },

  async getIdsByHsk(level: number) {
    return db.words
      .where("hskLevel")
      .equals(level)
      .primaryKeys()
  },

  async getByHskPaginated(level: number, offset: number, limit: number) {
    return db.words
      .where("hskLevel")
      .equals(level)
      .offset(offset)
      .limit(limit)
      .toArray()
  },

  async getCountByHsk(level: number) {
    return db.words
      .where("hskLevel")
      .equals(level)
      .count()
  },

  async getAll() {
    return db.words.toArray()
  },

  async count() {
    return db.words.count()
  },

}
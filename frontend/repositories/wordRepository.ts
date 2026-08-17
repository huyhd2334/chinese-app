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

  async getAll() {
    return db.words.toArray()
  },

  async count() {
    return db.words.count()
  },

}
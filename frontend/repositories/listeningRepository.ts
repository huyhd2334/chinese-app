import { db } from "../db/database"

export const listeningRepository = {
    async getRandomUncompleted() {
        const items = await db.listeningTriads.filter(item => item.completed === false).toArray()
        if (items.length === 0) {
            return null
        }
        const randomIndex = Math.floor(Math.random() * items.length)
        return items[randomIndex]
    },

    async complete(id: string, result: "correct" | "false") {
      await db.listeningTriads.update(id, {
      completed: true,
      result: result
    })
    },

    async getCompleted() {
        const items = await db.listeningTriads.filter(item => item.completed === true).toArray()
        if (items.length === 0) {
            return null
        }
        return items
    }
}
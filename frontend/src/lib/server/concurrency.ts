import "server-only"

/**
 * Hàng đợi giới hạn đồng thời (Semaphore + bounded queue) để bảo vệ upstream (TTS, v.v.).
 *
 * - Tối đa `maxConcurrent` tác vụ chạy cùng lúc.
 * - Dư ra xếp hàng FIFO, tối đa `maxQueue` chỗ; đầy -> từ chối ngay (backpressure, trả 503)
 *   thay vì để request chất đống làm sập tiến trình.
 * - Mỗi tác vụ chờ quá `maxWaitMs` trong hàng đợi sẽ bị hủy.
 */
export class QueueFullError extends Error {
  constructor() {
    super("queue_full")
    this.name = "QueueFullError"
  }
}

export class QueueTimeoutError extends Error {
  constructor() {
    super("queue_timeout")
    this.name = "QueueTimeoutError"
  }
}

export class BoundedQueue {
  private running = 0
  private waiters: Array<{ start: () => void; cancel: () => void }> = []

  constructor(
    private readonly maxConcurrent: number,
    private readonly maxQueue: number,
    private readonly maxWaitMs: number
  ) {}

  get stats() {
    return { running: this.running, queued: this.waiters.length }
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrent) {
      if (this.waiters.length >= this.maxQueue) throw new QueueFullError()
      await new Promise<void>((resolve, reject) => {
        const waiter = {
          start: () => {
            clearTimeout(timer)
            resolve()
          },
          cancel: () => reject(new QueueTimeoutError()),
        }
        const timer = setTimeout(() => {
          const idx = this.waiters.indexOf(waiter)
          if (idx >= 0) this.waiters.splice(idx, 1)
          waiter.cancel()
        }, this.maxWaitMs)
        this.waiters.push(waiter)
      })
    }

    this.running += 1
    try {
      return await task()
    } finally {
      this.running -= 1
      this.waiters.shift()?.start()
    }
  }
}

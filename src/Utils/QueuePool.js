export class QueuePool {
  constructor() {
    this.queue = []
    this.running = false
  }
  addQueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject
      })
      if (!this.running) {
        this.running = true
        this.run()
      }
    })
  }
  run() {
    if (this.queue.length > 0) {
      this.running = true
      const { task, resolve, reject } = this.queue.shift()
      task().then(resolve, reject).finally(() => {
        this.run()
      })
    } else {
      this.running = false
    }
  }
}
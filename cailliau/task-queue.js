class Task {
  constructor(fn) {
    this.fn = fn;
  }
  run() {
    this.fn();
  }
}

class TaskQueue {
  constructor() {
    this.queue = [];
  }

  add(task) {
    if(task) this.queue.push(task);
  }

  hasTasks() {
    return !!this.queue.length;
  }

  pop() {
    return this.queue.shift();
  }

  peek() {
    return this.queue[0];
  }

  clear() {
    this.queue = [];
  }

  process() {
    const task = this.pop();
    if(task) {
      task.run();
    } else {
      console.log('TaskQueue error: Trying to process empty queue');
    }
  }
}

module.exports = TaskQueue;

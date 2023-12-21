class PriorityQueue {

    elements = []
  
    constructor(comparator) {
      this.comparator = comparator
    }
  
    enqueue(item) {
      this.elements.push(item)
      this.elements.sort(this.comparator)
    }
  
    dequeue() {
      return this.elements.shift()
    }
  
    peek() {
      return this.elements[0]
    }
  
    collect() {
      return this.elements
    }
  
    isEmpty() {
      return this.elements.length === 0
    }

    empty() {
      this.elements.length = 0
    }
  
    size() {
      return this.elements.length
    }
  }
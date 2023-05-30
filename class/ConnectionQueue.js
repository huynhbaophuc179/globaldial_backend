class ConnectionQueue {
    constructor() {
        this.set = new Set();
        this.array = [];
    }

    enqueue(item) {
        if (!this.set.has(item)) {
            this.set.add(item);
            this.array.push(item);
        } else {
            // Item is already in the queue
        }
    }
    prioritize(item) {
        if (!this.set.has(item)) {
            this.set.add(item);
            this.array.unshift(item);
        } else {
            // Item is already in the queue
        }
    }
    dequeue() {
        const item = this.array.shift();
        if (item !== undefined) {
            this.set.delete(item);
            console.log(`Item ${item} removed from the unique queue.`);
            return item;
        } else {
            return undefined;
        }
    }

    clear() {
        this.set.clear();
        this.array.length = 0;
    }

    size() {
        return this.array.length + 1;
    }
}
module.exports = ConnectionQueue;  
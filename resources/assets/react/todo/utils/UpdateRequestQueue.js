let TodoWebService = require('./TodoWebService');

class UpdateRequestQueue {
    constructor() {
        this.queue = {};
    }

    remove(id) {
        if (this.queue.hasOwnProperty(id)) {
            delete this.queue[id];
        }
    }

    createQueueItem(id) {
        let _resolve;
        let _reject;

        let promise = new Promise((resolve,reject) => {
            _resolve = resolve;
            _reject = reject;
        });

        this.queue[id] = {
            resolve: _resolve,
            reject: _reject,
            promise: promise,
            timer: null
        };
    }

    addToQueue(id, updates) {
        if (!this.queue.hasOwnProperty(id)) {
            this.createQueueItem(id);
        }

        clearTimeout(this.queue[id].timer);
        this.queue[id].timer = setTimeout(() => {
            TodoWebService.patchTodo(id, updates)
                .then(
                    (result) => this.queue[id].resolve(result),
                    (err) => this.queue[id].reject(err)
                );
        },2000);

        return this.queue[id].promise;
    }

    addToDeleteQueue(id) {
        if (this.queue.hasOwnProperty(id)) {
            clearTimeout(this.queue[id].timer);
            delete this.queue[id];
        }

        this.createQueueItem(id);
        TodoWebService.deleteTodo(id)
            .then(
                (result) => this.queue[id].resolve(result),
                (err) => this.queue[id].reject(err)
            );

        return this.queue[id].promise;
    }
}

module.exports = UpdateRequestQueue;

let TodoWebService = require('./TodoWebService');
let TodoLocalStorage = require('./TodoLocalStorage');
let SyncActions = require('../actions/SyncActions');
let TodoUtils = require('./TodoUtils');

class UpdateRequestQueue {
    constructor() {
        this.queue = {};
    }

    remove(id) {
        if (this.queue.hasOwnProperty(id)) {
            delete this.queue[id];
        }
    }

    addToQueue(id, updates) {
        if (!this.queue.hasOwnProperty(id)) {
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
}

let updateQueue = new UpdateRequestQueue();

let TodoSyncUtils = {
    receiveTodos() {
        if (!TodoLocalStorage.isAllSynced()) {
            TodoWebService.getAllTodos()
                .then((body) => {
                    console.log(body);
                    let todos = TodoUtils.receiveTodosFromServer(body);
                    console.log(todos);
                    TodoLocalStorage.persistAll(todos);
                    TodoLocalStorage.allSynced();
                    SyncActions.todosReceived(todos);
                })
                .catch((err) => {
                    console.log(err);
                    SyncActions.syncError();
                });
        } else {
            let rawTodos = TodoLocalStorage.getTodos();
            let todos = TodoUtils.receiveTodosFromStorage(rawTodos);
            SyncActions.todosReceived(todos);
        }
    },

    createTodo(todo) {
        TodoWebService.postTodo(todo)
            .then((result) => {
                todo.id = result.id;
                TodoUtils.setIdTo(todo.key, todo.id);
                TodoLocalStorage.createTodo(todo);
                SyncActions.createSuccess(todo);
            });
    },

    updateTodo(key, updates) {
        let id = TodoUtils.getIdBy(key);
        TodoLocalStorage.updateTodo(id, updates);
        updateQueue.addToQueue(id, updates)
            .then((result) => {
                SyncActions.updateSuccess(key);
                updateQueue.remove(id);
            });
    },

    deleteTodo(key) {
        let id = TodoUtils.getIdBy(key);
        TodoLocalStorage.deleteTodo(id);
        TodoWebService.deleteTodo(id)
            .then((result) => {
                TodoUtils.removeKey(key);
                SyncActions.deleteSuccess(key);
            });
    },
};

module.exports = TodoSyncUtils;

let TodoWebService = require('./TodoWebService');
let TodoLocalStorage = require('./TodoLocalStorage');
let SyncActions = require('../actions/SyncActions');
let TodoUtils = require('./TodoUtils');
let UpdateRequestQueue = require('./UpdateRequestQueue');

let updateQueue = new UpdateRequestQueue();

let TodoSyncUtils = {
    receiveTodos() {
        if (!TodoLocalStorage.isAllSynced()) {
            TodoWebService.getAllTodos()
                .then((body) => {
                    let todos = TodoUtils.receiveTodosFromServer(body);
                    TodoLocalStorage.persistAll(todos);
                    TodoLocalStorage.allSynced();
                    SyncActions.todosReceived(todos);
                })
                .catch((err) => {
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
            }).catch(() => {});
    },

    deleteTodo(key) {
        let id = TodoUtils.getIdBy(key);
        TodoLocalStorage.deleteTodo(id);
        updateQueue.addToDeleteQueue(id)
            .then((result) => {
                TodoUtils.removeKey(key);
                SyncActions.deleteSuccess(key);
                updateQueue.remove(id);
            }).catch(() => {});
    },
};

module.exports = TodoSyncUtils;

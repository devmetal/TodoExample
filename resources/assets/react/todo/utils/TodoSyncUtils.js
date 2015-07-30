let TodoWebService = require('./TodoWebService');
let TodoLocalStorage = require('./TodoLocalStorage');
let SyncActions = require('../actions/SyncActions');
let TodoUtils = require('./TodoUtils');

module.exports = {
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
        TodoLocalStorage.createTodo(todo);
        SyncActions.createSuccess(todo.id);
    },

    updateTodo(id, updates) {
        TodoLocalStorage.updateTodo(id, updates);
        SyncActions.updateSuccess(id);
    },

    deleteTodo(id) {
        TodoLocalStorage.deleteTodo(id);
        SyncActions.deleteSuccess(id);
    },

    saveTodos() {
        let todos = TodoLocalStorage.getTodos();
        let keys = Object.keys(todos);
        let promises = [];

        for (let key of keys) {
            let todo = todos[key];
            if ((todo.meta.persisted === 'LOCAL' || todo.meta.persister === 'NONE') && !todo.meta.deleted) {
                promises.push(TodoWebService.postTodo(todo));
            } else if (todo.meta.persisted === 'SERVER') {
                if (todo.meta.updated) {
                    promises.push(TodoWebService.patchTodo(todo));
                } else if (todo.meta.deleted) {
                    promises.push(TodoWebService.deleteTodo(todo));
                }
            }
        }

        Promise.all(promises)
            .then((results) => {
                SyncActions.saveSuccess();
            }, (error) => {
                SyncActions.syncError();
            });
    }
};
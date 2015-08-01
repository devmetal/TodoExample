let AppDispatcher = require('../dispatchers/AppDispatcher');
let TodoConstants = require('../constants/TodoConstants');
let TodoUtils = require('../utils/TodoUtils');
let TodoSyncUtils = require('../utils/TodoSyncUtils');

let TodoActions = {
    create(text) {
        let todo = TodoUtils.createTodo(text);

        AppDispatcher.dispatch({
            type: TodoConstants.TODO_CREATE,
            todo: todo
        });

        TodoSyncUtils.createTodo(todo);
    },
    update(key, text) {
        AppDispatcher.dispatch({
            type: TodoConstants.TODO_UPDATE,
            key:key,
            text:text
        });

        TodoSyncUtils.updateTodo(key, {text: text});
    },
    remove(key) {
        AppDispatcher.dispatch({
            type:TodoConstants.TODO_DELETE,
            key:key
        });

        TodoSyncUtils.deleteTodo(key);
    },
    done(key) {
        AppDispatcher.dispatch({
            type:TodoConstants.TODO_DONE,
            key:key
        });

        TodoSyncUtils.updateTodo(key, {done:true});
    },
    undone(key) {
        AppDispatcher.dispatch({
            type:TodoConstants.TODO_UNDONE,
            key:key
        });

        TodoSyncUtils.updateTodo(key, {done:false});
    }
};

module.exports = TodoActions;

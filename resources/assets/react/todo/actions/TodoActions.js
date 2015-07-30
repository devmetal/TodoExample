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
    update(id, text) {
        AppDispatcher.dispatch({
            type: TodoConstants.TODO_UPDATE,
            id:id,
            text:text
        });

        TodoSyncUtils.updateTodo(id, {text: text});
    },
    remove(id) {
        AppDispatcher.dispatch({
            type:TodoConstants.TODO_DELETE,
            id:id
        });

        TodoSyncUtils.deleteTodo(id);
    },
    done(id) {
        AppDispatcher.dispatch({
            type:TodoConstants.TODO_DONE,
            id:id
        });

        TodoSyncUtils.updateTodo(id, {done:true});
    },
    undone(id) {
        AppDispatcher.dispatch({
            type:TodoConstants.TODO_UNDONE,
            id:id
        });

        TodoSyncUtils.updateTodo(id, {done:false});
    }
};

module.exports = TodoActions;
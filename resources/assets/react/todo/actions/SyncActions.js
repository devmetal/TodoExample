let SyncConstants = require('../constants/SyncConstants');
let AppDispatcher = require('../dispatchers/AppDispatcher');

let SyncActions = {
    todosReceived(todos) {
        AppDispatcher.dispatch({
            type:SyncConstants.TODOS_RECEIVED,
            todos:todos
        });
    },

    createSuccess(todo) {
        AppDispatcher.dispatch({
            type:SyncConstants.CREATE_SUCCESS,
            todo: todo
        });
    },

    updateSuccess(key) {
        AppDispatcher.dispatch({
            type:SyncConstants.UPDATE_SUCCESS,
            key:key
        });
    },

    deleteSuccess(key) {
        AppDispatcher.dispatch({
            type:SyncConstants.DELETE_SUCCESS,
            key:key
        });
    }
};

module.exports = SyncActions;

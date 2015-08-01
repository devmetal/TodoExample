let SyncConstants = require('../constants/SyncConstants');
let AppDispatcher = require('../dispatchers/AppDispatcher');
let TodoSyncUtils = require('../utils/TodoSyncUtils');

let SyncActions = {
    todosReceived(todos) {
        AppDispatcher.dispatch({
            type:SyncConstants.TODOS_RECEIVED,
            todos:todos
        });
    },

    syncError(err) {
        AppDispatcher.dispatch({
            type:SyncConstants.SYNC_ERROR,
            error:err
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

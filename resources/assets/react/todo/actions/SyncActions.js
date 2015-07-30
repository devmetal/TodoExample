let SyncConstants = require('../constants/SyncConstants');
let AppDispatcher = require('../dispatchers/AppDispatcher');

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

    syncStart() {
        AppDispatcher.dispatch({
            type:SyncConstants.SYNC_START
        });
    },

    syncEnd() {
        AppDispatcher.dispatch({
            type:SyncConstants.SYNC_END
        });
    },

    syncSuccess(todo) {
        AppDispatcher.dispatch({
            type:SyncConstants.SYNC_SUCCESS,
            synced:todo
        });
    },

    createSuccess(id) {
        AppDispatcher.dispatch({
            type:SyncConstants.CREATE_SUCCESS,
            id:id
        });
    },

    updateSuccess(id) {
        AppDispatcher.dispatch({
            type:SyncConstants.UPDATE_SUCCESS,
            id:id
        });
    },

    deleteSuccess(id) {
        AppDispatcher.dispatch({
            type:SyncConstants.DELETE_SUCCESS,
            id:id
        });
    },

    saveSuccess() {
        AppDispatcher.dispatch({
            type:SyncConstants.SAVE_SUCCESS
        });
    },

    saveError() {
        AppDispatcher.dispatch({
            type:SyncConstants.SAVE_ERROR
        });
    }
};

module.exports = SyncActions;
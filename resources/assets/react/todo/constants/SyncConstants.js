let keymirror = require('keymirror');

module.exports = keymirror({
    SYNC_START:null,
    SYNC_SUCCESS:null,
    SYNC_ERROR:null,
    SYNC_END:null,

    TODOS_RECEIVED:null,
    CREATE_SUCCESS:null,
    UPDATE_SUCCESS:null,
    DELETE_SUCCESS:null,
    SAVE_SUCCESS:null,
    SAVE_ERROR:null
});
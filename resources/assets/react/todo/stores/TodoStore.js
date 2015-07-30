let EventEmitter = require('events').EventEmitter;
let TodoConstants = require('../constants/TodoConstants');
let SyncConstants = require('../constants/SyncConstants');
let AppDispatcher = require('../dispatchers/AppDispatcher');
let TodoUtils = require('../utils/TodoUtils');

let CHANGE_EVENT = 'change';

let _todos = {
    *[Symbol.iterator]() {
        let keys = Object.keys(this);
        for (let key of keys) {
            yield this[key];
        }
    }
};

function receiveTodos(todos) {
    var keys = Object.keys(todos);
    keys.forEach((key) => _todos[key] = todos[key]);
}

function createTodo(todo) {
    _todos[todo.id] = todo;
}

function updateTodo(id, updates) {
    _todos[id] = Object.assign({}, _todos[id], updates);
}

function destroy(id) {
    _todos[id].disabled = true;
}


let TodoStore = Object.assign({},EventEmitter.prototype, {
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },


    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    getTodos() {
        return _todos;
    }
});

TodoStore.dispatchToken = AppDispatcher.register((action) => {
    switch(action.type) {
        case TodoConstants.TODO_CREATE:
            createTodo(action.todo);
            TodoStore.emitChange();
            break;
        case TodoConstants.TODO_UPDATE:
            var text = action.text.trim();
            if (text != '') {
                updateTodo(action.id, {text:text});
                TodoStore.emitChange();
            }
            break;
        case TodoConstants.TODO_DONE:
            updateTodo(action.id, {done:true});
            TodoStore.emitChange();
            break;
        case TodoConstants.TODO_UNDONE:
            updateTodo(action.id, {done:false});
            TodoStore.emitChange();
            break;
        case TodoConstants.TODO_DELETE:
            destroy(action.id);
            TodoStore.emitChange();
            break;
        case SyncConstants.TODOS_RECEIVED:
            var todos = action.todos;
            receiveTodos(todos);
            TodoStore.emitChange();
            break;
        default:
            break;
    }
});

module.exports = TodoStore;
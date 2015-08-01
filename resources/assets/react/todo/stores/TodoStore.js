let EventEmitter = require('events').EventEmitter;
let TodoConstants = require('../constants/TodoConstants');
let SyncConstants = require('../constants/SyncConstants');
let AppDispatcher = require('../dispatchers/AppDispatcher');
let TodoUtils = require('../utils/TodoUtils');

let CHANGE_EVENT = 'change';

Map.prototype.update = function(key, value) {
    this.set(key, Object.assign({}, this.get(key), value))
}

let _todos = new Map();

function addTodo(todo) {
    _todos.set(todo.key, todo);
}

function updateTodo(key, updates) {
    _todos.update(key, updates);
}

function destroyTodo(key) {
    _todos.delete(key);
}

function receiveTodos(receivedTodos) {
    _todos.clear();
    let keys = Object.keys(receivedTodos);
    keys.forEach((key) => _todos.set(key, receivedTodos[key]));
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
        return [..._todos.values()];
    }
});

TodoStore.dispatchToken = AppDispatcher.register((action) => {
    switch(action.type) {
        case TodoConstants.TODO_CREATE:
            addTodo(action.todo);
            TodoStore.emitChange();
            break;
        case SyncConstants.CREATE_SUCCESS:
            updateTodo(action.todo.key, {
                id: action.todo.id
            });
            TodoStore.emitChange();
            break;
        case TodoConstants.TODO_UPDATE:
            var text = action.text.trim();
            if (text != '') {
                updateTodo(action.key, {text:text, sync:true});
                TodoStore.emitChange();
            }
            break;
        case TodoConstants.TODO_DONE:
            updateTodo(action.key, {done:true, sync:true});
            TodoStore.emitChange();
            break;
        case TodoConstants.TODO_UNDONE:
            updateTodo(action.key, {done:false, sync:true});
            TodoStore.emitChange();
            break;
        case SyncConstants.UPDATE_SUCCESS:
            updateTodo(action.key, {sync:false});
            TodoStore.emitChange();
            break;
        case TodoConstants.TODO_DELETE:
            destroyTodo(action.key);
            TodoStore.emitChange();
            break;
        case SyncConstants.TODOS_RECEIVED:
            receiveTodos(action.todos);
            TodoStore.emitChange();
            break;
        default:
            break;
    }
});

module.exports = TodoStore;

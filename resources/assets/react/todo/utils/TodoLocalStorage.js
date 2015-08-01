let getTodos = () => JSON.parse(localStorage.getItem('todos'));
let persistAll = (todos) => localStorage.setItem('todos', JSON.stringify(todos));

module.exports = {
    createTodo(todo) {
        todo.meta.persisted = 'LOCAL';
        let todos = getTodos();
        todos[todo.id] = todo;
        persistAll(todos);
    },

    updateTodo(id, updates) {
        let todos = getTodos();
        todos[id] = Object.assign({}, todos[id], updates);
        persistAll(todos);
    },

    deleteTodo(id) {
        let todos = getTodos();
        todos[id].disabled = true;
        persistAll(todos);
    },

    syncStorageAfterServer(results, synced) {
        let todos = getTodos();
        let updated = {};
        for (let i = 0; i<synced.length; i++) {
            if (synced[i].meta.deleted) {
                let id = synced[i].id;
                delete todos[id];
            } else {
                let localId = synced[i].id;
                let srvId = results[i].id;
                if (localId != srvId) {
                    let _todo = Object.assign({}, todos[localId], results[i]);
                    delete todos[localId];
                    todos[srvId] = _todo;
                }

                todos[srvId].meta.updated = false;
                todos[srvId].meta.deleted = false;
                todos[srvId].meta.persisted = 'SERVER';
                updated[localId] = todos[srvId];
            }
        }

        persistAll(todos);
        return updated;
    },

    getTodos() {
        return getTodos();
    },

    persistAll(todos) {
        return persistAll(todos);
    },

    isAllSynced() {
        let synced = localStorage.getItem('allSynced');
        if (!synced) {
            return false;
        } else {
            return true;
        }
    },

    allSynced() {
        localStorage.setItem('allSynced','true');
    }
};

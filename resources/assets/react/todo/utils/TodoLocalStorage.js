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
        todos[id].meta.updated = true;
        persistAll(todos);
    },

    deleteTodo(id) {
        console.log(id);
        let todos = getTodos();
        todos[id].meta.deleted = true;
        todos[id].meta.updated = false;
        todos[id].disabled = true;
        persistAll(todos);
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
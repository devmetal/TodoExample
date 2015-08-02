let getTodos = () => JSON.parse(localStorage.getItem('todos'));
let persistAll = (todos) => localStorage.setItem('todos', JSON.stringify(todos));

module.exports = {
    createTodo(todo) {
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
        delete todos[id];
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

let genId = () => (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

module.exports = {
    createTodo(text) {
        return {
            id: genId(),
            text: text,
            done: false,
            disabled: false,
            meta: {
                persisted:'NONE',
                updated:false,
                deleted:false
            }
        }
    },

    receiveTodosFromServer(rawBody) {
        let _done = (done) => done == "1" || !!done;

        let todos = {};
        for (let todo of rawBody) {
            todos[todo.id] = {
                id: todo.id,
                text: todo.todo,
                done: _done(todo.done),
                disabled: false,
                meta: {
                    persisted: 'SERVER',
                    updated: false,
                    deleted: false
                }
            };
        }
        return todos;
    },

    receiveTodosFromStorage(rawBody) {
        let _done = (done) => done == "1" || !!done;

        let todos = {};
        let keys = Object.keys(rawBody);
        for (let key of keys) {
            let todo = rawBody[key];
            todos[todo.id] = {
                id: todo.id,
                text: todo.text,
                done: _done(todo.done),
                disabled: todo.disabled || false,
                meta: {
                    persisted: 'SERVER',
                    updated: false,
                    deleted: false
                }
            };
        }
        return todos;
    }
}
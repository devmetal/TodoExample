let genKey = () => (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

let keyIdMap = new Map();

module.exports = {

    setIdTo(key, id) {
        keyIdMap.set(key, id);
    },

    getIdBy(key) {
        return keyIdMap.get(key);
    },

    removeKey(key) {
        keyIdMap.delete(key);
    },

    createTodo(text) {
        return {
            key: genKey(),
            id: null,
            text: text,
            done: false
        }
    },

    receiveTodosFromServer(rawBody) {
        let _done = (done) => done == "1" || !!done;
        keyIdMap = new Map();
        let todos = {};
        for (let todo of rawBody) {
            todos[todo.id] = {
                key: todo.id,
                id: todo.id,
                text: todo.todo,
                done: _done(todo.done)
            };

            keyIdMap.set(todo.id, todo.id);
        }
        return todos;
    },

    receiveTodosFromStorage(rawBody) {
        let _done = (done) => done == "1" || !!done;
        keyIdMap = new Map();
        let todos = {};
        let keys = Object.keys(rawBody);
        for (let key of keys) {
            let todo = rawBody[key];
            todos[key] = {
                id: todo.id,
                key: key,
                text: todo.text,
                done: _done(todo.done)
            };

            keyIdMap.set(key, todo.id);
        }

        return todos;
    }
}

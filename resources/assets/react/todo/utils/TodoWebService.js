let SyncActions = require('../actions/SyncActions');
let superagent = require('superagent');
let TodoStateConstants = require('./TodoStateConstants');

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let getTodos = () => new Promise((resolve,reject) =>
    superagent.get('/todo')
        .accept('application/json')
        .end((err,res) => {
            if (err)
                reject(err);
            else {
                resolve(res.body);
            }
        }
    )
);

let postTodo = (todo) => new Promise((resolve,reject) =>
    superagent.post('/todo')
        .accept('application/json')
        .set('X-XSRF-TOKEN',getCookie('XSRF-TOKEN'))
        .send({todo:todo.text, done:todo.done})
        .end((err,res) => {
            if (err)
                reject(err);
            else
                resolve({
                    response: res.body,
                    viewKey: todo.viewKey
                });
        }
    )
);

let patchTodo = (todo) => new Promise((resolve,reject) =>
    superagent('PATCH', '/todo/' + todo.id)
        .accept('application/json')
        .set('X-XSRF-TOKEN',getCookie('XSRF-TOKEN'))
        .send({todo:todo.text, done:todo.done})
        .end((err,res) => {
            if (err)
                reject(err);
            else
                resolve({
                    response: res.body,
                    viewKey: todo.viewKey
                });
        }
    )
);

let deleteTodo = (todo) => new Promise((resolve,reject) =>
    superagent('DELETE','/todo/' + todo.id)
        .accept('application/json')
        .set('X-XSRF-TOKEN',getCookie('XSRF-TOKEN'))
        .end((err,res) => {
            if (err)
                reject(err);
            else
                resolve({
                    response: res.body,
                    viewKey: todo.viewKey
                });
        }
    )
);


module.exports = {
    getAllTodos: getTodos,

    postTodo: postTodo,

    patchTodo: patchTodo,

    deleteTodo: deleteTodo,

    syncronize(todos) {
        let promises = [];
        let synced = [];

        for (let todo of todos) {
            switch (todo.state) {
                case TodoStateConstants.CREATED:
                    synced.push(todo);
                    promises.push(postTodo(todo));
                    break;
                case TodoStateConstants.UPDATED:
                    synced.push(todo);
                    if (!todo.id) {
                        promises.push(postTodo(todo));
                    } else {
                        promises.push(patchTodo(todo));
                    }
                    break;
                case TodoStateConstants.DELETED:
                    if (todo.id) {
                        synced.push(todo);
                        promises.push(deleteTodo(todo));
                    }
                    break;
                default:
            }
        }

        SyncActions.syncStart();
        Promise.all(promises)
            .then((res) => SyncActions.syncSuccess(synced, res),
                  (err) => SyncActions.syncError(err));
    }
};
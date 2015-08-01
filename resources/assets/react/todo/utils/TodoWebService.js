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
                resolve(res.body);
        }
    )
);

let patchTodo = (id, updates) => new Promise((resolve,reject) =>
    superagent('PATCH', '/todo/' + id)
        .accept('application/json')
        .set('X-XSRF-TOKEN',getCookie('XSRF-TOKEN'))
        .send({todo:updates.text, done:updates.done})
        .end((err,res) => {
            if (err)
                reject(err);
            else
                resolve(res.body);
        }
    )
);

let deleteTodo = (id) => new Promise((resolve,reject) =>
    superagent('DELETE','/todo/' + id)
        .accept('application/json')
        .set('X-XSRF-TOKEN',getCookie('XSRF-TOKEN'))
        .end((err,res) => {
            if (err)
                reject(err);
            else
                resolve(res.body);
        }
    )
);


module.exports = {
    getAllTodos: getTodos,

    postTodo: postTodo,

    patchTodo: patchTodo,

    deleteTodo: deleteTodo
};

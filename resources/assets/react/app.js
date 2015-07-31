(function () {
    require("babelify/polyfill");
    let React = require('react/addons');
    let injectTapEventPlugin = require('react-tap-event-plugin');
    let TodoApp = require('./todo/TodoApp.react');
    let TodoSyncUtils = require('./todo/utils/TodoSyncUtils');

    window.React = React;

    injectTapEventPlugin();

    TodoSyncUtils.receiveTodos();

    var timer;
    function startSaving() {
        clearTimeout(timer);
        TodoSyncUtils.saveTodos();
        setTimeout(startSaving, 5000);
    }

    startSaving();

    let target = document.querySelector('#container');
    React.render(<TodoApp />, target);
})();

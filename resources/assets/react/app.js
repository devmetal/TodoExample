(function () {
    require("babelify/polyfill");
    let React = require('react/addons');
    let injectTapEventPlugin = require('react-tap-event-plugin');
    let TodoApp = require('./todo/TodoApp.react');
    let TodoSyncUtils = require('./todo/utils/TodoSyncUtils');

    window.React = React;

    injectTapEventPlugin();

    TodoSyncUtils.receiveTodos();

    let target = document.querySelector('#container');
    React.render(<TodoApp />, target);
})();

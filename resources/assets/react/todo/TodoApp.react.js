let React = require('react/addons');
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();

let Todo = require('./components/Todo.react');
let TodoStore = require('./stores/TodoStore');

let AppCanvas = mui.AppCanvas;

let TodoApp = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    getInitialState() {
        return {
            todos: TodoStore.getTodos()
        }
    },

    componentDidMount() {
        TodoStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        TodoStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState({todos: TodoStore.getTodos()});
    },

    render() {
        return (
            <AppCanvas>
                <Todo todos={this.state.todos}/>
            </AppCanvas>
        )
    }
});

module.exports = TodoApp;

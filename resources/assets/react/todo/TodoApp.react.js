let React = require('react/addons');
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();

let Todo = require('./components/Todo.react');
let TodoStore = require('./stores/TodoStore');
let TodoWebService = require('./utils/TodoWebService');

let AppBar = mui.AppBar;
let CircularProgress = mui.CircularProgress;
let Colors = mui.Styles.Colors;
let Toolbar = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let ToolbarTitle = mui.ToolbarTitle;
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
        this.setState({
            todos: TodoStore.getTodos()
        });
    },

    render() {
        return (
            <AppCanvas>
                <Toolbar>
                    <ToolbarGroup key={0} float="left">
                        <ToolbarTitle style={{fontFamily:'Arial'}} text="N+1. Todo" />
                    </ToolbarGroup>
                </Toolbar>
                <div className='main'>
                    <Todo todos={this.state.todos}/>
                </div>
            </AppCanvas>
        )
    }
});

module.exports = TodoApp;
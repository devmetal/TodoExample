let React = require('react/addons');
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();

let List = mui.List;
let TextField = mui.TextField;

let TodoActions = require('../actions/TodoActions');
let TodoListItem = require('./TodoListItem.react');


let Todo = React.createClass({
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
            editing:false,
            editedKey:null,
            editedText:null
        };
    },

    render() {

        let todos = this.props.todos;
        let todoItems = [];

        for (let todo of todos) {
            let sync = todo.sync || false;
            todoItems.push(
                <TodoListItem
                    todo={todo}
                    key={todo.key}
                    sync={sync}
                    onEditStart={this._onEditStart}
                />
            )
        }

        let textField =
            <TextField
                floatingLabelText={(this.state.editing === true) ? "I will edit this item:" : "I have to do"}
                fullWidth={true}
                onEnterKeyDown={(this.state.editing === true) ? this._onUpdate : this._onSave}
                onBlur={this._onBlur}
                ref="todoField"
            />

        return (
            <div>
                {textField}
                <List>
                    {todoItems}
                </List>
            </div>
        )
    },

    _onSave() {
        let field = this.refs.todoField;
        let text = field.getValue().trim();
        if (text.length > 0) {
            TodoActions.create(text);
            field.clearValue();
        }
    },

    _onUpdate() {
        let field = this.refs.todoField;
        let text = field.getValue();
        let key = this.state.editedKey;
        TodoActions.update(key,text);
        field.clearValue();
        this.setState({
            editing:false,
            editedText:null,
            editedKey:null
        });
    },

    _onEditStart(key, text) {
        let field = this.refs.todoField;
        field.setValue(text);
        this.setState({
            editing:true,
            editedKey:key,
            editedText:text
        });
    },

    _onBlur() {
      if (this.state.editing) {
          let field = this.refs.todoField;
          field.clearValue();
          this.setState({
              editing:false,
              editedKey:null,
              editedText:null
          });
      }
    }

});

module.exports = Todo;

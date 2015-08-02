let React = require('react/addons');
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();

let ListItem = mui.ListItem;
let Checkbox = mui.Checkbox;
let IconButton = mui.IconButton;
let ListDivider = mui.ListDivider;
let IconMenu = mui.IconMenu;

let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');
let TodoActions = require('../actions/TodoActions');

let TodoListItem = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    render(){
        let done = this.props.todo.done;
        let text = this.props.todo.text;

        let style = {};
        if (this.props.todo.done) {
            style['textDecoration'] = 'line-through';
        }

        if (this.props.todo.sync) {
            style['color'] = '#aaa';
        }

        let disabled = this.props.todo.id === null;

        let checkbox = <Checkbox disabled={disabled} checked={done} onCheck={this._onCheck}/>;
        let iconButton = <IconButton iconClassName="material-icons">more_vert</IconButton>;
        let iconButtonMenu =
            <IconMenu iconButtonElement={iconButton}>
                <MenuItem disabled={disabled} primaryText="Delete" onClick={this._onDelete} />
                <MenuItem disabled={disabled} primaryText="Edit" onClick={this._onEdit} />
            </IconMenu>
        let deleteIconButton =
            <IconButton onClick={this._onDelete} iconClassName="material-icons">delete</IconButton>
        let textElement = <div style={style}>{text}</div>;

        return (
            <span>
                <ListItem
                    primaryText={textElement}
                    leftCheckbox={checkbox}
                    rightIconButton={(!done) ? iconButtonMenu : deleteIconButton}
                />
                <ListDivider inset={true} />
            </span>
        )
    },

    _onCheck(event, isChecked) {
        let key = this.props.todo.key;
        if (isChecked) {
            TodoActions.done(key);
        } else {
            TodoActions.undone(key);
        }
    },

    _onDelete() {
        let key = this.props.todo.key;
        TodoActions.remove(key);
    },

    _onEdit(e) {
        e.stopPropagation();
        e.preventDefault();

        let key = this.props.todo.key,
            text = this.props.todo.text;

        if (this.props.onEditStart) {
            this.props.onEditStart(key, text);
        }
    }
});

module.exports = TodoListItem;

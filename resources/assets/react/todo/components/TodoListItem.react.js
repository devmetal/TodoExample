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
        let id = this.props.todo.id;
        let sync = this.props.todo.sync;
        let checkbox = null;
        let iconButtonMenu = null;
        let deleteIconButton = null;
        let iconButton = null;

        let style = (this.props.todo.done)?{textDecoration:'line-through'}:{};

        if (id !== null) {
            checkbox = <Checkbox checked={done} onCheck={this._onCheck}/>;
            iconButton = <IconButton iconClassName="material-icons">more_vert</IconButton>;

            iconButtonMenu =
                <IconMenu iconButtonElement={iconButton}>
                    <MenuItem primaryText="Delete" onClick={this._onDelete} />
                    <MenuItem primaryText="Edit" onClick={this._onEdit} />
                </IconMenu>

            deleteIconButton =
                <IconButton onClick={this._onDelete} iconClassName="material-icons">delete</IconButton>
        }

        let syncText = null;
        if (sync === true) {
            syncText = <div><br/><i>Unsaved</i></div>;
        }
        let textElement = <div style={style}>{text}{syncText}</div>;

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

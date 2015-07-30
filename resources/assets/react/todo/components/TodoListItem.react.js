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
        let style = (this.props.todo.done)?{textDecoration:'line-through'}:{};

        let checkbox = <Checkbox checked={done} onCheck={this._onCheck}/>;
        let iconButton = <IconButton iconClassName="material-icons">more_vert</IconButton>;

        let iconButtonMenu =
            <IconMenu iconButtonElement={iconButton}>
                <MenuItem primaryText="Delete" onClick={this._onDelete} />
                <MenuItem primaryText="Edit" onClick={this._onEdit} />
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
        let id = this.props.todo.id;
        if (isChecked) {
            TodoActions.done(id);
        } else {
            TodoActions.undone(id);
        }
    },

    _onDelete() {
        let id = this.props.todo.id;
        TodoActions.remove(id);
    },

    _onEdit(e) {
        e.stopPropagation();
        e.preventDefault();

        let id = this.props.todo.id,
            text = this.props.todo.text;

        if (this.props.onEditStart) {
            this.props.onEditStart(id, text);
        }
    }
});

module.exports = TodoListItem;
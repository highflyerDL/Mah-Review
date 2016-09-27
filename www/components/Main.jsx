import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import NavBar from "./NavBar";
import FlatButton from "material-ui/FlatButton";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        title: "",
        open: false,
        actions: null,
        content: null
      }
    };
    this.onShowDialog = this.onShowDialog.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);

    this.defaultActions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={this.handleDialogClose} />
    ];
  }

  handleDialogClose() {
    this.state.dialog.open = false;
    this.setState(this.state);
  }

  onShowDialog(dialog) {
    dialog.open = true;
    dialog.actions = this.defaultActions;
    this.setState({ dialog });
  }

  render() {
    return (
      <div>
        <NavBar showDialog={this.onShowDialog}/>
        {this.props.children}
        <Dialog title={this.state.dialog.title}
                actions={this.state.dialog.actions}
                modal={false}
                open={this.state.dialog.open}
                onRequestClose={this.handleDialogClose}>
          {this.state.dialog.content}
        </Dialog>
      </div>
    )
  }
}

export default Main;

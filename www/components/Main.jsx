import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import NavBar from "./NavBar";
import Snackbar from 'material-ui/Snackbar';
import FlatButton from "material-ui/FlatButton";
import {getCookie, saveItemLocalStorage} from "../util/storageFactory";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        title: "",
        open: false,
        actions: [],
        content: null
      },
      snackbar: {
        content: "",
        open: false,
        action: null
      }
    };
    this.onShowDialog = this.onShowDialog.bind(this);
    this.onShowSnackbar = this.onShowSnackbar.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);

    this.defaultActions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={this.handleDialogClose} />
    ];
    const token = getCookie("mycookie");
    if(token){
      saveItemLocalStorage("token", token);
    }
  }

  handleDialogClose() {
    this.state.dialog.open = false;
    this.setState(this.state);
  }

  handleSnackbarClose(reason) {
    if(reason==="clickaway"){
      return;
    }
    this.state.snackbar.open = false;
    this.setState(this.state);
  }

  onShowDialog(dialog) {
    dialog.open = true;
    if(dialog.actions){
      dialog.actions.push(this.defaultActions);
    } else {
      dialog.actions = this.defaultActions;
    }
    this.setState({dialog: dialog});
  }

  onShowSnackbar(snackbar){
    snackbar.open = true;
    this.setState({snackbar: snackbar})
  }

  render() {
    return (
      <div>
        <NavBar showDialog={this.onShowDialog} />
        {this.props.children && React.cloneElement(this.props.children, {
          showSnackbar: this.onShowSnackbar,
          showDialog: this.onShowDialog
        })}
        <Dialog title={this.state.dialog.title}
                actions={this.state.dialog.actions}
                modal={false}
                open={this.state.dialog.open}
                onRequestClose={this.handleDialogClose}>
          {this.state.dialog.content}
        </Dialog>
        <Snackbar
          action={this.state.snackbar.action}
          open={this.state.snackbar.open}
          message={this.state.snackbar.content}
          autoHideDuration={this.state.snackbar.duration}
          onRequestClose={this.handleSnackbarClose}
        />
      </div>
    )
  }
}

export default Main;

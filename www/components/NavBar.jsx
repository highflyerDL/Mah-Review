import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from "material-ui/MenuItem";
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from "material-ui/List";
import { Link }from 'react-router';
import { browserHistory } from 'react-router'
import { origin } from "../util/configApp";

function goOAuth(socnet){
  console.log("in oauth",socnet);
  browserHistory.push("/api/"+socnet);
}

const dialogContent =
  <List>
    <a className="non-underline" href={origin+"api/google"}><ListItem primaryText="Sign in using Google account"/></a>
    <a className="non-underline" href={origin+"api/facebook"}><ListItem primaryText="Sign in using Facebook account"/></a>
  </List>;

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { openDrawer: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.showDialog = this.showDialog.bind(this);
  }

  handleToggle() {
    console.log("in");
    this.setState({ openDrawer: !this.state.openDrawer });
  }

  handleClose() { this.setState({ openDrawer: false }) };

  showDialog() {
    var dialog = {
      title: "Sign in",
      content: dialogContent,
    };
    this.props.showDialog(dialog);
  }

  render() {
    return (
      <div id="navbar">
        <AppBar
          title="MahReview"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.handleToggle} onTitleTouchTap={this.handleToggle}/>
        <Drawer open={this.state.openDrawer}
                docked={false}
                onRequestChange={(openDrawer) => this.setState({openDrawer})}>
          <div className="upper-drawer" onTouchTap={this.handleToggle}>MahReview</div>
          <MenuItem onTouchTap={this.showDialog}>Sign in</MenuItem>
          <Link to="/app"><MenuItem>Home</MenuItem></Link>
          <Link to="/app/register"><MenuItem>Menu Item 2</MenuItem></Link>
          <MenuItem onTouchTap={this.handleClose}>Menu Item 3</MenuItem>
        </Drawer>
      </div>
    )
  }
}

export default NavBar;

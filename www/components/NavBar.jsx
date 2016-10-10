import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from "material-ui/MenuItem";
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from "material-ui/List";
import { Link }from 'react-router';
import { browserHistory } from 'react-router'
import { origin } from "../util/configApp";
import { getTokenInfo } from "../util/storageFactory";
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import StarIcon from 'material-ui/svg-icons/toggle/star';
import {yellow500} from "material-ui/styles/colors";
import {clearLocalStorage} from "../util/storageFactory";

function goOAuth(socnet) {
    console.log("in oauth", socnet);
    browserHistory.push("/api/" + socnet);
}

const dialogContent =
    <List>
        <a className="non-underline" href={origin+"api/google"}><ListItem
            primaryText="Sign in using Google account"/></a>
        <a className="non-underline" href={origin+"api/facebook"}><ListItem
            primaryText="Sign in using Facebook account"/></a>
    </List>;

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {openDrawer: false, openPop: false};
        this.handleToggle = this.handleToggle.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.showPopover = this.showPopover.bind(this);
        this.handleClosePop = this.handleClosePop.bind(this);
        this.doLogout = this.doLogout.bind(this);
    }

    handleToggle() {
        console.log("in");
        this.setState({openDrawer: !this.state.openDrawer});
    }

    handleClose() {
        this.setState({openDrawer: false});
    }

    handleClosePop() {
        this.setState({openPop: false});
    }

    showDialog() {
        var dialog = {
            title: "Sign in",
            content: dialogContent,
        };
        this.props.showDialog(dialog);
    }

    showPopover(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openPop: true,
            anchorEl: event.currentTarget,
        });
    }

    doLogout() {
        clearLocalStorage();
        this.setState({openPop: false});
    }

    render() {
        var AccountManagement;
        const username = getTokenInfo("name");
        const profileUrl = getTokenInfo("profileUrl");
        if (username) {
            AccountManagement =
                <div id="userManagement" style={{display: 'flex', alignItems: 'center'}}>
                    <FlatButton style={{color:'#FFFFFF'}} label='200' /*href="/user/points"*/ secondary={true}
                                icon={<StarIcon color={yellow500}/>}/>
                    <FlatButton style={{color:'#FFFFFF'}} onTouchTap={this.showPopover} label={username}
                                secondary={true}
                                icon={<Avatar size={30}>{username[0]}</Avatar>}/>
                    <Popover
                        open={this.state.openPop}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        onRequestClose={this.handleClosePop}>

                        <Menu>
                            <MenuItem primaryText="Settings"/>
                            <MenuItem primaryText="Sign out" onTouchTap={this.doLogout}/>
                        </Menu>
                    </Popover>
                </div>;
        } else {
            AccountManagement =
                <div id="userManagement" style={{display: 'flex', alignItems: 'center'}}>
                    <FlatButton style={{color:'#FFFFFF'}} onTouchTap={this.showDialog} label='Sign in'/>
                </div>;
        }
        return (
            <div id="navbar">
                <AppBar
                    title="MahReview"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onLeftIconButtonTouchTap={this.handleToggle} onTitleTouchTap={this.handleToggle}>
                    {AccountManagement}
                </AppBar>

                <Drawer open={this.state.openDrawer}
                        docked={false}
                        onRequestChange={(openDrawer) => this.setState({openDrawer})}>
                    <div className="upper-drawer" onTouchTap={this.handleToggle}>MahReview</div>
                    <Link to="/app"><MenuItem>Home</MenuItem></Link>
                    <Link to="/app/register"><MenuItem>Menu Item 2</MenuItem></Link>
                    <MenuItem onTouchTap={this.handleClose}>Menu Item 3</MenuItem>
                </Drawer>
            </div>
        )
    }
}

export default NavBar;

import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';

export default class ActionBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      category: 1,
      order: 1

    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event, index, value) {
    this.setState({value});
  } 

  render() {
    return (
      <Toolbar style={{backgroundColor: 'rgb(243, 243, 243)'}}>
        <ToolbarGroup firstChild={true}>
          <DropDownMenu value={this.state.category} onChange={this.handleChange}>
            <MenuItem value={1} primaryText="Category 1" />
            <MenuItem value={2} primaryText="Category 2" />
          </DropDownMenu>
          <DropDownMenu value={this.state.order} onChange={this.handleChange}>
            <MenuItem value={1} primaryText="Newest" />
            <MenuItem value={2} primaryText="Popular" />
          </DropDownMenu>
        </ToolbarGroup>
        <ToolbarGroup>
          <TextField
            hintText="Search..."
          />
          <FontIcon className="muidocs-icon-custom-sort" />
          <ToolbarSeparator />
          <RaisedButton label="Create Post" primary={true} />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
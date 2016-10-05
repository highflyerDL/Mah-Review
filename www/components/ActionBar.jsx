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
import SelectField from 'material-ui/SelectField';
import {callFormDataApi} from '../util/callApi';
import FlatButton from "material-ui/FlatButton";
import CircularProgress from 'material-ui/CircularProgress';
import {callbackSnackbar, loadingSnackbar} from "../util/snackbarFactory";

const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  col: {
    width: '50%',
    float: 'left'
  }
};
var submitPostForm;
class CreatePostForm extends React.Component {
  constructor(){
    super();
    this.state = {
      title: "",
      description: "",
      reward: "",
      expire: 0,
      images: [],
      imageNames: [],
      errors: {
        title: "",
        description: "",
        reward: "",
        expire: "",
        images: ""
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.submitForm = this.submitForm.bind(this);
    submitPostForm = this.submitForm.bind(this);
  }

  handleChange(type, event, selectValue){
    if(type == "expire"){
      this.state[type] = selectValue;
    } else {
      this.state[type] = event.target.value;
    }
    this.setState(this.state);
  }

  handleFile(e){
    this.state.images = e.target.files;
    this.state.imageNames.length = 0;
    for(var i = 0; i<e.target.files.length; i++){
      this.state.imageNames.push(e.target.files[i].name);
    }
    this.setState(this.state);
  }

  submitForm(){
    var isError = false;
    const pattern = /^[1-9][0-9]*$/;
    if(this.state.title.length==0){
      isError = true;
      this.state.errors.title = "This field is required";
    } else {
      this.state.errors.title = "";
    }
    if(this.state.description.length==0){
      isError = true;
      this.state.errors.description = "This field is required";
    } else {
      this.state.errors.description = "";
    }
    if(this.state.reward.length == 0){
      isError = true;
      this.state.errors.reward = "This field is required";
    } else {
      if(!pattern.test(this.state.reward)){
        this.state.errors.reward = "Please enter valid reward number";
      } else {
        this.state.errors.reward = "";
      }
    }
    if(this.state.expire == 0){
      isError = true;
      this.state.errors.expire = "Please choose valid expiry period";
    } else {
      this.state.errors.expire = "";
    }
    if(isError){
      this.setState(this.state);
      return;
    } else {
      this.setState(this.state);
    }
    var formData = new FormData();
    for(var i = 0; i<this.state.images.length; i++){
      formData.append('files', this.state.images[i]);
    }
    formData.append('title', this.state.title);
    formData.append('description', this.state.description);
    formData.append('reward', this.state.reward);
    formData.append('expire', this.state.expire);
    this.props.showSnackbar(loadingSnackbar())
    callFormDataApi("post", formData, "POST").then((res)=>{
      this.props.showSnackbar(callbackSnackbar("Post successfully published !"));
      this.props.closeDialog();
    }, (err)=>{
      this.props.showSnackbar(callbackSnackbar(err.message.message));
    });
  }

  render(){
    var images;
    return (
      <div>
        <div style={styles.col}>
          <TextField
            hintText="Title"
            errorText={this.state.errors.title}
            onChange={(event)=>this.handleChange("title", event)}
          />
          <br />
          <TextField      
            multiLine={true}
            rows={2}
            rowsMax={4}
            errorText={this.state.errors.description}
            hintText="Description"
            onChange={(event)=>this.handleChange("description", event)}
          />
          <br />
          <TextField
            errorText={this.state.errors.reward}
            hintText="Reward"
            onChange={(event)=>this.handleChange("reward", event)}
          />
          <br />
          <SelectField value={this.state.expire} 
                      onChange={(event, index, value)=>this.handleChange("expire", event, value)}
                      errorText={this.state.errors.expire}>
            <MenuItem value={0} primaryText="Expiry Period" />
            <MenuItem value={7} primaryText="7 Days" />
            <MenuItem value={14} primaryText="14 Days" />
            <MenuItem value={30} primaryText="30 Days" />
            <MenuItem value={60} primaryText="60 Days" />
            <MenuItem value={90} primaryText="90 Days" />
          </SelectField>
        </div>
        <div style={styles.col}>
          <RaisedButton
                label="Choose Images"
                labelPosition="before"
                style={styles.button}
              >
                <input type="file" style={styles.exampleImageInput} onChange={this.handleFile} multiple/>
          </RaisedButton>
          <br/>
          {
            this.state.imageNames.map((name, index)=>{
              return <div key={index}>{name}</div>;
            })
          }
        </div>
      </div>
    )
  }
}

export default class ActionBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 1,
      order: 1

    };
    this.handleChange = this.handleChange.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  handleChange (event, index, value) {
    this.setState({value});
  } 

  closeDialog(){
    this.props.showDialog({}, true);
  }

  showDialog(){
    const dialog = {
      title: "Create Post",
      content: <CreatePostForm closeDialog={this.closeDialog} showSnackbar={this.props.showSnackbar}/>,
      actions: [<FlatButton label="Submit" primary={true} onTouchTap={()=>submitPostForm()}/>]
    }
    this.props.showDialog(dialog);
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
          <RaisedButton label="Create Post" primary={true} onTouchTap={this.showDialog}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {callbackSnackbar, loadingSnackbar} from "../util/snackbarFactory";
import {callJsonApi} from "../util/callApi";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewMessage: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(e){
    this.setState({reviewMessage: e.target.value});
  }

  onSubmit(){
    this.props.showSnackbar(loadingSnackbar());
    callJsonApi("post/"+this.props.postId+"/review", {content: this.state.reviewMessage}, "POST")
      .then((res)=>{
        this.props.showSnackbar(callbackSnackbar("Review posted!"));
        this.setState({reviewMessage: ""});
      })
      .catch((err)=>{
        this.props.showSnackbar(callbackSnackbar(err.message.message));
      });
  }

  render() {
    const textAreaStyle= {
      width: '100%',
      marginBottom: '20px',
      minHeight: '120px'
    };
    return (
      <div>
        <h2>Write your own review</h2>
        <textarea style={textAreaStyle} onChange={this.handleChange} value={this.state.reviewMessage}/>
        <RaisedButton onTouchTap={this.onSubmit} label="Post" primary={true}/>
      </div>
    )
  }
}

export default Editor;
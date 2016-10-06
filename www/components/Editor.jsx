import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewMessage: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.onEditorSubmit = this.onEditorSubmit.bind(this);
  }

  onEditorSubmit() {
    this.props.showSnackbar(loadingSnackbar());
    this.props.onSubmit(this.state.reviewMessage);
    this.setState({reviewMessage: ""});
  }

  handleChange(e){
    this.setState({reviewMessage: e.target.value});
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
        <RaisedButton onTouchTap={this.onEditorSubmit} label="Post" primary={true}/>
      </div>
    )
  }
}

export default Editor;
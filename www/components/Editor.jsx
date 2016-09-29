import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
class Editor extends Component {
  constructor() {
    super();
  }

  render() {
    const textAreaStyle= {
      width: '100%',
      marginBottom: '20px',
      minHeight: '120px'
    };
    const snackbar = {
      content : <span style={{verticalAlign:'top'}}>Loading...<CircularProgress size={0.5}/></span>,
      duration: 3000
    };
    return (
      <div>
        <h2>Write your own review</h2>
        <textarea style={textAreaStyle}/>
        <RaisedButton onTouchTap={()=>{this.props.showSnackbar(snackbar)}} label="Post" primary={true}/>
      </div>
    )
  }
}

export default Editor;
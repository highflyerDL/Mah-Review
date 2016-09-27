import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
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
    return (
      <div>
        <h2>Write your own review</h2>
        <textarea style={textAreaStyle}/>
        <RaisedButton label="Post" primary={true}/>
      </div>
    )
  }
}

export default Editor;
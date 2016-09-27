import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/divider';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Star from 'material-ui/svg-icons/toggle/star';
import IconButton from 'material-ui/IconButton';

class Review extends Component {
  constructor() {
    super();
  }

  render() {
    const item = this.props;
    var Approved;
    if(item.isApproved){
      Approved = <div className="star"><Star style={{color: '#0077cc', fontSize: '18px'}}/><i>Approved</i></div>
    }
    return (
      <div style={{paddingBottom: '70px'}}>
        <Divider/>
        <table>
          <tbody>
            <tr>
              <td>
                <ul>
                  <li>
                    <IconButton>
                      <KeyboardArrowUp/>
                    </IconButton>
                  </li>
                  <li style={{textAlign: 'center'}}>
                    {item.votes} votes
                  </li>
                  <li>
                    <IconButton>
                      <KeyboardArrowDown/>
                    </IconButton>
                  </li>
                </ul>
              </td>
              <td id="review-content">
                {Approved}
                <h3>{item.title}</h3>
                <div>
                  {item.content}
                </div>
                <div style={{position:'relative'}}>
                  <div style={{position:'absolute', right: 0, top: 10, color: '#444444', fontSize: '14px'}}>
                    posted<span> {item.date}</span>
                    <div style={{marginTop:'8px'}}>
                      <Avatar src="" size={30}/><span style={{position: 'absolute', marginLeft: '10px', fontSize: '16px', color: '#07C', fontWeight: 900}}>{item.author}</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Review;

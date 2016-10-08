import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from "react-router";
import callApi from '../util/callApi';
import {dateFormat} from "../util/tools";
import StarIcon from 'material-ui/svg-icons/toggle/star';
import {yellow500} from "material-ui/styles/colors";

const Reward = (points)=>{
  return <div><StarIcon color={yellow500}/><span>{points}+</span></div>
}
class Post extends Component {

  constructor() {
    super();
  }

  render() {
    var cardStyle = this.props.index %2 === 0 ? "even" : "odd";
    cardStyle = "product-card " + cardStyle;
    const actionStyle = {
      textAlign: 'center'
    };
    const pathRoute = "app/post/"+this.props.id;
    
    return (
      <div className={cardStyle}>
        <Card>
          <CardHeader
            title={this.props.author}
            subtitle={"Published on "+dateFormat(this.props.created)}
            avatar="">
            <div style={{position:"absolute", top:"25px", right:"30px"}}><StarIcon color={yellow500}/>
              <span style={{verticalAlign:"super"}}>{this.props.reward}+</span>
            </div>
          </CardHeader>
          <CardMedia
            overlay={<CardTitle title={this.props.title} subtitle={this.props.categoryName} />}
          >
            <img src={this.props.img} />
          </CardMedia>
          <CardTitle subtitle={"Expired on "+dateFormat(this.props.expire)} />
          <CardText>
            {this.props.description}
          </CardText>
          <CardActions style={actionStyle}>
            <Link to={pathRoute}><RaisedButton label="View Details" primary={true}></RaisedButton></Link>
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default Post;
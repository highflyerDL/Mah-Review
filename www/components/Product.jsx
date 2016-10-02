import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from "react-router";
class Product extends Component {
  constructor() {
    super();
  }

  render() {
    var cardStyle = this.props.index %2 === 0 ? "even" : "odd";
    cardStyle = "product-card " + cardStyle;
    const actionStyle = {
      textAlign: 'center'
    };
    const pathRoute = "app/product/"+this.props.id;
    
    return (
      <div className={cardStyle}>
        <Card>
          <CardHeader
            title={this.props.author}
            subtitle="Subtitle"
            avatar=""
          />
          <CardMedia
            overlay={<CardTitle title={this.props.title} subtitle="Overlay subtitle" />}
          >
            <img src={this.props.img} />
          </CardMedia>
          <CardTitle title="Card title" subtitle="Card subtitle" />
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
          <CardActions style={actionStyle}>
            <Link to={pathRoute}><RaisedButton label="View Details" primary={true}></RaisedButton></Link>
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default Product;
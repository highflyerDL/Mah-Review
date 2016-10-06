import React, { Component } from 'react';
import Slider from 'react-slick';
import Avatar from 'material-ui/Avatar';
import Review from './Review';
import Editor from './Editor';
import { callQueryParamsApi, callJsonApi } from "../util/callApi";
import {callbackSnackbar, loadingSnackbar} from "../util/snackbarFactory";

var reviewMock = [{
  id: 1,
  title: "Review 1",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.",
  author: "user1",
  votes: 5,
  date: "Aug 27 '16 at 9:59 pm",
  isApproved: true
}, {
  id: 2,
  title: "Review 2",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.",
  author: "user2",
  votes: 8,
  date: "Aug 27 '16 at 9:59 pm",
  isApproved: false
}];

class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.postId = props.params.id;
    this.state = {
      post: null
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    callQueryParamsApi("post/" + this.postId, {})
      .then((res) => {
        this.setState({ post: res.data });
        console.log(res);
      })
      .catch((err) => {
        console.log("error", err)
      });
  }

  onSubmit(message) {
    callJsonApi("post/" + this.postId + "/review", { content: message }, "POST")
      .then((res) => {
        this.state.post.reviews.unshift(res.data)
        this.setState(this.state);
        this.props.showSnackbar(callbackSnackbar("Review posted!"));
      })
      .catch((err) => {
        this.props.showSnackbar(callbackSnackbar(err.message.message));
      });
  }

  render() {
    const divStyle = {
      paddingTop: '10px'
    };
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    var DataNode = null;
    console.log("in", this.state.post);
    if (this.state.post) {
      DataNode =
        <div>
          <div id="product-info">
            <div className='slide-container'>
              <Slider {...settings}>
                {
                  this.state.post.images.map((img)=>{
                    return <div key={img._id}><img src={img.url} /></div>;
                  })
                }
              </Slider>
            </div>
            <div className='details-container'>
              <h2>{this.state.post.title}</h2>
              <Avatar src="" size={30}/><span style={{position: 'absolute', marginLeft: '10px'}}>{this.state.post.owner.name}</span>
              <div style={divStyle}><i>Published at {this.state.post.created}</i></div>
              <div style={divStyle}><b>Description: </b>
                {this.state.post.description}
              </div>
            </div>
          </div>
          <div className='review-container'>
            <h1>Reviews</h1>
            {this.state.post.reviews.map((review)=>{
              return <Review key={review._id}
                            title={review.title}
                            author={review.owner.name}
                            date={review.created}
                            content={review.content}
                            votes={review.vote}
                            isApproved={review.isApproved}/>
            })}
            <Editor onSubmit={this.onSubmit} postId={this.props.params.id} showSnackbar={this.props.showSnackbar}/>
          </div>
        </div>;
    }
    return DataNode;
  }
}

export default PostDetails;

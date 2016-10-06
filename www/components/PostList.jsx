import React, { Component } from 'react';
import Post from "./Post";
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconButton from 'material-ui/IconButton';
import ActionBar from "./ActionBar";
import { callQueryParamsApi, callFormDataApi } from '../util/callApi';
import { callbackSnackbar, loadingSnackbar } from "../util/snackbarFactory";

const buttonStyle = {
  height: '100%',
  float: 'left',
  width: '100%'
};

const arrowStyle = {
  width: '100%',
  height: 'auto'
};
var mockData = [{
  id: 1,
  img: 'http://placehold.it/350x150',
  title: 'Breakfast',
  author: 'jill111',
}, {
  id: 2,
  img: 'http://placehold.it/350x150',
  title: 'Tasty burger',
  author: 'pashminu',
}, {
  id: 3,
  img: 'http://placehold.it/350x150',
  title: 'Camera',
  author: 'Danson67',
}, {
  id: 4,
  img: 'http://placehold.it/350x150',
  title: 'Morning',
  author: 'fancycrave1',
}, {
  id: 5,
  img: 'http://placehold.it/350x150',
  title: 'Hats',
  author: 'Hans',
}, {
  id: 6,
  img: 'http://placehold.it/350x150',
  title: 'Honey',
  author: 'fancycravel',
}, ];

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.onCreatePost = this.onCreatePost.bind(this);
  }

  componentWillMount() {
    this.props.showSnackbar(loadingSnackbar())
    callQueryParamsApi("post", {})
      .then((res) => {
        this.state.data = res.data;
        this.props.showSnackbar(callbackSnackbar("Posts successfully retrieved !"));
      })
      .catch((err) => {
        this.props.showSnackbar(callbackSnackbar(err.message.message));
      });
  }

  onCreatePost(formData){
    this.props.showSnackbar(loadingSnackbar());
    callFormDataApi("post", formData, "POST").then((res)=>{
      this.props.showSnackbar(callbackSnackbar("Post successfully published !"));
      this.props.showDialog({}, true);
    }, (err)=>{
      this.props.showSnackbar(callbackSnackbar(err.message));
    });
  }

  render() {
    return (
      <div>
        <ActionBar showDialog={this.props.showDialog} showSnackbar={this.props.showSnackbar} onCreatePost={this.onCreatePost}/>
        <div className="product-container">
          {this.state.data.map((product, index) => {
            return <Post title={product.title}
                        author={product.owner.name}
                        img={product.images[0].url}
                        key={product._id}
                        id={product._id}
                        index={index}/>
          })}
        </div>
      </div>
    )
  }
}

export default PostList;

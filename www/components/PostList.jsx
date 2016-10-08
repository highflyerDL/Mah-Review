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
    this.state = { postList: [] };
    this.categoryList = [];
    this.onCreatePost = this.onCreatePost.bind(this);
    this.onPostsRetrieve = this.onPostsRetrieve.bind(this);
  }

  onPostsRetrieve(postList){
    this.state.postList = postList;
    this.setState(this.state);
  }

  componentWillMount() {
    // this.props.showSnackbar(loadingSnackbar())
    callQueryParamsApi("post", {})
      .then((res) => {
        this.state.postList = res.data;
        callQueryParamsApi("category", {})
          .then((res)=>{
            this.categoryList = res.data;
            this.state.postList.forEach((post)=>{
              this.categoryList.forEach((category)=>{
                if(post.category == category._id){
                  post.categoryName = category.name;
                }
              });
            });
            this.setState(this.state);
          })
          .catch((err)=>{
            this.props.showSnackbar(callbackSnackbar(err.message));
          });
        // this.props.showSnackbar(callbackSnackbar("Posts successfully retrieved !"));
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
        <ActionBar showDialog={this.props.showDialog} 
                  showSnackbar={this.props.showSnackbar} 
                  onCreatePost={this.onCreatePost}
                  onPostsRetrieve={this.onPostsRetrieve}
                  categoryList={this.categoryList}
                  />
        <div className="product-container">
          {this.state.postList.map((post, index) => {
            return <Post title={post.title}
                        author={post.owner.name}
                        description={post.description}
                        categoryName={post.categoryName}
                        img={post.images[0].url}
                        reward={post.reward}
                        expire={post.expire}
                        created={post.created}
                        key={post._id}
                        id={post._id}
                        index={index}/>
          })}
        </div>
      </div>
    )
  }
}

export default PostList;

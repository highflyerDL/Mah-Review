import React, { Component } from 'react';
import Post from "./Post";
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconButton from 'material-ui/IconButton';
import ActionBar from "./ActionBar";
import { callQueryParamsApi, callFormDataApi } from '../util/callApi';
import { callbackSnackbar, loadingSnackbar } from "../util/snackbarFactory";
import { getItemLocalStorage } from "../util/storageFactory";
import RaisedButton from 'material-ui/RaisedButton';

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
},];

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = { postList: [], hasMore: true, queryObject: {}, pageNumber: 1, pageLimit : 1 };
    this.categoryList = [];
    this.onCreatePost = this.onCreatePost.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    this.loadMore();
  }

  onCreatePost(formData) {
    this.props.showSnackbar(loadingSnackbar());
    callFormDataApi("post", formData, "POST").then((res) => {
      this.props.showSnackbar(callbackSnackbar("Post successfully published !"));
      res.data.owner.name = getItemLocalStorage("userName");
      this.state.postList.unshift(res.data)
      this.props.showDialog({}, true);
    }, (err) => {
      this.props.showSnackbar(callbackSnackbar(err.message));
    });
  }

  loadMore(queryObject, isReset){
    this.props.showSnackbar(loadingSnackbar());
    if(isReset){
      this.state.pageNumber = 1;
    }
    this.state.queryObject.page = this.state.pageNumber || 1;
    if(queryObject){
      this.state.queryObject = queryObject;
    }
    callQueryParamsApi("post", this.state.queryObject)
      .then((postList) => {
        if(!isReset){
          postList.data.forEach((post)=>{
            this.state.postList.push(post);
          })
        } else {
          this.state.postList = postList.data;
        }
        this.state.pageLimit = postList.totalPage;
        this.state.hasMore = this.state.pageNumber < this.state.pageLimit;
        callQueryParamsApi("category", {})
          .then((res) => {
            this.categoryList = res.data;
            this.state.postList.forEach((post) => {
                post.categoryName = post.category.name;
            });
            this.setState(this.state);
            this.props.showSnackbar(callbackSnackbar("Posts successfully retrieved!"));
          })
          .catch((err) => {
            this.props.showSnackbar(callbackSnackbar(err.message));
          });
      })
      .catch((err) => {
        this.props.showSnackbar(callbackSnackbar(err.message.message));
      });
  }

  render() {
    var loadMoreButton;
    if(this.state.pageNumber < this.state.pageLimit){
      loadMoreButton =
        <RaisedButton label="Load more" secondary={true}
          style={{display: 'block', width: '200px', margin: '0 auto 50px auto', boxShadow: 'none'}}
          onTouchTap={()=>{
            console.log(this.state.pageNumber, this.state.pageLimit);
            this.state.pageNumber++;
            this.loadMore();
          }}/>
    } else {
      loadMoreButton = null;
    }
    return (
      <div>
        <ActionBar showDialog={this.props.showDialog}
                  showSnackbar={this.props.showSnackbar}
                  onCreatePost={this.onCreatePost}
                  loadMore={this.loadMore}
                  categoryList={this.categoryList}
                  />
        <div className="product-container">
          {this.state.postList.map((post, index) => {
            return <Post title={post.title}
                        author={post.owner.name}
                        avatar={post.owner.avatar}
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
        {loadMoreButton}
      </div>
    )
  }
}

export default PostList;

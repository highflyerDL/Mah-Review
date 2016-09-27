import React, { Component } from 'react';
import Slider from 'react-slick';
import Avatar from 'material-ui/Avatar';
import Review from './Review';
import Editor from './Editor';
var reviewMock = [
  {
    id: 1,
    title: "Review 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.",
    author: "user1",
    votes: 5,
    date: "Aug 27 '16 at 9:59 pm",
    isApproved: true
  },
  {
    id: 2,
    title: "Review 2",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.",
    author: "user2",
    votes: 8,
    date: "Aug 27 '16 at 9:59 pm",
    isApproved: false
  }
];

class ProductDetails extends Component {
  constructor() {
    super();
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
    return (
      <div>
        <div id="product-info">
          <div className='slide-container'>
            <Slider {...settings}>
              <div><img src='http://placekitten.com/g/800/600' /></div>
              <div><img src='http://placekitten.com/g/800/600' /></div>
              <div><img src='http://placekitten.com/g/400/200' /></div>
              <div><img src='http://placekitten.com/g/400/200' /></div>
              <div><img src='http://placekitten.com/g/400/200' /></div>
            </Slider>
          </div>
          <div className='details-container'>
            <h2>Product name</h2>
            <Avatar src="" size={30}/><span style={{position: 'absolute', marginLeft: '10px'}}>Username</span>
            <div style={divStyle}><i>Published at 09-06-2016 9:69</i></div>
            <div style={divStyle}><b>Description: </b>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </div>
          </div>
        </div>
        <div className='review-container'>
          <h1>Reviews</h1>
          {reviewMock.map((review)=>{
            return <Review key={review.id}
                          title={review.title}
                          author={review.author}
                          date={review.date}
                          content={review.content}
                          votes={review.votes}
                          isApproved={review.isApproved}/>
          })}
          <Editor/>
        </div>
      </div>
    );
  }
}

export default ProductDetails;

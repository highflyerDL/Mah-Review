process.env.NODE_ENV = 'test';
import User from '../backend/models/user';
import Post from '../backend/models/post';
import Review from '../backend/models/review';
import supertest from 'supertest';
import should from 'should';
var app=require('../index');

let server = supertest(app);


describe('Review controller', () => {
    var token,testPost,testUser,testPostId;
    before((done) => {
        User.remove({})
        .then(()=>{
          let user = new User();
          user.name = "Test User";
          user.email = "test@gmail.com";
          user.setPassword("1234");
          return user.save();
        })
        .then((user)=>{
          token=user.generateJwt();
          testUser=user;
          return Post.create({
            title:"Another test",
            description:"Another test description",
            reward:10,
            expire:3
          });
        })
        .then((post)=>{
          testPost=post;
          testPostId=testPost._id.toString();
          return Review.remove({});
        })
        .then(()=>{
          done();
        },done).catch((err)=>{
          done(err);
        });
    });

    describe('/GET reviews', () => {
        it('should GET reviews successfully', (done) => {
            server.get('/api/post/'+testPostId)
                  .expect("Content-type",/json/)
                  .expect(200)
                  .end(function(err,res){
                    res.body.should.have.property("data");
                    done(err);
                  });
        });
    });
    describe('/POST new review', () => {
        it('should create new review because right data and correct token header', (done) => {
            const data = {
              content: 'A new review'
              };
            server.post('/api/post/'+testPostId+'/review')
                  .set('Authorization',token)
                  .send(data)
                  .expect("Content-type",/json/)
                  .expect(200)
                  .end(function(err,res){
                    //res.body.message.should.be.equal('Permissions denied');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });
        it('should response error because invalid token', (done) => {
            const data = {
              content: 'A new review'
              };
              server.post('/api/post/'+testPostId+'/review')
                  .set('Authorization',"Chim to")
                  .send(data)
                  .expect("Content-type",/json/)
                  .expect(401)
                  .end(function(err,res){
                    res.body.message.should.be.equal('Invalid token');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });
        it('should response error because wrong token header', (done) => {
          const data = {
            content: 'A new review'
            };
            server.post('/api/post/'+testPostId+'/review')
                  .send(data)
                  .expect(401)
                  .expect("Content-type",/json/)
                  .end(function(err,res){
                    res.body.message.should.be.equal('not authorized');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });
        it('should response error because of missing data', (done) => {
            const data = {
              };
              server.post('/api/post/'+testPostId+'/review')
                  .set('Authorization',token)
                  .send(data)
                  .expect(403)
                  .expect("Content-type",/json/)
                  .end(function(err,res){
                    res.body.message.should.be.equal('All fields required');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });

    });
    describe('/PUT update a review', () => {
        var testReview;
        beforeEach(function(done) {
          Review.create({
            content:"A test review",
            post:testPost._id
          }).then((review)=>{
            testReview=review;
            testPost.reviews.unshift(review);
            return testPost.save();
          }).then((post)=>{
            done();
          },done)
          .catch((err)=>{
            done(err);
          });
        });
        it('should response error because no permissions', (done) => {
            const data = {
                content:"Another review content"
              };
            server.put('/api/review/'+testReview._id)
                  .set('Authorization',token)
                  .send(data)
                  .expect(400)
                  .expect("Content-type",/json/)
                  .end(function(err,res){
                    res.body.message.should.be.equal('Permission denied');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });
        it('should update review with right permissions and data', (done) => {
            const data = {
                content:"Another review content"
              };
              testUser.isAdmin=true;
              testUser.save().then(()=>{
                server.put('/api/review/'+testReview._id)
                      .set('Authorization',token)
                      .send(data)
                      .expect(200)
                      .expect("Content-type",/json/)
                      .end(function(err,res){
                        //res.body.data.content.should.be.equal("Another review content");
                        done(err);
                      });
              });
        });
    });


});

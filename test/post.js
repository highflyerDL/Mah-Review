process.env.NODE_ENV = 'test';
import User from '../backend/models/user';
import Post from '../backend/models/post';
import Category from '../backend/models/category';
import supertest from 'supertest';
import should from 'should';
var app=require('../index');

let server = supertest(app);


describe('Post controller', () => {
    var token,testCategory,testUser;
    before((done) => {
        User.remove({}).then(()=>{
          let user = new User();
          user.name = "Test User";
          user.email = "test@gmail.com";
          user.setPassword("1234");
          return user.save();
        })
        .then((user)=>{
          token=user.generateJwt();
          testUser=user;
          return Category.create({
            name:"test",
            description:"testing"
          })
        }).then((category)=>{
          testCategory=category;
          return Post.remove({});
        }).then(()=>{
          done();
        },done).catch((err)=>{
          done(err);
        });
    });
  describe('/GET posts', () => {
      it('should GET all posts successfully', (done) => {
          server.get('/api/post')
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                  res.body.should.have.property("data");
                  res.body.should.have.property("totalPage");
                  res.body.should.have.property("totalPost");
                  res.body.should.have.property("postCount");
                  res.body.should.have.property("currentPage");
                  done(err);
                });
      });
  });
  describe('/POST new post', () => {
      it('should create new post with data and correct token header without image', (done) => {
          let catId=testCategory._id.toString();
          server.post('/api/post')
                .set('Authorization',token)
                .field('title', 'test')
                .field('description', 'test description')
                .field('expire',7)
                .field('category',catId)
                .field('reward',100)
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                  //res.body.message.should.be.equal('Permissions denied');
                  res.body.should.have.property("data");
                  done(err);
                });
      });
      /* Very expensive test case should be enable only when you are rich
      it('should create new post with data and correct token header with image', (done) => {
          server.post('/api/post')
                .set('Authorization',token)
                .field('title', 'test')
                .field('description', 'test description')
                .field('expire',7)
                .field('reward',100)
                .field('category',testCategory._id.toString())
                .attach('files', 'test/resource/Corina.png')
                .attach('files', 'test/resource/Xrina.png')
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                  //res.body.message.should.be.equal('Permissions denied');
                  res.body.should.have.property("data");
                  done(err);
                });
      });
      */
      it('should response invalid because data and wrong token header', (done) => {

          server.post('/api/post')
                .set('Authorization',"Chim to")
                .field('title', 'test')
                .field('description', 'test description')
                .field('expire',7)
                .field('reward',100)
                .expect("Content-type",/json/)
                .expect(401)
                .end(function(err,res){
                  res.body.message.should.be.equal('Invalid token');
                  //res.body.should.have.property("data");
                  done(err);
                });
      });
      it('should response not authorized without token header', (done) => {
          server.post('/api/post')
                .field('title', 'test')
                .field('description', 'test description')
                .field('expire',7)
                .field('reward',100)
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
            name: 'Test Post'
            };
          server.post('/api/post')
                .set('Authorization',token)
                .field('title', 'test')
                .expect(403)
                .expect("Content-type",/json/)
                .end(function(err,res){
                  res.body.message.should.be.equal('All fields required');
                  //res.body.should.have.property("data");
                  done(err);
                });
      });
  });

  describe('/PUT update a Post', () => {
      var testPost;
      beforeEach(function() {
        return Post.create({
          title:"test",
          description:"testing",
          reward:100,
          expire:9
        }).then((post)=>{
          testPost=post;
        }).catch((err)=>{
          done(err);
        });
      });
      it('should response permission denied because not owner', (done) => {
          const data = {
              title:"Another test",
              description:"Another test description",
              reward:10,
              expire:3
            };
          server.put('/api/post/'+testPost._id)
                .set('Authorization',token)
                .send(data)
                .expect(403)
                .expect("Content-type",/json/)
                .end(function(err,res){
                  res.body.message.should.be.equal("Permission denied");
                  done(err);
                });
      });
      it('should update post because user has permission', (done) => {
          const data = {
              title:"Another test",
              description:"Another test description",
              reward:10,
              expire:3
            };
          testUser.isAdmin=true;
          testUser.save().then(()=>{
            server.put('/api/post/'+testPost._id)
                  .set('Authorization',token)
                  .send(data)
                  .expect(200)
                  .expect("Content-type",/json/)
                  .end(function(err,res){
                    res.body.data.title.should.be.equal("Another test");
                    res.body.data.description.should.be.equal("Another test description");
                    res.body.data.reward.should.be.equal(10);
                    done(err);
                  });
          });
      });
  });


});

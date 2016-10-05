process.env.NODE_ENV = 'test';
import User from '../backend/models/user';
import supertest from 'supertest';
import should from 'should';
var app=require('../index');

let server = supertest(app);


describe('Category controller', () => {
    var token,testUser;
    before((done) => {
        User.remove({}, (err) => {
           done();
        });
        let user = new User();
        user.name = "Test User";
        user.email = "test@gmail.com";
        user.setPassword("1234");
        user.save().then((user)=>{
          token=user.generateJwt();
          testUser=user;
        }).catch((err)=>{
          console.log(err);
          done(err);
        });
    });
  describe('/GET users', () => {
      it('Get user list successfully', (done) => {
          server.get('/api/user')
                .set('Authorization',token)
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                  res.body.should.have.property("data");
                  done();
                });
      });
  });
  describe('/POST new avatar', () => {

    /* Very expensive test case should be enable only when you are rich
    it('Post new avatar with data and correct token header', (done) => {
    server.post('/api/user/avatar')
              .set('Authorization',token)
              .attach('avatar', 'test/resource/Xrina.png')
              .expect("Content-type",/json/)
              .expect(200)
              .end(function(err,res){
                //res.body.message.should.be.equal('Permissions denied');
                res.body.should.have.property("data");
                done(err);
              });
    });
    */
    it('Post new avatar with data and wrong token header', (done) => {

        server.post('/api/user/avatar')
              .set('Authorization',"Chim to")
              .attach('avatar', 'test/resource/Xrina.png')
              .expect("Content-type",/json/)
              .expect(401)
              .end(function(err,res){
                res.body.message.should.be.equal('Invalid token');
                //res.body.should.have.property("data");
                done(err);
              });
    });
    it('Post new post with data without token header', (done) => {

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
    it('Right token header but miss data', (done) => {
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
  describe('/PUT update a user profile', () => {
      it('Right token header', (done) => {
          const data = {
              name:"Another name",
              email:"Another email"
            };
          server.put('/api/user')
                .set('Authorization',token)
                .send(data)
                .expect(200)
                .expect("Content-type",/json/)
                .end(function(err,res){
                  res.body.data.name.should.be.equal('Another name');
                  res.body.data.email.should.be.equal('Another email');
                  //res.body.should.have.property("data");
                  done(err);
                });
      });
  });

});

process.env.NODE_ENV = 'test';
import User from '../backend/models/user';
import supertest from 'supertest';
import should from 'should';
var app=require('../index');

let server = supertest(app);


describe('User controller', () => {
    var token,testUser;
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
          done();
        },done).catch((err)=>{
          console.log(err);
          done(err);
        });
    });

  describe('/GET users', () => {
      it('should GET user list successfully', (done) => {
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
  describe('/PUT new avatar', () => {

    /* Very expensive test case should be enable only when you are rich
    it('should update avatar with data and correct token header', (done) => {
    server.put('/api/user/avatar')
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
    it('should response error because wrong auth token', (done) => {

        server.put('/api/user/avatar')
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
    it('should not update avatar because missing token header', (done) => {

        server.put('/api/user/avatar')
              .attach('avatar', 'test/resource/Xrina.png')
              .expect(401)
              .expect("Content-type",/json/)
              .end(function(err,res){
                res.body.message.should.be.equal('not authorized');
                //res.body.should.have.property("data");
                done(err);
              });
    });

  });
  describe('/PUT update a user profile', () => {
      it('should update user profile with right token and data', (done) => {
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

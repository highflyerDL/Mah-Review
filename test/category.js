process.env.NODE_ENV = 'test';
import User from '../backend/models/user';
import Category from '../backend/models/category';
import supertest from 'supertest';
import should from 'should';
var app=require('../index');

let server = supertest(app);


describe('Category controller', () => {
    var token;
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
          return Category.remove({});
        }).then(()=>{
          done();
        },done).catch((err)=>{
          done(err);
        });
    });
  describe('/GET categories', () => {
      it('Get category successfully', (done) => {
          server.get('/api/category')
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                  res.body.should.have.property("data");
                  done();
                });
      });
  });
  describe('/POST new category', () => {
      it('Post new category with data and correct token header', (done) => {
          const data = {
            name: 'Test category',
            description: 'Something lorem ipsum'
            };
          server.post('/api/category')
                .set('Authorization',token)
                .send(data)
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                  //res.body.message.should.be.equal('Permissions denied');
                  res.body.should.have.property("data");
                  done(err);
                });
      });
      it('Post new category with data and wrong token header', (done) => {
          const data = {
            name: 'Test category',
            description: 'Something lorem ipsum'
            };
          server.post('/api/category')
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
      it('Post new category with data without token header', (done) => {
          const data = {
            name: 'Test category',
            description: 'Something lorem ipsum'
            };
          server.post('/api/category')
                .send(data)
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
            name: 'Test category'
            };
          server.post('/api/category')
                .set('Authorization',token)
                .send(data)
                .expect(403)
                .expect("Content-type",/json/)
                .end(function(err,res){
                  res.body.message.should.be.equal('Missing fields');
                  //res.body.should.have.property("data");
                  done(err);
                });
      });
  });
  describe('/PUT update a category', () => {
      var testCategory;
      beforeEach(function() {
        return Category.create({
          name:"test",
          description:"testing"
        }).then((category)=>{
          testCategory=category;
        }).catch((err)=>{
          done(err);
        });
      });
      it('Correct category id , token header, right permission', (done) => {
          const data = {
              name:"Another name",
              description:"Another description"
            };
          server.put('/api/category/'+testCategory._id)
                .set('Authorization',token)
                .send(data)
                .expect(200)
                .expect("Content-type",/json/)
                .end(function(err,res){
                  res.body.data.name.should.be.equal('Another name');
                  res.body.data.description.should.be.equal('Another description');
                  //res.body.should.have.property("data");
                  done(err);
                });
      });
  });

});

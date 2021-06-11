let mongoose = require("mongoose");
let User = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('User', () => {
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => {
      done();
    });
  });
  /*
    * Test the /GET route
    */
  describe('/GET users unauthorized', () => {
    it('it should Unauthorized without token', (done) => {
      chai.request(server)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('Signup', function () {

    it('should signup user', function (done) {
      chai.request(server)

        // register request
        .post('/signup')

        // send user registration details
        .send({
          'username': 'Piet',
          'password': 'tester',
          'role': 'admin'
        }

        ) // this is like sending $http.post or this.http.post in Angular
        .end((err, res) => { // when we get a resonse from the endpoint
          // in other words,
          // the res object should have a status of 201
          res.should.have.status(200);
          res.should.have.status(200);
          res.should.be.json;
          res.body.user.should.have.property('_id');
          res.body.user.should.have.property('username');
          res.body.user.should.have.property('password');
          res.body.user.should.have.property('role');
          done();
        });
    })
  })

  describe('/GET users authorized', () => {
    it('it should show all users', (done) => {
      chai.request(server)

        // register request
        .post('/signup')

        // send user registration details
        .send({
          'username': 'Frits',
          'password': 'tester',
          'role': 'admin'
        })
        .end((err, res) => { // when we get a resonse from the endpoint
          // in other words,
          // the res object should have a status of 201
          res.should.have.status(200);

          // follow up with login

          chai.request(server)
            .post('/login')
            // send user login details
            .send({
              'username': 'Frits',
              'password': 'tester'
            })
            .end((err, res) => {
              let token = res.body.token;

              chai.request(server)
                .get('/users')
                .send({ 'secret_token': token })
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  done();
                });
            });
        });
    });
  });




    describe('Login', function () {

      it('should Register user, login user', function (done) {
        chai.request(server)

          // register request
          .post('/signup')

          // send user registration details
          .send({
            'username': 'Henk',
            'password': 'tester',
            'role': 'admin'
          }

          ) // this is like sending $http.post or this.http.post in Angular
          .end((err, res) => { // when we get a resonse from the endpoint
            // in other words,
            // the res object should have a status of 201
            res.should.have.status(200);

            // follow up with login
            chai.request(server)
              .post('/login')
              // send user login details
              .send({
                'username': 'Henk',
                'password': 'tester'
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('token');
                done();
              });
          })
      })
    })


    describe('Delete', function () {

      it('should Register user, login user, check token and delete a user on /users/:id/ DELETE', function (done) {
        chai.request(server)

          // register request
          .post('/signup')

          // send user registration details
          .send({
            'username': 'Paul',
            'password': 'tester',
            'role': 'admin'
          }

          ) // this is like sending $http.post or this.http.post in Angular
          .end((err, res) => { // when we get a resonse from the endpoint
            let _id = res.body.user._id
            // in other words,
            // the res object should have a status of 201
            res.should.have.status(200);

            // follow up with login
            chai.request(server)
              .post('/login')
              // send user login details
              .send({
                'username': 'Paul',
                'password': 'tester'
              })
              .end((err, res) => {
                let token = res.body.token;

                // follow up with requesting user protected page
                chai.request(server)
                  .get('/users')
                  .send({ 'secret_token': token })
                  .end(function (err, res) {
                    chai.request(server)
                      .delete('/users/' + _id + '/delete')
                      .send({ 'secret_token': token })
                      .end(function (error, response) {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.have.property('_id');
                        response.body.should.have.property('username');
                        response.body.should.have.property('password');
                        response.body.should.have.property('role');
                        done();
                      });
                  })
              })
          })
      })
    })
  })

    

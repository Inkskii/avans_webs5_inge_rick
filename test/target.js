let mongoose = require("mongoose");
let Target = require('../models/target');
let faker = require("faker");

//Require the dev-dependencies
let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Target', () => {
    beforeEach((done) => { //Before each test we empty the database
        Target.remove({}, (err) => {
            done();
        });
    });

    describe('/GET targets unauthorized', () => {
        it('it should Unauthorized without token', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });



    describe('/GET targets', () => {
        it('it should return all targets', (done) => {
            chai.request(server)

                // register request
                .post('/signup')

                // send user registration details
                .send({
                    'username': 'Kees',
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
                            'username': 'Kees',
                            'password': 'tester'
                        })
                        .end((err, res) => {
                            let token = res.body.token;

                            chai.request(server)
                                .get('/targets')
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

    //target create
    describe('Create targets', () => {
        it('it should create a new target', (done) => {
            chai.request(server)

                // register request
                .post('/signup')

                // send user registration details
                .send({
                    'username': 'Mien',
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
                            'username': 'Mien',
                            'password': 'tester'
                        })
                        .end((err, res) => {
                            let token = res.body.token;

                            chai.request(server)
                                .post('/targets/create')
                                .send({
                                    'uri': faker.image.cats(),
                                    'name': faker.name.findName(),
                                    'city': 'Oss',
                                    'secret_token': token
                                })
                                .end((err, res) => {
                                    res.should.have.status(201);
                                    res.body.should.have.property('uri');
                                    res.body.should.have.property('name');
                                    res.body.should.have.property('city');
                                    res.body.should.have.property('tags');
                                    done();
                                });
                        });
                });
        });
    });



    //target search field
    describe('Search target by city', () => {
        it('it should retun all targets in a city', (done) => {
            chai.request(server)

                // register request
                .post('/signup')

                // send user registration details
                .send({
                    'username': 'Jose',
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
                            'username': 'Jose',
                            'password': 'tester'
                        })
                        .end((err, res) => {
                            let token = res.body.token;
                            let uri = faker.image.cats();
                            let name = faker.name.findName();
                            chai.request(server)
                                .post('/targets/create')
                                .send({
                                    'uri': uri,
                                    'name': name,
                                    'city': 'Lith',
                                    'secret_token': token
                                })
                                .end((err, res) => {
                                    chai.request(server)
                                        .get('/targets/Lith')
                                        .send({'secret_token' : token})
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body[0].uri.should.be.eql(uri)
                                            res.body[0].name.should.be.eql(name)
                                            done();
                                        });
                                });
                        });
                });
        });
    });
});
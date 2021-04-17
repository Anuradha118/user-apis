const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require("faker");
const randomstring = require("randomstring");
const should = chai.should();
var mongoose = require("mongoose");
var server = require('../index');

chai.use(chaiHttp)
describe('## User API Tests', () => {
    it('should add a user on /register POST', function(done) {
        let email = faker.internet.email();
        chai.request(server)
            .post('/v1/users/register')
            .set('x-token', 'tyyreu')
            .send({
                email: email,
                password: randomstring.generate(6),
                "tasks": [
                    {
                        "text":"Task1"
                    },
                    {
                        "text":"Task2"
                    }
                ]
            })
            .end(function(err, res) {

                // the res object should have a status of 201
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('email');
                res.body.should.have.property('tasks');
                res.body.should.have.property('_id');
                res.body.email.should.equal(email);
                done();
            });
    });

    it('should not create a user on /register POST if email and password is missing', function(done) {
        chai.request(server)
            .post('/v1/users/register')
            .set('x-token', 'tyyreu')
            .send({
                "tasks": [
                    {
                        "text":"Task1"
                    },
                    {
                        "text":"Task2"
                    }
                ]
            })
            .end(function(err, res) {

                // the res object should have a status of 201
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.equal('Email and Password are required.');
                done();
            });
    });

    it('should not create a user on /register POST if email is not valid', function(done) {
        chai.request(server)
            .post('/v1/users/register')
            .set('x-token', 'tyyreu')
            .send({
                "email": 'tst1tst.com',
                "password":'Test1234',
                 "tasks": [
                    {
                        "text":"Task1"
                    },
                    {
                        "text":"Task2"
                    }
                ]
            })
            .end(function(err, res) {

                // the res object should have a status of 201
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.contain('is not a valid email');
                done();
            });
    });

    it('should not create a user on /register POST if email already exist', function(done) {
        chai.request(server)
            .post('/v1/users/register')
            .set('x-token', 'tyyreu')
            .send({
                "email": 'test5@test.com',
                "password":'Test1234',
                 "tasks": [
                    {
                        "text":"Task1"
                    },
                    {
                        "text":"Task2"
                    }
                ]
            })
            .end(function(err, res) {

                // the res object should have a status of 201
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.contain('already exist');
                done();
            });
    });

    it('should create and delete a user', function(done) {
        let email = faker.internet.email();
        chai.request(server)
            .post('/v1/users/register')
            .set('x-token', 'tyyreu')
            .send({
                email: email,
                password: randomstring.generate(6),
                 "tasks": [
                    {
                        "text":"Task1"
                    },
                    {
                        "text":"Task2"
                    }
                ]
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                
                chai.request(server)
                    .delete('/v1/users/'+res.body._id)
                    .set('x-token', 'tretyyu')
                    .end(function(error,res1){
                        res1.should.have.status(200);
                        res1.should.be.json;
                        res1.body.should.be.a('object');
                        res1.body.should.have.property('_id');
                        done();
                    })
            });
    });

    it('should throw error if matching user id not found', function(done) {
        chai.request(server)
            .delete('/v1/users/607a9cefe99c8266a837')
            .set('x-token', 'tretyyu')
            .end(function(error,res){
                res.should.have.status(404);
                res.text.should.equal('Please send a valid user!');
                done();
            })
    });

    it('should create, login user, return token in header, get all users, get a user and all his tasks', function(done) {
        let email = faker.internet.email();
        let password = randomstring.generate(6)
        chai.request(server)
            .post('/v1/users/register')
            .set('x-token', 'tyyreu')
            .send({
                email: email,
                password: password,
                 "tasks": [
                    {
                        "text":"Task1"
                    },
                    {
                        "text":"Task2"
                    }
                ]
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                
                chai.request(server)
                    .post('/v1/users/signin')
                    .send({
                        email: email,
                        password: password
                    })
                    .end(function(error,res1){
                        res1.should.have.status(200);
                        res1.header.should.have.property('x-auth')
                        res1.should.be.json;
                        res1.body.should.be.a('object');
                        res1.body.should.have.property('_id');
                        const token = res1.header['x-auth']
                        chai.request(server)
                            .get('/v1/users?limit=5&page=1')
                            .set('x-auth', token)
                            .end(function(err1, response){
                                response.should.have.status(200);
                                response.should.be.json;
                                response.body.should.be.a('object');
                                response.body.should.have.property('users');
                                response.body.should.have.property('limit');
                                response.body.should.have.property('page');
                                response.body.should.have.property('totalResults');

                                chai.request(server)
                                    .get('/v1/users/'+ response.body.users[0]._id)
                                    .set('x-auth', token)
                                    .end(function(err2, res2){
                                        res2.should.have.status(200);
                                        res2.should.be.json;
                                        res2.body.should.be.a('object');
                                        res2.body.should.have.property('email'); 
                                        res2.body.should.have.property('_id');
                                        res2.body.should.have.property('tasks');
                                        done();
                                    })
                            })
                    })
            });
    });
  });
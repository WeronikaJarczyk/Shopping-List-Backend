var expect = require('chai').expect;

let mongoose = require("mongoose");
let User = require('../models/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('/POST register new user', () => {
  it('sending valid user', (done) => {
    let user = {
      login: "marcheweczka",
      password: "hasełko",
      email: "marchew@gmail.com"
    };

    chai.request(server)
      .post('/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message');
        done();
      });
  });

  it('sending user that already exists', (done) => {
    let user = {
      login: "marcheweczka",
      password: "hasełko",
      email: "marchew@gmail.com"
    };

    chai.request(server)
      .post('/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').that.is.equal('User already exists');
        done();
      });
  });
});


describe('/POST login user', () => {
  it('sending valid user', (done) => {
    let user = {
      login: "marcheweczka",
      password: "hasełko",
    };

    chai.request(server)
      .post('/users/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('accessToken');
        done();
      });
  });

  it('sending wrong login', (done) => {
    let user = {
      login: "buraczek",
      password: "hasełko",
    };

    chai.request(server)
      .post('/users/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').that.is.equal('Wrong login or password');
        done();
      });
  });

  it('sending wrong password', (done) => {
    let user = {
      login: "marianek23",
      password: "hasełko",
    };

    chai.request(server)
      .post('/users/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').that.is.equal('Wrong password');
        done();
      });
  });
});
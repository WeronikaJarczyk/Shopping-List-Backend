var expect = require('chai').expect;

let mongoose = require("mongoose");
let List = require('../models/List');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGVlZGZjZGYxNGE1NzNlZWMzZDE2NTQiLCJsb2dpbiI6Im1hcmlhbmVrMjMiLCJpYXQiOjE2MjY4NTE5NDZ9.hfOfMTM39kmfB6k5H0JZ1JvOv6XpqrXFq0jBWDiZIng";

chai.use(chaiHttp);
//Our parent block
describe('Lists', () => {
  beforeEach((done) => { //Before each test we empty the database
    List.deleteMany({}, (err) => {
      done();
    });
  });
  /*
    * Test the /GET route
    */
  describe('/GET list', () => {
    it('it should GET all the lists-empty array', (done) => {
      chai.request(server)
        .get('/lists')
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object').that.has.property("lists");
          res.body.lists.should.be.an('array').that.is.empty;
          done();
        });
    });
  });

});

describe('/POST new list', () => {
  it('sending valid list', (done) => {
    let list = {
      userId: "1234367878467",
      name: "J.R.R. Tolkien",
      items: [
        {
          "item": "banany",
          "amount": 3,
          "unit": "kg",
          "id": "id1"
        },
      ],
    };

    chai.request(server)
      .post('/lists/save')
      .set("Authorization", `Bearer ${token}`)
      .send(list)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.newList.should.have.property('_id');
        done();
      });
  });
});


describe('/GET list', () => {
  it('it should GET all the lists for marianek23', (done) => {
    chai.request(server)
      .get('/lists')
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object').that.has.property("lists");
        res.body.should.have.nested.property('lists[0].userId');
        done();
      });
  });
});


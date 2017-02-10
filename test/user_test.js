let Chai = require('chai');
let Expect = Chai.expect;
let ChaiHttp = require('chai-http');
Chai.use(ChaiHttp);

import Env from '../src/env';
import SessionModel from '../src/models/session_model';
import UserModel from '../src/models/user_model';

const API = Env.api_host+'user/';
let Agent = Chai.request.agent(API);

const USER = {
  email: 'a@b.com',
  password: 'password', 
  first_name: 'A', 
  last_name: 'B'
};


// Shared tests
let userSignin = function(agent, callback) {
  it("POST signin", (done) => {
    agent.post('user/signin')
      .send({email: USER.email, password: USER.password})
      .end((err, res) => {
        Expect(res).to.have.status(200);
        Expect(res).to.have.cookie('_sid');
    
        let data = res.body.data;
        Expect(data).to.have.property('id');
        Expect(data.sid).to.exist;
        Expect(data.first_name).to.be.eql(USER.first_name);
        
        done();
        callback(data);
      });
  });
};
module.exports.userSignin = userSignin;


describe("user", () => {
  let _user = {}; 
  
  before((done) => {
    SessionModel.deleteAll(() => {
      UserModel.deleteAll(() => { done(); });  
    });
  });
  
  it("POST signup", (done) => {
    Agent.post('signup')
      .send(USER)
      .end((err, res) => {
        Expect(res).to.have.status(200);
        Expect(res).to.have.cookie('_sid');

        let data = res.body.data;
        Expect(data).to.have.property('id');
        Expect(data.sid).to.exist;
        Expect(data.first_name).to.be.eql(USER.first_name);
        
        done();
      });
  });
  
  it("POST signin", (done) => {
    Agent.post('signin')
      .send({email: USER.email, password: USER.password})
      .end((err, res) => {
        Expect(res).to.have.status(200);
        Expect(res).to.have.cookie('_sid');

        let data = res.body.data;
        Expect(data).to.have.property('id');
        Expect(data.sid).to.exist;
        Expect(data.first_name).to.be.eql(USER.first_name);
        
        _user = data;
        
        done();
      });
  });
  
  it("GET :id", (done) => {
    Agent.get(''+_user.id)
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        let data = res.body.data;
        Expect(data.id).to.be.eql(_user.id);
        Expect(data.first_name).to.be.eql(USER.first_name);
        
        done();
      });
  });
  
  it("PUT me", (done) => {
    Agent.put('me')
      .send({prop: 'display_name', value: 'A B 2'})
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        done();
      });
  });

  it("POST signout", (done) => {
    Agent.post('signout')
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        done();
      });
  });
  
});

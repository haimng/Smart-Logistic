let Chai = require('chai');
let Expect = Chai.expect;
let ChaiHttp = require('chai-http');
Chai.use(ChaiHttp);

import Env from '../src/env';
import ReceiverModel from '../src/models/receiver_model';

const API = Env.api_host;
let Agent = Chai.request.agent(API);

let UserTest = require('./user_test');

const RECEIVER = {
  first_name: 'Hải',
  last_name: 'Nguyễn', 
  state: 'Hà Nội', 
  city: 'Hà Nội', 
  address: 'Số 12, ngõ 172, phố Đội Cấn, quận Ba Đình',   
  email: 'a@b.com',
  phone: '09012345678'
};

describe("receiver", () => {
  let _user = {};
  let _receiver = {};
  
  before((done) => {
    ReceiverModel.deleteAll(() => { done(); });
  });
  
  UserTest.userSignin(Agent, (user) => {
    _user = user;
  });
  
  it("POST receiver", (done) => {
    Agent.post('receiver')
      .send(RECEIVER)
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        let data = res.body.data;
        Expect(data.id).to.exist;
        Expect(data.first_name).to.be.eql(RECEIVER.first_name);
        Expect(data.city).to.be.eql(RECEIVER.city);
        Expect(data.email).to.be.eql(RECEIVER.email);
        
        _receiver = data;
        
        done();
      });
  });
  
  it("GET receiver/mine", (done) => {
    Agent.get('receiver/mine')
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        let data = res.body.data;
        Expect(data).to.be.an('array');
        Expect(data).to.have.length.above(0);
        
        data = data[0];
        Expect(data.id).to.exist;
        Expect(data.first_name).to.be.eql(RECEIVER.first_name);
        Expect(data.city).to.be.eql(RECEIVER.city);
        Expect(data.email).to.be.eql(RECEIVER.email);
        
        done();
      });
  });
  
  it("GET receiver/:id", (done) => {
    Agent.get('receiver/'+_receiver.id)
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        let data = res.body.data;
        Expect(data.id).to.exist;
        Expect(data.first_name).to.be.eql(RECEIVER.first_name);
        Expect(data.city).to.be.eql(RECEIVER.city);
        Expect(data.email).to.be.eql(RECEIVER.email);
        
        done();
      });
  });
  
  it("PUT receiver/:id", (done) => {
    Agent.put('receiver/'+_receiver.id)
      .send({prop: 'address', value: '12/172 phố Đội Cấn, quận Ba Đình'})
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        done();
      });
  });

});

let Chai = require('chai');
let Expect = Chai.expect;
let ChaiHttp = require('chai-http');
Chai.use(ChaiHttp);

import Env from '../src/env';
import PackageModel from '../src/models/package_model';
import PackageHistoryModel from '../src/models/package_history_model';

import {NEW, SRC_PORTAL, DELIVERING, DEST_PORTAL, DELIVERED} from '../src/const';

const API = Env.api_host;
let Agent = Chai.request.agent(API);

let UserTest = require('./user_test');

const PACKAGE = {
  rid: '2',
  title: 'Title', 
  description: 'Description', 
  price: '100000', 
  size: '1',   
  weight: '500'
};

describe("package", () => {
  let _user = {};
  let _package = {};
  
  before((done) => {
    PackageModel.deleteAll(() => { done(); });
    PackageHistoryModel.deleteAll();
  });
  
  UserTest.userSignin(Agent, (user) => {
    _user = user;
  });
  
  it("POST package", (done) => {
    Agent.post('package')
      .send(PACKAGE)
      .end((err, res) => {
        Expect(res).to.have.status(200);

        let data = res.body.data;
        Expect(data.id).to.exist;
        Expect(data.sid).to.exist;
        Expect(data.code).to.exist;
        Expect(data.title).to.be.eql(PACKAGE.title);
        Expect(data.status).to.be.eql('new');
        
        _package = data;
        
        done();
      });
  });
  
  it("GET package/:id", (done) => {
    Agent.get('package/'+_package.id)
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        let data = res.body.data;
        Expect(data.id).to.exist;
        Expect(data.sid).to.exist;
        Expect(data.code).to.exist;
        Expect(data.id).to.be.eql(_package.id);
        Expect(data.title).to.be.eql(_package.title);
        
        done();
      });
  });
  
  it("PUT package/:id", (done) => {
    Agent.put('package/'+_package.id)
      .send({prop: 'title', value: 'Title2'})
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        done();
      });
  });
  
  it("PUT package/:id/status", (done) => {
    Agent.put('package/'+_package.id+'/status')
      .send({status: SRC_PORTAL, portal_id: _user.id, note: 'Dropped at source portal'})
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        done();
      });
  });
  
  it("GET package/:id/history", (done) => {
    Agent.get('package/'+_package.id+'/history')
      .end((err, res) => {
        Expect(res).to.have.status(200);
        
        let data = res.body.data;
        Expect(data).to.be.an('array');
        Expect(data).to.have.lengthOf(2);
        
        data = data[1];
        Expect(data.pid).to.be.eql(_package.id);
        Expect(data.status).to.be.eql(SRC_PORTAL);
        
        Expect(data.package).to.exist;
        Expect(data.package.id).to.be.eql(_package.id);
        
        Expect(data.portal).to.exist;
        Expect(data.portal.id).to.be.eql(_user.id);
        
        done();
      });
  });

});

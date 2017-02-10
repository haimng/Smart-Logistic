let Chai = require('chai');
let Expect = Chai.expect;
let ChaiHttp = require('chai-http');
Chai.use(ChaiHttp);

import Env from '../src/env';

const API = Env.api_host+'util/';

describe("util", () => {
  it("GET ping", (done) => {
    Chai.request(API)
      .get('ping')
      .end((err, res) => {
        Expect(res).to.have.status(200);
        done();
      });
  });
});

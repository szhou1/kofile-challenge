var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);

var Calc = require('../routes/calc');

describe('Calc', function() {

  describe('#getFees()', function() {
    it('should return 200 status code', function(done) {
      chai.request(server)
        .post('order/fees')
        .send({})
        .then((res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

});
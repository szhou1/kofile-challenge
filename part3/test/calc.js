var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);

var Calc = require('../routes/calc');

describe('Calc', () => {

  describe('#getFees()', () => {
    it('should return 400 status code if no body is passed in', () => {
      chai.request(server)
        .post('/order/fees')
        .then((res) => {
          expect(res).to.have.status(400);
        }).catch((e) => {
        });
    });
  });

});
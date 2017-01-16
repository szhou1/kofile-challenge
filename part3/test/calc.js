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

    it('should return fees for an order', () => {
      chai.request(server)
        .post('/order/fees')
        .send(
            [
              {
                "order_date": "1/11/2015",
                "order_number": "20150111000001",
                "order_items": [
                  {
                    "order_item_id": 1,
                    "type": "Real Property Recording",
                    "pages": 30
                  },
                  {
                    "order_item_id": 2,
                    "type": "Real Property Recording",
                    "pages": 1
                  }
                ]
              }
            ]
          )
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body[0].order_items.length).to.equal(2);
        });
    });

  });

  describe('#getDistributions()', () => {
    it('should return 400 status code if no body is passed in', () => {
      chai.request(server)
        .post('/order/distr')
        .then((res) => {
          expect(res).to.have.status(400);
        }).catch((e) => {
        });
    });

    it('should return distributions for an order', () => {
      chai.request(server)
        .post('/order/distr')
        .send(
            [
              {
                "order_date": "1/11/2015",
                "order_number": "20150111000001",
                "order_items": [
                  {
                    "order_item_id": 1,
                    "type": "Real Property Recording",
                    "pages": 30
                  },
                  {
                    "order_item_id": 2,
                    "type": "Real Property Recording",
                    "pages": 1
                  }
                ]
              }
            ]
          )
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys(['orders', 'totalDistributions']);
          expect(res.body.orders.length).to.equal(1);
          expect(res.body.orders[0].distributions.length).to.equal(4);
          expect(res.body.totalDistributions.length).to.equal(5);
        });
    });

  });



});
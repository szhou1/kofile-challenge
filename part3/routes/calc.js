var fs = require('fs');

var fees = JSON.parse(fs.readFileSync('./data/fees.json'));

//**************************
// Takes in orders and returns the associated fees
//**************************
var getFees = (req, res) => {

  if(!req || !req.body.length) {
    return res.sendStatus(400);
  }

  var result = [];
  var orders = req.body;

  orders.forEach((order) => {
    var orderPrice = 0.00;

    order.order_items.forEach((item) => {
      var itemPrice = 0.00;

      fees.forEach((feeCatType) => {
        if(feeCatType.order_item_type === item.type){
          itemPrice += parseFloat(feeCatType.fees[0].amount);

          if(feeCatType.fees[1]) {
            itemPrice += parseFloat(feeCatType.fees[1].amount) * (item.pages - 1);
          }
          orderPrice += itemPrice;
          item['item_price'] = roundTo2Decimals(itemPrice);
        }
      });
    });
    result.push({
      order_id: order.order_number,
      order_date: order.order_date,
      order_price: roundTo2Decimals(orderPrice),
      order_items: order.order_items.map(function(item) {
        return item;
      })
    })
  });

  res.send(result);
}


//**************************
// Takes in orders and returns the fund distributions
//**************************
var getDistributions = (req, res) => {

  if(!req || !req.body.length) {
    return res.sendStatus(400);
  }

  var totalDistributions = [];
  var totalOtherAmount = 0.00;
  var orders = req.body;
  var result = {
    orders: [],
    totalDistributions: totalDistributions
  };

  orders.forEach((order) => {

    var distributions = [];
    
    order.order_items.forEach((item) => {
      fees.forEach((feeCatType) => {
        if(feeCatType.order_item_type === item.type) {
          
          var price = feeCatType.fees[0].amount;
          
          feeCatType.distributions.forEach((distr) => {
            var amount = parseFloat(distr.amount);
            price -= amount;

            var found = false;
            distributions.forEach((fund) => {
              if(fund.name === distr.name) {
                fund.amount += amount;
                found = true;
              }
            });
            
            if(!found) {
              distributions.push({
                name: distr.name,
                amount: amount
              })
            }

            found = false;
            totalDistributions.forEach((fund) => {
              if(fund.name === distr.name) {
                fund.amount = roundTo2Decimals(fund.amount + amount);
                found = true;
              }
            });

            if(!found) {
              totalDistributions.push({
                name: distr.name,
                amount: roundTo2Decimals(amount)
              })
            }

          });

          if(price > 0) {
            distributions['Other'] = price;
            totalOtherAmount += price;
          }

        }
      })
    });

    result.orders.push({
      order_id: order.order_number,
      distributions: distributions
    });

  });

  totalDistributions.push({
    name: "Other",
    amount: roundTo2Decimals(totalOtherAmount)
  });

  res.send(result);
}

var roundTo2Decimals = (num) => {
  return Math.round(num * 100) / 100;
}

module.exports = {
  getFees: getFees,
  getDistributions: getDistributions
}